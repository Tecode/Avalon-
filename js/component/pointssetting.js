/**
 * Created by ASSOON on 2016/11/28.
 */
/**
 * Created by ASSOON on 2016/11/26.
 */
define(['avalon','bootstrap','niceScroll','featurepack','cropbox','sweet_alert'], function(avalon,bootstrap,niceScroll,featurepack,cropbox,swal) {
    var dataUrl = null;
    var fullPage,integral,cardLevel,cardConfigure;
    var configureData = {oldurl:""};
    var cloudMail = {
        avalonStart : function () {
            fullPage = avalon.define({
                $id:"fullPage"
            });
            integral = avalon.define({
                $id:"integral",
                integralData:{},
                strategyList:[],
                saveintegral:function () {
                    var p_data ={
                        instructions:integral.integralData.instructions,
                        integid:integral.integralData.integid,
                        ruleDescription:integral.integralData.ruleDescription,
                        strategyList:JSON.stringify(integral.strategyList),
                        type:1
                    };
                    cloudMail.getIntegral(p_data);
                }
            });
            cardLevel = avalon.define({
                $id:"cardLevel",
                levelListData:[],
                saveLevel:function () {
                    var p_data ={
                        settingList:JSON.stringify(cardLevel.levelListData),
                        type:2
                    };
                    cloudMail.getLevelList(p_data);
                },
                addLevel:function () {
                    if(cardLevel.levelListData.length>=10){
                        swal("新增失败!", "您的会员等级个数已达上线。")
                    }else {
                        cardLevel.levelListData.push({
                            "levelid": 0,"vipGrade": "","pontsstart": "","pontsend": "","discount": ""
                        })
                    }
                },
                deleteLevel:function (el) {
                    swal({
                            title: "确定删除此会员等级配置吗?",
                            text: "删除以后将不会恢复!",
                            type: "warning",
                            showCancelButton: true,
                            cancelButtonText:"取消",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: false
                        },
                        function(){
                            cardLevel.levelListData.remove(el);
                            swal("删除成功!", "您已成功删除此会员等级配置，点击OK关闭窗口。", "success");
                        });
                }
            });
            cardConfigure = avalon.define({
                $id:"cardConfigure",
                configureinfo:{},
                validate: featurepack.pack.checkValue(function () {
                    configureData.bgtital = cardConfigure.configureinfo.bgtital;
                    configureData.sellphone = cardConfigure.configureinfo.sellphone;
                    configureData.selladdress = cardConfigure.configureinfo.selladdress;
                    configureData.merchantid = $('.selectpicker').val();
                    configureData.newUrl = cardConfigure.configureinfo.bglogo;
                    configureData.stroeurl = cardConfigure.configureinfo.stroeurl;
                    configureData.configurl = cardConfigure.configureinfo.configurl;
                    configureData.type = 3;
                    cloudMail.getConfigure(configureData);
                }),
                selected:{selected:'selected'},
                clearAttr: function () {
                    $('.tips-msg').remove();
                },
                uploadimg:function () {
                    $("#file").click();
                }
            });

            avalon.scan(document.body);
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            showList.listData = arguments[0].data.productName;
        },
        getIntegral:function (d) {
            featurepack.pack.ajax(dataUrl.getIntegralUrl,"get",d,function (result) {
                if(result.code == 0){
                    integral.integralData = result.data;
                    integral.strategyList = result.data.strategyList;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        getLevelList:function (d) {
            featurepack.pack.ajax(dataUrl.getCardLevelUrl,"get",d,function (result) {
                if(result.code == 0){
                    cardLevel.levelListData = result.data;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        getConfigure:function (d) {
            console.info(d);
            featurepack.pack.ajax(dataUrl.getConfigureUrl,"get",d,function (result) {
                if(result.code == 0){
                    cardConfigure.configureinfo = result.data;
                    configureData.oldurl = result.data.bglogo;
                    $('.selectpicker option').each(function (index,child) {
                        if($(child).val()==result.data.merchantid){
                            $(child).attr("selected","selected")
                        }
                    });
                    //select选择框
                    featurepack.pack.option();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        judge:function (type,value) {
            type==1?(function () {
                showList.filldata = {
                    introduce:"",
                    mdIsNew:"0",
                    mdFulfilExpenses:"",
                    mdTitle:""
                };
                $(".modal-title strong").text("新增配送方式")
            })():function () {
                showList.filldata = value;
                $(".modal-title strong").text("修改配送方式")
            }();
            $('#showBigBox').click()
        },
        getdata:function () {
            imgData64 = arguments[0];
        },
        savaimage:function (postdata) {
            featurepack.pack.ajax(dataUrl.saveImageUrl,"post",postdata,function (result) {
                if(result.code == 0){
                    $('.loader').fadeOut(200);
                    cardConfigure.filldata.bglogo = result.data.url;
                    imgData64 = null;
                    $('#modalicon').click();
                    swal("保存成功!", "您已经成功修改了这张图片，点击OK关闭窗口。", "success");
                }else{
                    $('#modalicon').click();
                    swal(result.msg,"", "error");
                    $('.loader').fadeOut(200);

                }
            })
        }

    };

    var initStart = function (url) {
        dataUrl = url;
        $('#saveimg').on('click',function () {cloudMail.savaimage({imageData:imgData64});$('.loader').fadeIn(100)});
        cloudMail.avalonStart();
        cloudMail.getIntegral();
        cloudMail.getLevelList();
        cloudMail.getConfigure();
        featurepack.pack.noScroll();
        featurepack.pack.cropimage(cloudMail.getdata);
    };
    return {
        init_start: initStart
    };
});


