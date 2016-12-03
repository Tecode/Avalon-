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
        es6promise:'bower_components/es6-promise/es6-promise.auto.js',
        plupload:'bower_components/plupload/plupload.min',
        niceScroll:'bower_components/jquery.nicescroll/jquery.nicescroll',
        cropbox:'bower_components/cropbox/javascript/cropbox-min',
        summernote:'bower_components/summernote/dist/summernote.min',
        language:'bower_components/summernote/dist/lang/summernote-zh-CN.min',
        nprogress:'bower_components/nprogress/nprogress',


        paycount:'component/paycount',//收款统计
        main:'component/main',//加载的首页
        user:'component/user',//人员管理
        goodsmanage:'component/goodsmanage',//商品管理
        payconfig:'component/payconfig',//支付配置
        storemanage:'component/storemanage',//门店管理
        offlinepay:'component/offlinepay',//线上商品
        giftmanage:'component/giftmanage',//礼品管理
        card:'component/card',//卡券管理
        cardmanage:'component/cardmanage',//
        wechatcard:'component/wechatcard',//微信会员卡
        rechargerecord:'component/rechargerecord',//充值记录
        consumerecord:'component/consumerecord',//消费记录
        exchangerecord:'component/exchangerecord',//礼品兑换记录
        usecardquery:'component/usecardquery',//用户列表
        pointsrecord:'component/pointsrecord',//活动记录
        membershipcard:'component/membershipcard',//会员查询办理
        album:'component/album',//首页相册
        distribution:'component/distribution',//配送方式设置
        attribute:'component/attribute',//配送方式设置
        arrangement:'component/arrangement',//商城支付配置
        fication:'component/fication',//商品分类管理
        allorders:'component/allorders',//全部订单
        manager:'component/manager',//权限管理
        warehouse:'component/warehouse',//商品信息
        pointssetting:'component/pointssetting',//会员卡积分设置
        entry:'component/entry',//商品录入
        confirmorder:'component/confirmorder',//待确认订单


    },
    shim:{
        bootstrap:{deps:['jquery']},
        avalon: {exports: "avalon"},
        bootstrap_toggle:{deps:['jquery','bootstrap']},
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
        metisMenu:{deps:['jquery']},
        niceScroll:{deps:['jquery']},
        language:{deps:['summernote']}
    }
};
