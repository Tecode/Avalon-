var require = {
    baseUrl: 'js',
    paths:{
        jquery:'bower_components/jquery/dist/jquery.min',
        bootstrap: 'bootstrap/bootstrap.min',
        bootstrap_select:'bootstrap-select/bootstrap-select',
        bootstrap_toggle:'bootstrap-toggle/bootstrap-toggle.min',
        easypiechart:'easypiechart/easypiechart',
        avalon: 'bower_components/avalon/dist/avalon',
        sammy: 'bower_components/sammy/lib/sammy',
        d3:'bower_components/d3/d3.min',
        rickshaw:'bower_components/rickshaw/rickshaw.min',
        jstree:'bower_components/jstree/dist/jstree.min',
        featurepack:'featurepack',
        moment:'moment/moment.min',
        daterangepicker:'date-range-picker/daterangepicker',
        jquery_select:'jquery.select',
        sweet_alert:'sweet-alert/sweet-alert.min',

//不要
        mmHistory: 'lib/mmHistory',
        mmRouter: 'lib/mmRouter',
        layer: 'lib/layer/layer',
        highcharts: 'lib/highcharts',
        select: 'lib/jquery.select',
        pager: 'lib/jquery.pager',
        datepicker: 'lib/datetime/js/bootstrap-datetimepicker',
        metisMenu: 'lib/metisMenu/metisMenu.min',
        WebUploader: 'lib/webuploader/webuploader.min',



        paycount:'component/paycount',//收款统计
        main:'component/main',//加载的首页
        user:'component/user',//人员管理
        goodsmanage:'component/goodsmanage',//商品管理
        payconfig:'component/payconfig',//支付配置
        storemanage:'component/storemanage',//门店管理
        offlinepay:'component/offlinepay'//线上商品

    },
    shim:{
        bootstrap:{deps:['jquery']},
        avalon: { exports: "avalon" },
        bootstrap_toggle:{deps:['jquery']},
        rickshaw:{deps:['d3']},
        sammy:{deps:['jquery']},
        daterangepicker:{deps:['bootstrap']},
        jquery_select:{deps:['jquery']},
        featurepack:{deps:['jquery']},
        bootstrap_select:{deps:['bootstrap']},
        mmHistory:{deps:['avalon']},
        mmRouter:{deps:['avalon']},
        jstree:{deps:['jquery']},
        layer:{deps:['jquery']},
        metisMenu:{deps:['jquery']}
    }
};
