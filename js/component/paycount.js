/**
 * Created by ASSOON on 2016/11/7.
 */

define(['avalon','bootstrap','bootstrap_select','moment','daterangepicker','featurepack','sweet_alert'], function(avalon,bootstrap,selectpicker,moment,daterangepicker,featurepack,swal) {
    var dataUrl = null;
    var showList,searchList;
    var postdata = {
        starttime:"",
        endtime:"",
        flagid:"",
        merchantid:"",
        out_trade_no:"",
        paystate:"",
        username:""
    };
    var Fn = function () {
        this.avalonStart = function () {
                showList = avalon.define({
                    $id:"showList",
                    listData:[],
                    see:function (el) {
                        $('#showDialog').click();
                    },
                    refund:function (el) {
                        swal({
                                title: "确定要退款吗？?",
                                text: "退款以后将不会恢复!",
                                type: "warning",
                                showCancelButton: true,
                                cancelButtonText:"取消",
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "确定",
                                closeOnConfirm: false
                            },
                            function(){
                                cloudMail.getAjax.refundMoney({id:el.out_trade_no});
                            });
                    }
                });

                searchList = avalon.define({
                    $id:"searchList",
                    total:"0",//总笔数
                    sum:"0",//总收入
                    searchButton:function () {
                        $("form").serializeArray().map(function (child,index) {
                            postdata[child.name] = child.value
                        });
                        cloudMail.getResponse(postdata);
                    }
                });
                avalon.scan(document.body);
                };
                //分页插件封装的avalon需要传url
                this.fn = function () {
                    showList.listData = arguments[0].data.orderinfojson;
                    searchList.total = arguments[0].total;
                    searchList.sum = arguments[0].sum;
                };
                this.getResponse = function (data) {
                    featurepack.pack.pager(this.fn,data,dataUrl.getpaycountList);
                };
                this.getTime = function () {
                    postdata.starttime = arguments[0];
                    postdata.endtime = arguments[1];
                };
                this.getAjax = {
                    refundMoney:function (postdata) {
                        featurepack.pack.ajax(dataUrl.refundMoneyUrl,"get",postdata,function (result) {
                            if(result.code == 0){
                                swal("退款成功!", "您已经退款成功了，点击OK关闭窗口。", "success");
                            }else{
                                swal(result.msg,"", "error");
                            }
                        })
                    }
                }
    };
    var cloudMail = new Fn();
    var initStart = function (url) {
        dataUrl = url;
        //下拉选项初始化
        featurepack.pack.option();
        featurepack.pack.toggleTops();
        featurepack.pack.datePicker(cloudMail.getTime);
        //分页和查询
        cloudMail.getResponse(postdata);
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});