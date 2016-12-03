/**
 * Created by ASSOON on 2016/11/18.
 */
define(['bootstrap', 'avalon', 'sweet_alert', 'featurepack'], function (bootstrap, avalon, swal, featurepack) {
    var wechatCard, dataUrl;
    var colorsValue = "Color010Color020Color030Color040Color050Color060Color070Color080Color081Color082";
    var colors = ["#63b359", "#2c9f67", "#509fc9", "#5885cf", "#9062c0", "#d09a45", "#e4b138", "#ee903c", "#f08500", "#a9d92d"];
    var postdata = {joinname: ""};
    var cloudMail = {
        avalonStart: function () {
            wechatCard = avalon.define({
                $id: "wechatcard",
                joinname: "",
                wechatCardList: [],
                filldata: {},
                globalData: {},
                searchButton: function () {
                    postdata.gifname = wechatCard.gifname;
                    cloudMail.getResponse(postdata);
                },
                editCard: function () {
                    //编辑跳转地址带上参数
                    window.location.href ="#/card"
                },
                deleteCard: function (el) {
                    swal({
                            title: "确定删除吗?",
                            text: "您将会删除该会员卡!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: false
                        },
                        function () {
                            cloudMail.deleteCard({joinid:el.joinid});
                        });
                },
                clearAttr: function () {
                    $('.tips-msg').remove()
                },
                validate: featurepack.pack.checkValue(function () {
                    var postdata = {
                        gift_name: wechatCard.filldata.gift_name,
                        c_totalfee: wechatCard.filldata.c_totalfee,
                        gift_stock: wechatCard.filldata.gift_stock,
                        description: wechatCard.filldata.description,
                        gift_img: "img/profileimg.png"//还没有写插件
                    };
                    wechatCard.globalData.type == 1 ? (function () {
                        postdata.giftid = 0;
                        cloudMail.addGift(postdata);
                    })() : function () {
                        postdata.giftid = wechatCard.filldata.giftid;
                        cloudMail.editGift(postdata);
                    }()
                })
            });

            avalon.scan(document.body)
        },
        getResponse:function (postdata) {
            featurepack.pack.ajax(dataUrl.getwechatcadList, "get", postdata, function (result) {
                if (result.code == 0) {
                    var resultData = [];
                    $.each(result.data.joincardlist,function (index,child) {
                        child.color = colors[colorsValue.indexOf(child.color) / 8];
                        resultData.push(child)
                    });
                    wechatCard.wechatCardList = resultData;
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        deleteCard: function (d) {
            featurepack.pack.ajax(dataUrl.refundMoneyUrl, "get", d, function (result) {
                if (result.code == 0) {
                    swal("删除!", "您已经成功删除了此会员卡，点击OK关闭窗口。", "success");
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