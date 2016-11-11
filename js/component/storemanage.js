/**
 * Created by ASSOON on 2016/11/11.
 */
define(['bootstrap','avalon','featurepack','sweet_alert'], function(bootstrap,avalon,featurepack,swal) {
    var overallSituation,url;

    var initStart = function (l) {
        url = l;
        cloudMail.avalonStart();
    };

    var Fn = function () {
        this.avalonStart = function () {
            overallSituation = avalon.define({
                $id:"storeManage",

                //-------------上面是发送的数据
                configList:[],
                addPayConfig:function () {
                    $("#showBigBox").click()
                },
                editPayConfig:function () {
                    $("#showBigBox").click()
                },
                toggleMolde:function (e) {
                    overallSituation.type = $(e.target).index('button');
                },
                deletePayConfig:function () {
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
                            alert("请求方法");
                            swal("删除成功!", "您已经删除了这项配置，点击OK关闭窗口。", "success");
                        });
                },
                bindData:{}
            });
            avalon.scan(document.body)
        };
        this.getAjax = {
            getResponse:function (postdata) {
                featurepack.pack.ajax(url.payConfigRetrun,"get",postdata,function (result) {
                    if(result.code == 0){
                        overallSituation.configList = result
                    }else{

                    }
                })
            },
            postPayConfig:function (postdata) {
                featurepack.pack.ajax(url.payConfigRetrun,"post",postdata,function (result) {
                    if(result.code == 0){

                    }else{

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