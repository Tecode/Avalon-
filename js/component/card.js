/**
 * Created by ASSOON on 2016/11/18.
 */
define(['avalon','bootstrap','bootstrap_select','moment','daterangepicker','featurepack','plupload','sweet_alert'], function(avalon,bootstrap,selectpicker,moment,daterangepicker,featurepack,plupload,swal) {
    var dataUrl = null;
    var colorsValue = "Color010Color020Color030Color040Color050Color060Color070Color080Color081Color082";
    var colors = ["#63b359","#2c9f67","#509fc9","#5885cf","#9062c0","#d09a45","#e4b138","#ee903c","#f08500","#a9d92d"];
    var vipCard;
    var cloudMail = {
        avalonStart:function () {
            vipCard = avalon.define({
                $id:"vipcard",
                visibleAttr:'hidden',//visible
                bgColor:'#63b359',
                vipData:{
                    c_cardType:'2',//1背景是图片，2背景是颜色
                    c_joinName:$('.profilebox b').text(),//公司名称
                    c_joinTitle:'',//会员卡类型，例如：黄金会员
                    c_joinLogoUrl:'http://paytest.51byod.cn/300.jpg',//logo图片地址
                    c_joinColor:'Color010',//会员卡背景颜色
                    c_imageUrl:'img/example1.jpg',//会员卡背景图片地址
                    c_joinQuantity:'500',//制券数量
                    c_joinObj6:'',//特权说明
                    c_joinTel:'',//电话号码
                    c_joinDescription:'',//卡券说明
                    c_joinNotice:''//用户须知
                },
                enterdata:[],//入口
                validate:{
                    onValidateAll: function (reasons) {
                        reasons.length == 0 ? (function () {
                            var pData = {};
                            for (key in vipCard.vipData){
                                pData[key] = vipCard.vipData[key]
                            }
                            if(pData.c_imageUrl.length>100){
                                pData.c_imageUrl ='';
                            }
                            pData.enterdata = JSON.stringify(vipCard.enterdata);
                            console.info(pData)
                        })() : (function () {
                            $('.tips-msg').remove();
                            $.each(reasons,(function (index,child) {
                                if ($(child.element).parent('div').hasClass('col-sm-6')) {
                                    $(child.element).parent('div').after('<p class="col-sm-offset-2 tips-msg col-sm-6 color-down">' + child.message + '</p>');
                                } else if ($(child.element).parent('div').hasClass('col-sm-10')) {
                                    $(child.element).parent('div').after('<p class="col-sm-offset-2 tips-msg col-sm-10 color-down">' + child.message + '</p>');
                                }
                            }));
                            swal("提交失败！","请检查填写字段是否正确！", "error");
                        })();
                    },
                    validateInBlur: true,
                    validateInKeyup: true
                },
                clearAttr: function (e) {
                    $(e.target).parents('.col-sm-6,.col-sm-10').siblings('.tips-msg').remove();
                },
                addEnter:function () {
                    vipCard.enterdata.length<3?(function () {
                        vipCard.enterdata.push({
                            "tips":"",
                            "rkname":"入口名称",
                            "joinUrl":""
                        })
                    })():(function () {
                        swal("添加入口失败！","最多只可以添加3个入口！", "error");
                    })()
                },
                deletEnter:function (el) {
                    vipCard.enterdata.remove(el);
                },
                toggleBg:function (e) {
                    if($(e.target).val()==2){
                        vipCard.visibleAttr = 'hidden';
                    }else if($(e.target).val() ==1) {
                        vipCard.visibleAttr = 'visible';
                    }
                }
            });
            avalon.scan(document.body);
        },

        //回调函数预览图片
        callback:function () {
            vipCard.vipData.c_imageUrl = arguments[0];
        },
        //回调函数加载正式图片地址
        callBackGetUrl:function () {
            vipCard.vipData.c_imageUrl = arguments[0].data.url;
            swal("图片上传成功!", "您已经成功上传了背景图片，点击OK关闭窗口。", "success");
            // globalData.url = true;
        },
        jqueryInit:function () {
            $('body').on('click','.topColors div,.bottomColors div',function () {
                vipCard.vipData.c_joinColor = $(this).attr('data');
                vipCard.bgColor = colors[colorsValue.indexOf($(this).attr('data'))/8];
            });
            //弹出颜色块
            $(function () {
                $('[data-toggle="popover"]').popover(
                    {
                        html:true
                    }
                )
            });
        }
    };
    var initStart = function (url) {
        dataUrl = url;
        cloudMail.jqueryInit();
        featurepack.pack.upload(
            //转成64位编码
            cloudMail.callback,
            //获取服务器地址
            cloudMail.callBackGetUrl,url.addBackgroundImageUrl);
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});