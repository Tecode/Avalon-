/**
 * Created by ASSOON on 2016/11/11.
 */
define(['bootstrap','avalon','featurepack','plupload','sweet_alert'], function(bootstrap,avalon,featurepack,plupload,swal) {
    var overallSituation,url;

    var initStart = function (l) {
        url = l;
        cloudMail.getAjax.getResponse();
        cloudMail.avalonStart();
        featurepack.pack.upload(
            //转成64位编码
            cloudMail.callback,
            //获取服务器地址
            cloudMail.callBackGetUrl,url.addimgUrl,3,cloudMail.errorTips);
    };

    var Fn = function () {
        this.avalonStart = function () {
                overallSituation = avalon.define({
                    $id:"payConfig",
                        appid:"",
                        appkey:"",
                        appsecret:"",
                        mch_id:"",
                        merchantid:"",
                        merchantname:"",
                        payTypeChange:"",
                        repost_levenl:"",
                        sslcert_path:"请选择证书",
                        type:"1",

                        common:false,
                        server:true,
                        //-------------上面是发送的数据
                        configList:[],
                        list:{},
                        //验证表达式
                        validate: featurepack.pack.checkValue(function () {
                            if(overallSituation.sslcert_path=="请选择证书"){
                                swal("图片未上传！","请点击开始上传按钮上传图片。","error");
                            }else {
                                var postdata = {
                                    merchantname: overallSituation.merchantname,
                                    repost_levenl: overallSituation.repost_levenl,
                                    appid: overallSituation.appid,
                                    mch_id: overallSituation.mch_id,
                                    appsecret: overallSituation.appsecret,
                                    sslcert_path: overallSituation.sslcert_path,
                                    type: overallSituation.type,
                                    oldurl: globalData.oldurl
                                };
                                postdata.type == 1 ? (function () {
                                    delete postdata.sslcert_path;
                                    delete postdata.oldUrl;
                                })() : '';
                                globalData.type == 1 ? (function () {
                                    //添加
                                    postdata.merchantid = 0;
                                    cloudMail.getAjax.addPayConfig(postdata)
                                })() : (function () {
                                    //修改
                                    postdata.merchantid = globalData.data.merchantid;
                                    cloudMail.getAjax.postPayConfig(postdata)
                                })()
                            }
                        }),
                        addPayConfig:function () {
                            globalData = {type:1,oldurl:"",data:null};
                            overallSituation.common = false;
                            overallSituation.server = true;
                            $("#showBigBox").click();
                            overallSituation.merchantname = '';
                            overallSituation.repost_levenl = '';
                            overallSituation.appid = '';
                            overallSituation.appsecret = '';
                            overallSituation.mch_id = '';
                            overallSituation.appsecret = '';
                            overallSituation.sslcert_path = '';
                            overallSituation.type = "1";
                        },
                        clear:function () {
                            $('.tips-msg').remove();
                        },
                        editPayConfig:function (el) {
                            globalData = {type:2,oldurl:el.sslcert_path,data:el};
                            $("#showBigBox").click();

                            overallSituation.merchantname = el.merchantname;
                            overallSituation.repost_levenl = el.repost_levenl;
                            overallSituation.appid = el.appid;
                            overallSituation.appsecret = el.appsecret;
                            overallSituation.mch_id = el.mch_id;
                            overallSituation.appsecret = el.appsecret;
                            overallSituation.sslcert_path = el.sslcert_path;
                            overallSituation.type = el.type;
                            if(el.type == 1){
                                overallSituation.common = false;
                                overallSituation.server = true;
                            }else if(el.type == 2){
                                overallSituation.common = true;
                                overallSituation.server = false;
                            }
                        },
                        toggleMolde:function (e) {
                            overallSituation.type = $(e.target).index('button');
                            if($(e.target).index('button')==1){
                                overallSituation.common = false;
                                overallSituation.server = true;
                            }else if($(e.target).index('button')==2){
                                overallSituation.common = true;
                                overallSituation.server = false;
                            }
                        },
                        deletePayConfig:function (el) {
                            swal({
                                    title: "确定删除该支付配置?",
                                    text: "删除以后将不会恢复!",
                                    type: "warning",
                                    showCancelButton: true,
                                    cancelButtonText:"取消",
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "确定",
                                    closeOnConfirm: false
                                },
                                function(){
                                    cloudMail.getAjax.deletePayConfig({id:el.merchantid});
                                });
                        }
                });
                avalon.scan(document.body);

        };
        //回调函数预览图片
        this.callback = function () {
            overallSituation.sslcert_path = arguments[1];
        };
        this.errorTips = function () {
            swal(arguments[0],"上传文件出错了,关闭以后重新选择。", "error");
        };
        //回调函数加载正式图片地址
        this.callBackGetUrl = function () {
            swal("上传成功!", "您已经成功上传了文件，点击OK关闭窗口。", "success");
        };
            this.getAjax = {
            getResponse:function (postdata) {
                featurepack.pack.ajax(url.payConfigRetrun,"get",postdata,function (result) {
                    if(result.code == 0){
                        overallSituation.configList = result.data.merchant;
                    }else{
                        swal(result.msg,"","error");
                    }
                })
            },
            postPayConfig:function (postdata) {
                featurepack.pack.ajax(url.editPayConfig,"post",postdata,function (result) {
                    if(result.code == 0){
                        swal("修改成功!", "您已经修改了这项配置，点击OK关闭窗口。", "success");
                        cloudMail.getAjax.getResponse();
                        $("#showBigBox").click();
                        globalData = null;
                    }else{
                        swal(result.msg,"","error");
                    }
                })
            },
            addPayConfig:function (postdata) {
                console.info(postdata)
                featurepack.pack.ajax(url.addPayConfig,"post",postdata,function (result) {
                    if(result.code == 0){
                        swal("添加成功!", "您已经添加了这项配置，点击OK关闭窗口。", "success");
                        $("#showBigBox").click();
                        globalData = null;
                        cloudMail.getAjax.getResponse();
                    }else{
                        swal(result.msg,"","error");
                    }
                })
            },
            deletePayConfig:function (postdata) {
                featurepack.pack.ajax(url.deletepayConfig,"post",postdata,function (result) {
                    if(result.code == 0){
                        swal("删除成功!", "您已经删除了这项配置，点击OK关闭窗口。", "success");
                    }else{
                        swal(result.msg,"", "error");
                    }
                })
            }
        }
    };

    var cloudMail = new Fn();

    return {
        init_start: initStart
    }
});