/**
 * Created by ASSOON on 2016/11/28.
 */
define(['avalon','bootstrap','niceScroll','featurepack','sweet_alert','summernote','plupload','language'], function(avalon,bootstrap,niceScroll,featurepack,swal,summernote,plupload,language) {
    var entryUrl = null;
    var basicInfo,description,attribute,addImage;
    var cloudMail = {
        entryStart : function () {
            basicInfo = avalon.define({
                $id:"basicInfo",
                leixings:[],
                fenleis:[],
                number:'',
                clearAttr: function () {
                    $('.tips-msg').remove();
                },
                basicInfoData:{
                    leixing:216,
                    fenlei:141,
                    costprice:1111,
                    marketprice:2222,
                    sellprice:3333,
                    artNo:335613634901361201,
                    issell:0,
                    describe:2,
                    data:[],
                    tradename:100,
                    gid:0,
                    srcimgs:10,
                    imgcontent:01,
                    newest:"1",
                    sale:"0",
                    recommend:"1",
                    specialOffer:"1"
                },
                validate: featurepack.pack.checkValue(function () {
                    alert("isOk")
                })
            });
            description = avalon.define({
                $id:"description",
                clearAttr: function () {
                    $('.tips-msg').remove();
                },
                validate: featurepack.pack.checkValue(function () {
                    alert("isOk")
                })
            });
            attribute = avalon.define({
                $id:"attribute",
                attributeData:[],
                clearAttr: function () {
                    $('.tips-msg').remove();
                },
                validate: featurepack.pack.checkValue(function () {
                    alert("isOk")
                })
            });
            addImage = avalon.define({
                $id:"addImage",
                postImageData:[],
                validate: featurepack.pack.checkValue(function () {
                    alert("isOk")
                })
            });
            avalon.scan(document.body);
        },
        getBasicInfo:function (d) {
            featurepack.pack.ajax(entryUrl.getBasicInfoUrl,"get",d,function (result) {
                if(result.code == 0){
                    basicInfo.leixings = result.data.leixings;
                    basicInfo.fenleis = result.data.fenleis;
                    basicInfo.number = result.number;
                    featurepack.pack.option();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        getAttributeData:function (d) {
            featurepack.pack.ajax(entryUrl.getAttributeDataUrl,"get",d,function (result) {
                if(result.code == 0){
                    attribute.attributeData = result.data;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        getUploadimage:function () {
            addImage.postImageData.push({
                imageUrl:arguments[0],
                imageSize:arguments[1],
                imageName:arguments[2]
            })
        },
        getUploadError:function () {
            swal(arguments[0],"上传图片支持jpg,gif,png格式。", "error");
        }
    };

    var initStart = function (url) {
        entryUrl = url;
        cloudMail.entryStart();
        cloudMail.getBasicInfo();
        cloudMail.getAttributeData();
        featurepack.pack.noScroll();
        featurepack.pack.expand();
        featurepack.pack.upload(cloudMail.getUploadimage,'',url.uploadImageUrl,2,cloudMail.getUploadError);
        $('#summernote').summernote({
            lang:'zh-CN'
        });
    };
    return {
        init_start: initStart
    };
});


