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
    });

// start the application
    app.run('#/main');
//调用初始化点击事件
    cloudMail.init_evevt();

});
