/**
 * Created by ASSOON on 2016/11/7.
 */

define(['avalon','bootstrap','moment','daterangepicker','featurepack'], function(avalon,bootstrap,moment,daterangepicker,featurepack) {
    var dataUrl = null;
    var showList;
    var initStart = function (url) {
        dataUrl = url;
        featurepack.pack.datePicker();
    //分页插件封装的avalon需要传url
        var fn = function () {
            showList.listData = arguments[0].data.orderinfojson;
        };
        var getResponse = function (data) {
            featurepack.pack.pager(fn,data,dataUrl.getpaycountList);
        };
        getResponse();
        initControler();

    };

    function initControler() {
        showList = avalon.define({
            $id:"showList",
            listData:[],
            searchButton:function () {
                alert(10)
            }
        });


        avalon.scan(document.body);
    }

    return {
        init_start: initStart
    };
});