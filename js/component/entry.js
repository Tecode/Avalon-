/**
 * Created by ASSOON on 2016/11/28.
 */
define(['avalon','bootstrap','niceScroll','featurepack','sweet_alert','summernote','plupload','language'], function(avalon,bootstrap,niceScroll,featurepack,swal,summernote,plupload,language) {
    var entryUrl = null;
    var basicInfo,description,attribute,addImage,isSave=false;
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
                    costprice:'',
                    marketprice:'',
                    sellprice:'',
                    artNo:'',
                    issell:0,
                    describe:2,
                    tradename:'',
                    gid:0,
                    newest:"0",
                    sale:"0",
                    recommend:"0",
                    specialOffer:"0"
                },
                validate: featurepack.pack.checkValue(function () {
                    var pData = {};
                    for(key in basicInfo.basicInfoData){
                        pData[key] = basicInfo.basicInfoData[key];
                    }
                    cloudMail.saveBasicInfo(pData)
                })
            });
            description = avalon.define({
                $id:"description",
                description:'',
                clearAttr: function () {
                    $('.tips-msg').remove();
                },
                saveDescription:function () {
                    isSave?(function () {
                        var pData = {
                            gid:basicInfo.basicInfoData.gid,
                            description:'',
                            detailInfo:$('#summernote').summernote('code')
                        };
                        cloudMail.saveDescription(pData)
                    })():(function () {
                        swal("请先保存基本信息！","如果未填写基本信息所有商品信息将不会被保存！", "error");
                    })();


                }
            });
            attribute = avalon.define({
                $id:"attribute",
                attributeData:[],
                select:[],
                saveAttribute:function () {
                    isSave?(function () {
                        var postD = {};
                        var pData=[];
                        $.each(attribute.attributeData,function (i,child) {
                            $.each(child.attrInfo,function (j,attrInfoId) {
                                $.each(attribute.select,function (k,value) {
                                    if(attrInfoId.id==value){
                                        pData.push(attrInfoId)
                                    }
                                })
                            })
                        });
                        postD.data =pData.toString();
                        postD.gid = basicInfo.basicInfoData.gid;
                        cloudMail.saveAttribute(postD)
                    })():(function () {
                        swal("请先保存基本信息！","如果未填写基本信息所有商品信息将不会被保存！", "error");
                    })();

                },
                clearAttr: function () {
                    $('.tips-msg').remove();
                }
            });
            addImage = avalon.define({
                $id:"addImage",
                postImageData:[],
                removeData:[],//上传删除的文件，如果上传中途删除了文件要在上传时把删除的移除掉
                removeImage:function (el,value,event) {
                    swal({
                            title: "确定移除这张图片?",
                            text: "移除以后将不会恢复!",
                            type: "warning",
                            showCancelButton: true,
                            cancelButtonText: "取消",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: false
                        },
                        function () {
                            $(event.target).css('opacity',0);
                            featurepack.pack.removeUpLoadimg(el);
                            setTimeout(function () {
                                addImage.removeData.push(el);
                                addImage.postImageData.remove(el);
                                swal("移除成功!", "您已经成功移除了这张图片，点击OK关闭窗口。", "success");
                            },200);
                        });
                }
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
                imageSize:arguments[3].size,
                imageName:arguments[3].name,
                id:arguments[3].id
            });
            setTimeout(function () {
                $('.fade-slide').css('opacity',1)
            },150)
        },
        upLoadimgRemove:function () {
            return addImage.removeData;
        },
        getDataUrl:function () {
            //console.info(arguments[0])
                cloudMail.saveUploadImage({
                    gid:basicInfo.basicInfoData.gid,
                    imgurl:arguments[0].data.url
                });
        },
        getUploadError:function () {
            swal(arguments[0],"上传图片出错了。", "error");
        },
        saveBasicInfo:function (d) {
            featurepack.pack.ajax(entryUrl.saveBasicInfoUrl,"get",d,function (result) {
                if(result.code == 0){
                    swal("保存成功!", "您现在可以填写其他信息了，点击OK关闭窗口。", "success");
                    basicInfo.basicInfoData.gid = result.data.gid;
                    isSave = true;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        //保存描述内容
        saveDescription:function (d) {
            featurepack.pack.ajax(entryUrl.saveDescriptionUrl,"get",d,function (result) {
                if(result.code == 0){
                    swal("保存成功!", "您现在可以填写其他信息了，点击OK关闭窗口。", "success");
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        saveAttribute:function (d) {
            featurepack.pack.ajax(entryUrl.saveAttributeUrl,"get",d,function (result) {
                if(result.code == 0){
                    swal("保存成功!", "您现在可以填写其他信息了，点击OK关闭窗口。", "success");
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        initSummernote:function () {
            $('#summernote').summernote({
                lang:'zh-CN',
                height: 400,
                codemirror: {
                    theme: 'default'
                },
                toolbar: [
                    ['fontstyle', ['fontname']],
                    ['style', ['bold', 'italic', 'clear']],
                    ['fontsize', ['fontsize']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['insert', ['picture']],
                    ['misc', ['fullscreen','codeview']]
                ],
                callbacks: {
                    onImageUpload: function(files, editor, welEditable) {
                        var filearr = Array.prototype.slice.call(files);
                        for(var i=0;i<files.length;i++){
                            if(files[i].type.indexOf('image')==-1){
                                filearr.splice(i, 1);
                                swal(
                                    {
                                        title: "上传图片格式错误！",
                                        text: "上传的不是图片格式，支持jpg,jpe,jpeg,gif,png",
                                        timer: 4000,
                                        showConfirmButton: true
                                    });
                            }
                            if (files[i].size > 409600) {
                                filearr.splice(i, 1);
                                swal(
                                    {
                                        title: "上传的文件过大!",
                                        text: "上传的文件不能超过400KB",
                                        timer: 4500,
                                        showConfirmButton: true
                                    });
                            }
                        }
                        $.each(filearr,function (index,child) {
                            cloudMail.sendFile(child,$('#summernote'),welEditable);
                        });

                    }
                }
            });
            //设置内容
            // var markupStr = 'hello world';
            // $('#summernote').summernote('code', markupStr);
            // //获取内容
            // alert($('#summernote').summernote('code'))
        },
        saveUploadImage:function () {
            featurepack.pack.ajax(entryUrl.saveAttributeUrl,"post",d,function (result) {
                if(result.code == 0){
                    swal({
                        title: "上传图片成功!",
                        text: "0.5后自动关闭",
                        timer: 500,
                        showConfirmButton: false
                    });
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        // 保存图片formdata保存图片
        sendFile:function(file,editor,welEditable) {
        data = new FormData();
        data.append("file", file);
        $.ajax({
            data: data,
            type: "POST",
            url: entryUrl.sendFile,//上传地址
            cache: false,
            contentType: false,
            processData: false,
            success: function(url) {
                //上传完成插入图片
                editor.summernote('insertImage', url, function ($image) {
                    $image.css('width', '50%');
                    $image.attr('data-filename', 'versong2.0');
                })
            }
        });
    },
        //一些jquery事件
        init:function () {
            //提示
            $('.basic').siblings('li').children('a').on('click',function () {
                !isSave?(function () {
                    swal("请先保存基本信息！","如果未填写基本信息所有商品信息将不会被保存！", "error");
                })():'';
            });
            //获取属性值内容
            $(".controls").on("click",".selectpicker a",function () {
                cloudMail.getAttributeData({tid:$('.commodityType').val()});
            });
        }
    };

    var initStart = function (url) {
        cloudMail.init();
        entryUrl = url;
        cloudMail.entryStart();
        cloudMail.getBasicInfo();
        cloudMail.initSummernote();
        featurepack.pack.noScroll();
        featurepack.pack.expand();
        featurepack.pack.upload(cloudMail.getUploadimage,cloudMail.getDataUrl,url.uploadImageUrl,2,cloudMail.getUploadError,cloudMail.upLoadimgRemove);
    };
    return {
        init_start: initStart
    };
});


