/**
 * Created by ASSOON on 2016/11/20.
 */
define(['avalon','bootstrap','moment','daterangepicker','featurepack','plupload','sweet_alert'], function(avalon,bootstrap,moment,daterangepicker,featurepack,plupload,swal) {
    var dataUrl = null;
    var showList,searchList;
    var cloudMail = {
        avalonStart : function () {
            showList = avalon.define({
                $id:"showList",
                listData:[],
                globalData:{},
                filldata:{},
                addImage:function (el) {
                    $("#infomationBox").css("display",'block')
                },
                closeBox:function () {
                    $("#infomationBox").css("display",'none')
                },
                editImage:function (el) {
                    $("#infomationBox").css("display",'block')
                },
                deleteInfo:function () {
                    swal({
                            title: "确定删除吗?",
                            text: "您将会此条首页图片所有信息!",
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
                deleteImage:function () {
                    swal({
                            title: "确定删除此图片吗?",
                            text: "您将会删除这张图片!",
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
                validate: {
                    onValidateAll: function (reasons) {
                        reasons.length == 0 ? (function () {
                            showList.globalData.type==1?(function () {
                                cloudMail.addMore({xffee:showList.xffee})
                            })():(function () {
                                cloudMail.addMore({recharge:showList.recharge})
                            })()
                        })() : (function () {
                            $('.tip').remove();
                            $(reasons[0].element).parents('.errortips').after('<p class="color-down tip">' + reasons[0].message + '</p>')
                        })();
                    },
                    validateInBlur: true
                },
                clear: function () {
                    $('.tip').remove();
                }
            });
            avalon.scan(document.body);
        },
        addMore:function (postdata) {
            featurepack.pack.ajax(dataUrl.getembershipcardList,"get",postdata,function (result) {
                if(result.code == 0){
                    swal("添加成功!", "您已经添加成功了，点击OK关闭窗口。", "success");
                    $('#showSmallbox').click();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        //分页插件封装的avalon需要传url
        getResponse:function () {
            featurepack.pack.ajax(dataUrl.getAlbumList,"get",null,function (result) {
                if(result.code == 0){
                    showList.listData = result.imgtitleInfolist;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        judge:function (type,value) {
            type==1?(function () {
                $(".tips").text("新增会员线下消费金额")
            })():function () {
                $(".tips").text("新增会员线下充值金额")
            }();
            $('#showSmallbox').click()
        }
    };

    var initStart = function (url) {
        dataUrl = url;
        featurepack.pack.upload();
        //分页和查询
        cloudMail.getResponse();
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});
