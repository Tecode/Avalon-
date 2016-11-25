/**
 * Created by ASSOON on 2016/11/7.
 */
define(['bootstrap','avalon','d3','rickshaw','featurepack'], function(bootstrap,avalon,d3,rickshaw,featurepack) {

    var initStart = function () {
        featurepack.pack.expand();
        $(".modalicon2").click();
    };
    return {
        init_start: initStart
    }
});