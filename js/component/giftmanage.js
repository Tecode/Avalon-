/**
 * Created by ASSOON on 2016/11/9.
 */
define(['bootstrap','avalon','jstree','jquery_select','sweet_alert','featurepack'], function(bootstrap,avalon,jstree,jquery_select,swal,featurepack) {
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
                        gift_img:"img/profileimg.png"//还没有写插件
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
            $('#showBigBox').click();
        },
        editGift:function (postdata) {
            featurepack.pack.ajax(dataUrl.editPayUrl, "post", postdata, function (result) {
                if (result.code == 0) {
                    swal("修改成功!", "您已经修改了该成员，点击OK关闭窗口。", "success");
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
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        downGift:function () {
            featurepack.pack.ajax(dataUrl.refundMoneyUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    swal("下架成功!", "您已经成功下架此商品，点击OK关闭窗口。", "success");
                } else {
                    swal(result.msg, "", "error");
                }
            })
        }
    };
    var initStart = function (l) {
        dataUrl = l;
        featurepack.pack.toggleTops();
        cloudMail.getResponse(postdata);
        cloudMail.avalonStart();
    };
    return {
        init_start: initStart
    }
});