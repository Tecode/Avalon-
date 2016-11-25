/**
 * Created by ASSOON on 2016/11/20.
 */
define(['avalon','bootstrap','moment','daterangepicker','featurepack','plupload','sweet_alert'], function(avalon,bootstrap,moment,daterangepicker,featurepack,plupload,swal) {
    var dataUrl = null;
    var showList;
    var postdata = {oldimgesrc:""};
    var cloudMail = {
        avalonStart : function () {
            showList = avalon.define({
                $id:"showList",
                listData:[],
                globalData:{},
                filldata:{
                    ppUrl:'img/noimage.jpg'
                },
                addImage:function (el) {
                    cloudMail.judge(1,null);
                    globalData = {type:1,data:null}
                },
                closeBox:function () {
                    $("#infomationBox").css("display",'none');
                    $("#deleteimg").hide();
                    showList.filldata.ppUrl = 'img/noimage.jpg';
                },
                editImage:function (el) {
                    postdata.oldimgesrc = el.ppUrl;
                    cloudMail.judge(2,el);
                    globalData = {type:2,data:el}
                },
                validate: {
                    onValidateAll: function (reasons) {
                        if(showList.filldata.ppUrl.length>100){
                            swal("图片未上传！","请点击开始上传按钮上传图片。","error");
                        }else {
                            postdata.imgesrc = showList.filldata.ppUrl;
                            postdata.ppRemark = showList.filldata.ppRemark;
                            reasons.length == 0 ? (function () {
                                postdata.ids = "0";
                                globalData.type==1?(function () {
                                    cloudMail.addBanner(postdata);
                                })():(function () {
                                    postdata.ids = globalData.data.ppid;
                                    cloudMail.editBanner(postdata);
                                })()
                            })() : (function () {
                                $('.tip').remove();
                                $(reasons[0].element).parents('.row-fluid').after('<p class="color-down tip">' + reasons[0].message + '</p>')
                            })();
                        }
                    },
                    validateInBlur: true
                },
                clear: function () {
                    $('.tip').remove();
                }
            });
            avalon.scan(document.body);
        },
        //回调函数预览图片
        callback:function () {
            showList.filldata.ppUrl = arguments[0];
        },
        //回调函数加载正式图片地址
        callBackGetUrl:function () {
            showList.filldata.ppUrl = arguments[0].data.url;
            // globalData.url = true;
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
        editBanner:function (postdata) {
            featurepack.pack.ajax(dataUrl.editBannerUrl,"get",postdata,function (result) {
                if(result.code == 0){
                    showList.filldata.ppUrl = "img/noimage.jpg";
                    swal("修改成功!", "您已经成功修改了这张图片，点击OK关闭窗口。", "success");
                    $("#deleteimg").hide();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        addBanner:function (postdata) {
            console.log(postdata)
            featurepack.pack.ajax(dataUrl.addBannerUrl,"get",postdata,function (result) {
                if(result.code == 0){
                    showList.filldata.ppUrl = "img/noimage.jpg";
                    swal("添加成功!", "您已经成功添加了这张图片，点击OK关闭窗口。", "success");
                    $("#deleteimg").hide();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        }
    };

    var initStart = function (url) {
        dataUrl = url;
        //分页和查询
        cloudMail.getResponse();
        cloudMail.avalonStart();
        featurepack.pack.upload(
            //转成64位编码
            cloudMail.callback,
            //获取服务器地址
            cloudMail.callBackGetUrl,url.addBannerUrl);

    };
    return {
        init_start: initStart
    };
});
