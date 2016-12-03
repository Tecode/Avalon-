require(['avalon', 'bootstrap', 'bootstrap_toggle', 'bootstrap_select', 'sammy', 'featurepack','nprogress'], function (avalon, bootstrap, bootstrap_toggle, bootstrap_select, Sammy, featurepack,NProgress) {

    NProgress.start();
    var indexList,messageList;
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
        this.init_render = function () {
            featurepack.pack.render(function () {
                return true;
            })
        };
      this.getResponse = function (url,type) {
              featurepack.pack.ajax(url, "get", null, function (result) {
                  if (result.code == 0) {
                      switch (type){
                          case 1:
                              indexList.listData = result.data.message;
                              break;
                          case 2:
                              messageList.messagelistData = result.data.message;
                              indexList.listData = result.data.message;
                              break;
                      }
                  } else {
                      swal(result.msg, "", "error");
                  }
              })
      };
      this.avalonStart = function () {
          indexList = avalon.define({
                $id:"indexList",
                listData:[],
                  showBox:function () {
                      $(".sidepanel").toggle(100);
                  }
            });
          messageList = avalon.define({
              $id:"messageList",
              messagelistData:[],
              today:cloudMail.getNow()
          });
            avalon.scan(document.body);
        };
        this.getNow = function () {
            return (
                parseInt(new Date(new Date().toLocaleDateString()).getTime())
            )
        }
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
                cloudMail.init_render();
        });
        this.get('#/user', function () {//组织架构
            this.load('page/user.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/payConfig', function () {//支付配置
            this.load('page/payconfig.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/storemanage', function () {//门店管理
            this.load('page/storemanage.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/manager', function () {//权限管理
            this.load('page/manager.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/paycount', function () {//收款统计
            this.load('page/paycount.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/goodsmanage', function () {//商品管理
            this.load('page/goodsmanage.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/goodsorder', function () {//商品订单
            this.load('page/goodsorder.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/offlinepay', function () {//线下支付
            this.load('page/offlinepay.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/rechargerecord', function () {//充值记录
            this.load('page/rechargerecord.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/consumerecord', function () {//消费记录
            this.load('page/consumerecord.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/exchangerecord', function () {//礼品兑换记录
            this.load('page/exchangerecord.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/usecardquery', function () {//优惠券记录查询
            this.load('page/usecardquery.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/pointsrecord', function () {//活动记录
            this.load('page/pointsrecord.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/membershipcard', function () {//会员查询
            this.load('page/membershipcard.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/album', function () {//首页相册
            this.load('page/album.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/distribution', function () {//配送方式配置
            this.load('page/distribution.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/arrangement', function () {//商城支付配置
            this.load('page/arrangement.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/fication', function () {//商城分类管理
            this.load('page/fication.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/attribute', function () {//商品类型和属性
            this.load('page/attribute.html')
                .swap();
                cloudMail.init_render();
        });
        //2016-11-10 11：20
        this.get('#/entry', function () {//商品录入
            this.load('page/entry.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/allorders', function () {//全部订单
            this.load('page/allorders.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/confirmorder', function () {//待确认订单
            this.load('page/confirmorder.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/payout', function () {//出售中的商品
            this.load('page/payout.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/warehouse', function () {//仓库中的商品
            this.load('page/warehouse.html')
                .swap();
                cloudMail.init_render();
        });

        //2016-11-10 11：26
        this.get('#/pointssetting', function () {//积分设置
            this.load('page/pointssetting.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/giftmanage', function () {//礼品管理
            this.load('page/giftmanage.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/card', function () {//微信会员卡
            this.load('page/card.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/cardmanage', function () {//优惠卡设置
            this.load('page/cardmanage.html')
                .swap();
                cloudMail.init_render();
        });
        this.get('#/wechatcard', function () {//微信会员列表
            this.load('page/wechatcard.html')
                .swap();
                cloudMail.init_render();
        });
    });
    app.run('#/main');
//调用初始化点击事件
    //cloudMail.getResponse("json/index.json",1);
    cloudMail.getResponse("json/index.json",2);
    cloudMail.init_evevt();
    cloudMail.avalonStart();

});
