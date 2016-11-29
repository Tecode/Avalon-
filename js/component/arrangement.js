/**
 * Created by ASSOON on 2016/11/22.
 */
define(['avalon','bootstrap','featurepack','niceScroll','cropbox','sweet_alert'], function(avalon,bootstrap,featurepack,niceScroll,cropbox,swal) {
    var dataUrl = null;
    var showList;
    var Data = {oldurl:""};
    var cloudMail = {
        avalonStart : function () {
            showList = avalon.define({
                $id:"showList",
                listData:[],
                filldata:{},
                validate: featurepack.pack.checkValue(function () {
                        Data.Datamerchantid = $('.selectpicker').val();
                        Data.name = showList.filldata.name;
                        Data.address =showList.filldata.address;
                        Data.tell = showList.filldata.tell;
                        Data.imgsrc = showList.filldata.url;
                    cloudMail.saveData(Data);
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
        getResponse:function (postdata) {
            featurepack.pack.ajax(dataUrl.getArrangementList,"get",postdata,function (result) {
                if(result.code == 0){
                    showList.listData = result.merchantlist;
                    showList.filldata = result.data;
                    Data.oldurl = result.data.logo;
                    featurepack.pack.option();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        getdata:function () {
            imgData64 = arguments[0];
        },
        savaimage:function (postdata) {
            featurepack.pack.ajax(dataUrl.saveImageUrl,"post",postdata,function (result) {
                if(result.code == 0){
                        $('.loader').fadeOut(200);
                        showList.filldata.logo = result.data.url;
                        imgData64 = null;
                        $('#modalicon').click();
                        swal("保存成功!", "您已经成功修改了这张图片，点击OK关闭窗口。", "success");
                }else{
                    swal(result.msg,"", "error");
                    $('.loader').fadeOut(200);
                }
            })
        },
        saveData:function (postdata) {
            featurepack.pack.ajax(dataUrl.saveDataUrl,"post",postdata,function (result) {
                console.info(postdata)
                if(result.code == 0){
                    swal("保存成功!", "您已经成功支付配置，点击OK关闭窗口。", "success");
                    Data = {oldurl:""};
                    cloudMail.getResponse();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        }
    };

    var initStart = function (url) {
        $('#saveimg').on('click',function () {cloudMail.savaimage({imageData:imgData64});$('.loader').fadeIn(100)});
        dataUrl = url;
        featurepack.pack.expand();
        featurepack.pack.toggleTops();
        featurepack.pack.noScroll();
        cloudMail.getResponse();
        cloudMail.avalonStart();
        featurepack.pack.cropimage(cloudMail.getdata);
    };
    return {
        init_start: initStart
    };
});


