/**
 * Created by ASSOON on 2016/11/20.
 */
define(['avalon','bootstrap','moment','daterangepicker','featurepack','plupload','sweet_alert'], function(avalon,bootstrap,moment,daterangepicker,featurepack,plupload,swal) {
    var dataUrl = null;
    var showList;
    var cloudMail = {
        avalonStart : function () {
            showList = avalon.define({
                $id:"showList",
                listData:[],
                globalData:{},
                filldata:{},
                addImage:function (el) {
                    cloudMail.judge(1,null);
                },
                closeBox:function () {
                    $("#infomationBox").css("display",'none');
                    $("#deleteimg").hide();
                    showList.filldata.ppUrl = 'img/noimage.jpg';
                },
                editImage:function (el) {
                    cloudMail.judge(2,el);
                },
                deleteInfo:function (el) {
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
                            cloudMail.deleteAlbumList({ids:el.ppid});
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
                            cloudMail.deleteImage({url:showList.filldata.ppUrl});
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
                            $(reasons[0].element).parents('.row-fluid').after('<p class="color-down tip">' + reasons[0].message + '</p>')
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
        deleteAlbumList:function (postdata) {
            featurepack.pack.ajax(dataUrl.deletBannerInfo,"post",postdata,function (result) {
                if(result.code == 0){
                    swal("删除成功!", "您已经成功删除了这条banner图片，点击OK关闭窗口。", "success");
                    $('#showSmallbox').click();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        //回调函数预览图片
        callback:function () {
            showList.filldata.ppUrl = arguments[0]
        },
        callBackGetUrl:function () {
            console.info(arguments[0]);
            showList.filldata.ppUrl = arguments[0].data.url;
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
                $("#infomationBox .modal-title").text("新增banner信息");
                showList.filldata = {
                    ppUrl:"img/noimage.jpg",
                    ppRemark:""
                }
            })():function () {
                value.ppUrl.indexOf('noimage.jpg')==-1?(function () {
                    $("#deleteimg").show();
                })():'';
                $("#infomationBox .modal-title").text("修改banner信息");
                showList.filldata = value;
            }();
            $("#infomationBox").css("display",'block')
        },
        //这个方法在修改里面删除已经上传的图片，只有删除了才可以重新上传不然后台图片会越来越多
        deleteImage:function () {
            featurepack.pack.ajax(dataUrl.deleteBannerUrl,"get",null,function (result) {
                if(result.code == 0){
                    showList.filldata.ppUrl = "img/noimage.jpg";
                    swal("删除成功!", "您已经成功删除了这张图片，点击OK关闭窗口。", "success");
                    $("#deleteimg").hide();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        }
    };

    var initStart = function (url) {
        dataUrl = url;
        featurepack.pack.upload(cloudMail.callback,cloudMail.callBackGetUrl,url.addBannerUrl);
        //分页和查询
        cloudMail.getResponse();
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});
