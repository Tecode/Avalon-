/**
 * Created by ASSOON on 2016/11/11.
 */
define(['bootstrap','avalon','featurepack','sweet_alert'], function(bootstrap,avalon,featurepack,swal) {
    var overallSituation,url;

    var initStart = function (l) {
        url = l;
        cloudMail.getAjax.getResponse();
        cloudMail.avalonStart();
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
                        sslcert_path:"",
                        type:"1",

                        common:false,
                        server:true,
                        //-------------上面是发送的数据
                        configList:[],
                        list:{},
                        //验证表达式
                        validate: {
                            onError: function (reasons) {
                                reasons.forEach(function (reason) {
                                    console.log(reason.getMessage())
                                })
                            },
                            onValidateAll: function (reasons) {
                                if (reasons.length) {
                                    console.log(reasons);
                                } else {
                                    var postdata = {
                                        appid:overallSituation.appid,
                                        appkey:overallSituation.appkey,
                                        appsecret:overallSituation.appsecret,
                                        mch_id:overallSituation.mch_id,
                                        merchantid:overallSituation.merchantid,
                                        merchantname:overallSituation.merchantname,
                                        payTypeChange:overallSituation.payTypeChange,
                                        repost_levenl:overallSituation.repost_levenl,
                                        sslcert_path:overallSituation.sslcert_path,
                                        type:overallSituation.type
                                    };
                                        if(overallSituation.appid ==""){
                                            cloudMail.getAjax.addPayConfig(postdata);
                                        }else {
                                            cloudMail.getAjax.postPayConfig(postdata);
                                        }
                                }
                            },
                            validateInBlur:true,
                            validateInKeyup:true
                        },
                        addPayConfig:function () {
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
                        editPayConfig:function (el) {
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
                    }else{
                        swal(result.msg,"","error");
                    }
                })
            },
            addPayConfig:function (postdata) {
                featurepack.pack.ajax(url.addPayConfig,"post",postdata,function (result) {
                    if(result.code == 0){
                        swal("添加成功!", "您已经添加了这项配置，点击OK关闭窗口。", "success");
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