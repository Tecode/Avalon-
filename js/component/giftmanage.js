/**
 * Created by ASSOON on 2016/11/9.
 */
define(['bootstrap','avalon','cropbox','sweet_alert','featurepack'], function(bootstrap,avalon,cropbox,swal,featurepack) {
    var giftManage,dataUrl;
    var postdata = {gifname:""};
    var cloudMail = {
        avalonStart:function () {
            giftManage = avalon.define({
                $id:"giftmanage",
                gifname:"",
                offlinepayList:[],
                filldata:{},
                globalData:{},
                searchButton:function () {
                    postdata.gifname = giftManage.gifname;
                    cloudMail.getResponse(postdata);
                },
                addGift:function () {
                    cloudMail.Judgment(1,null);
                    giftManage.globalData ={type:1}
                },
                editGift:function (el) {
                    giftManage.globalData ={type:2};
                    cloudMail.Judgment(2,el);
                },
                uploadimg:function () {
                    $("#file").click();
                },
                downGift:function (el) {
                    swal({
                            title: "确定下架吗？?",
                            text: "您将会下架该商品!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: false
                        },
                        function () {
                            cloudMail.downGift(el.giftid);
                        });
                },
                clearAttr:function () {
                    $('.tips-msg').remove()
                },
                validate: featurepack.pack.checkValue(function () {
                    var postdata ={
                        gift_name:giftManage.filldata.gift_name,
                        c_totalfee:giftManage.filldata.c_totalfee,
                        gift_stock:giftManage.filldata.gift_stock,
                        description:giftManage.filldata.description,
                        gift_img:giftManage.filldata.gift_img
                    };
                    giftManage.globalData.type ==1?(function () {
                        postdata.giftid = 0;
                        cloudMail.addGift(postdata);
                    })():function () {
                        postdata.giftid = giftManage.filldata.giftid;
                        cloudMail.editGift(postdata);
                    }()
                })
            });

            avalon.scan(document.body)
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            giftManage.offlinepayList = arguments[0].data.giftlist;
        },
        getResponse:function (data) {
            featurepack.pack.pager(cloudMail.fn,data,dataUrl.getgiftmanageList);
        },
        Judgment:function (type,value) {
            type==1?(function () {
                giftManage.filldata = {gift_name:"",c_totalfee:"",gift_stock:"",description:"",gift_img:"img/profileimg.png"};
            })():(function () {
                giftManage.filldata = value;
            })();
            $('#showBigBox20').click();
        },
        editGift:function (postdata) {
            featurepack.pack.ajax(dataUrl.editPayUrl, "post", postdata, function (result) {
                if (result.code == 0) {
                    swal("修改成功!", "您已经修改了该成员，点击OK关闭窗口。", "success");
                    $("#showBigBox20").click();
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        addGift:function (postdata) {
            console.info(postdata)
            featurepack.pack.ajax(dataUrl.addPayUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    swal("添加成功!", "您已经添加成员，点击OK关闭窗口。", "success");
                    $("#showBigBox20").click();
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        getdata:function () {
            imgData64 = arguments[0];
        },
        downGift:function () {
            featurepack.pack.ajax(dataUrl.refundMoneyUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    swal("下架成功!", "您已经成功下架此商品，点击OK关闭窗口。", "success");
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        savaimage:function (postdata) {
            featurepack.pack.ajax(dataUrl.saveImageUrl,"post",postdata,function (result) {
                if(result.code == 0){
                    $('.loader').fadeOut(200);
                    giftManage.filldata.gift_img = result.data.url;
                    imgData64 = null;
                    $('#modalicon').click();
                    swal("保存成功!", "您已经成功修改了这张图片，点击OK关闭窗口。", "success");
                }else{
                    $('#modalicon').click();
                    swal(result.msg,"", "error");
                    $('.loader').fadeOut(200);

                }
            })
        }
    };
    var initStart = function (l) {
        dataUrl = l;
        $('#saveimg').on('click',function () {cloudMail.savaimage({imageData:imgData64});$('.loader').fadeIn(100)});
        featurepack.pack.toggleTops();
        cloudMail.getResponse(postdata);
        cloudMail.avalonStart();
        featurepack.pack.cropimage(cloudMail.getdata);
    };
    return {
        init_start: initStart
    }
});