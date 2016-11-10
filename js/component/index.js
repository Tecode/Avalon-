require(['avalon','bootstrap','bootstrap_toggle', 'bootstrap_select', 'sammy', 'featurepack'], function (avalon,bootstrap,bootstrap_toggle, bootstrap_select, Sammy, featurepack) {


    var Fn = function () {
        this.init_evevt = function () {
            /* Sidebar Menu*/
            $('.nav > li > a').click(function () {
                if ($(this).attr('class') != 'active') {
                    $('.nav li ul').slideUp();
                    $(this).next().slideToggle();
                    $('.nav li a').removeClass('active');
                    $(this).addClass('active');
                }
            });
            /* Sidepanel Show-Hide */
            $(".sidepanel-open-button").click(function () {
                $(".sidepanel").toggle(100);
            });
            /* Sidebar Show-Hide On Mobile */
            $(".sidebar-open-button-mobile").click(function () {
                $(".sidebar").toggle(150);
            });
            /* Sidebar Show-Hide */
            $('.sidebar-open-button').on('click', function () {
                if ($('.sidebar').hasClass('hidden')) {
                    $('.sidebar').removeClass('hidden');
                    $('.content').css({
                        'marginLeft': 250
                    });
                } else {
                    $('.sidebar').addClass('hidden');
                    $('.content').css({
                        'marginLeft': 0
                    });
                }
            });
        };
    };
    var cloudMail = new Fn();
//初始化index里面的点击事件方法
// 配置路由
    var app = Sammy('#main', function () {
        // include a plugin
        // this.use('Mustache');
        this.get('#/main', function () {//加载的首页
            this.load('page/main.html')
                .swap();
        });
        this.get('#/user', function () {//组织架构
            this.load('page/user.html')
                .swap();
        });
        this.get('#/payConfig', function () {//支付配置
            this.load('page/payconfig.html')
                .swap();
        });
        this.get('#/storemanage', function () {//门店管理
            this.load('page/storemanage.html')
                .swap();
        });
        this.get('#/manager', function () {//权限管理
            this.load('page/manager.html')
                .swap();
        });
        this.get('#/paycount', function () {//收款统计
            this.load('page/paycount.html')
                .swap();
        });
        this.get('#/goodsmanage', function () {//商品管理
            this.load('page/goodsmanage.html')
                .swap();
        });
        this.get('#/goodsorder', function () {//商品订单
            this.load('page/goodsorder.html')
                .swap();
        });
        this.get('#/offlinepay', function () {//线下支付
            this.load('page/offlinepay.html')
                .swap();
        });
        this.get('#/rechargerecord', function () {//充值记录
            this.load('page/rechargerecord.html')
                .swap();
        });
        this.get('#/consumerecord', function () {//消费记录
            this.load('page/consumerecord.html')
                .swap();
        });
        this.get('#/exchangerecord', function () {//礼品兑换记录
            this.load('page/exchangerecord.html')
                .swap();
        });
        this.get('#/usecardquery', function () {//优惠券记录查询
            this.load('page/usecardquery.html')
                .swap();
        });
        this.get('#/pointsrecord', function () {//活动记录
            this.load('page/pointsrecord.html')
                .swap();
        });
        this.get('#/membershipcard', function () {//会员查询
            this.load('page/membershipcard.html')
                .swap();
        });
        this.get('#/album', function () {//首页相册
            this.load('page/album.html')
                .swap();
        });
        this.get('#/distribution', function () {//配送方式配置
            this.load('page/distribution.html')
                .swap();
        });
        this.get('#/arrangement', function () {//商城支付配置
            this.load('page/arrangement.html')
                .swap();
        });
        this.get('#/fication', function () {//商城分类管理
            this.load('page/fication.html')
                .swap();
        });
        this.get('#/attribute', function () {//商品类型和属性
            this.load('page/attribute.html')
                .swap();
        });
        //2016-11-10 11：20
        this.get('#/entry', function () {//商品录入
            this.load('page/entry.html')
                .swap();
        });
        this.get('#/allorders', function () {//全部订单
            this.load('page/allorders.html')
                .swap();
        });
        this.get('#/confirmorder', function () {//待确认订单
            this.load('page/confirmorder.html')
                .swap();
        });
        this.get('#/payout', function () {//出售中的商品
            this.load('page/payout.html')
                .swap();
        });
        this.get('#/warehouse', function () {//仓库中的商品
            this.load('page/warehouse.html')
                .swap();
        });

        //2016-11-10 11：26
        this.get('#/pointssetting', function () {//积分设置
            this.load('page/pointssetting.html')
                .swap();
        });
        this.get('#/giftmanage', function () {//礼品管理
            this.load('page/giftmanage.html')
                .swap();
        });
        this.get('#/card', function () {//微信会员卡
            this.load('page/card.html')
                .swap();
        });
        this.get('#/cardmanage', function () {//优惠卡设置
            this.load('page/cardmanage.html')
                .swap();
        });
        this.get('#/wechatcard', function () {//微信会员列表
            this.load('page/wechatcard.html')
                .swap();
        });
    });

// start the application
    app.run('#/main');
//调用初始化点击事件
    cloudMail.init_evevt();

});
