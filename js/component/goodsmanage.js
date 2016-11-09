/**
 * Created by ASSOON on 2016/11/9.
 */

define(['avalon','bootstrap','featurepack'], function(avalon,bootstrap,featurepack) {
    var dataUrl = null;
    var showList;
    var initStart = function (url) {
        dataUrl = url;
        //分页插件封装的avalon需要传url
        var fn = function () {
            showList.listData = arguments[0].data.orderinfojson;
            console.info(arguments[0])
        };
        featurepack.pack.pager(fn,url);
        initControler();

    };

    function initControler() {
        showList = avalon.define({
            $id:"showList",
            listData:[]
        });


        avalon.scan(document.body);
    }

    return {
        init_start: initStart
    };
});