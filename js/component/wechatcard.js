/**
 * Created by ASSOON on 2016/11/18.
 */
define(['bootstrap','avalon','jstree','jquery_select','sweet_alert','featurepack'], function(bootstrap,avalon,jstree,jquery_select,swal,featurepack) {
    var wechatCard,dataUrl;
    var postdata = {joinname:""};
    var cloudMail = {
        avalonStart:function () {
            wechatCard = avalon.define({
                $id:"wechatcard",
                joinname:"",
                wechatCardList:[],
                filldata:{},
                globalData:{},
                searchButton:function () {
                    postdata.gifname = wechatCard.gifname;
                    cloudMail.getResponse(postdata);
                },
                addGift:function () {
                    cloudMail.Judgment(1,null);
                    wechatCard.globalData ={type:1}
                },
                editGift:function (el) {
                    wechatCard.globalData ={type:2};
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
                        gift_name:wechatCard.filldata.gift_name,
                        c_totalfee:wechatCard.filldata.c_totalfee,
                        gift_stock:wechatCard.filldata.gift_stock,
                        description:wechatCard.filldata.description,
                        gift_img:"img/profileimg.png"//还没有写插件
                    };
                    wechatCard.globalData.type ==1?(function () {
                        postdata.giftid = 0;
                        cloudMail.addGift(postdata);
                    })():function () {
                        postdata.giftid = wechatCard.filldata.giftid;
                        cloudMail.editGift(postdata);
                    }()
                })
            });

            avalon.scan(document.body)
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            wechatCard.wechatCardList = arguments[0].data.giftlist;
        },
        getResponse:function (data) {
            featurepack.pack.pager(cloudMail.fn,data,dataUrl.getgiftmanageList);
        },
        Judgment:function (type,value) {
            type==1?(function () {
                wechatCard.filldata = {gift_name:"",c_totalfee:"",gift_stock:"",description:"",gift_img:"img/profileimg.png"};
            })():(function () {
                wechatCard.filldata = value;
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