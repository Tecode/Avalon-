/**
 * Created by ASSOON on 2016/11/18.
 */
define(['avalon','bootstrap','bootstrap_select','moment','daterangepicker','featurepack','sweet_alert'], function(avalon,bootstrap,selectpicker,moment,daterangepicker,featurepack,swal) {
    var dataUrl = null;
    var vipCard;
    var cloudMail = {
        avalonStart:function () {
            vipCard = avalon.define({

            });
            avalon.scan(document.body);
        },
        Judgment:function (type,value) {

            $('#showBigBox').click();
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            showList.listData = arguments[0].data.cardtend;
        },
        getResponse:function (data) {
            featurepack.pack.pager(cloudMail.fn,data,dataUrl.getcardcountList);
        },
        getTime:function () {
            postdata.starttime = arguments[0];
            postdata.endtime = arguments[1];
        },
        deleteCard:function (postdata) {
                featurepack.pack.ajax(dataUrl.refundMoneyUrl,"get",postdata,function (result) {
                    if(result.code == 0){
                        swal("删除成功!", "您已经删除该卡券成功了，点击OK关闭窗口。", "success");
                    }else{
                        swal(result.msg,"", "error");
                    }
                })
            },
        editCard:function (postdata) {
            featurepack.pack.ajax(dataUrl.editCardUrl,"get",postdata,function (result) {
                if(result.code == 0){
                    swal("修改成功!", "您已经成功修改了卡券，点击OK关闭窗口。", "success");
                    globalData = null;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        addCard:function (postdata) {
            featurepack.pack.ajax(dataUrl.addCardUrl,"get",postdata,function (result) {
                if(result.code == 0){
                    swal("添加成功!", "您已经添加该卡券成功了，点击OK关闭窗口。", "success");
                    globalData = null;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        }
    };
    var initStart = function (url) {
        dataUrl = url;
        // //下拉选项初始化
        // featurepack.pack.option();
        // featurepack.pack.toggleTops();
        // featurepack.pack.datePicker(cloudMail.getTime,"#date-range-picker",false);
        // featurepack.pack.datePicker(cloudMail.getTime,"#date-picker",true);
        // //分页和查询
        // cloudMail.getResponse(postdata);
        // cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});