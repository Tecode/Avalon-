/**
 * Created by ASSOON on 2016/11/26.
 */
define(['avalon','bootstrap','niceScroll','featurepack','sweet_alert','summernote','plupload','language'], function(avalon,bootstrap,niceScroll,featurepack,swal,summernote,plupload,language) {
    var entryUrl = null;
    var basicInfo,description,attribute,addImage,isSave=false;
    var dataUrl = null;
    var showList,searchList;
    var postdata ={type:1};
    var cloudMail = {
        avalonStart : function () {
            //列表栏
            showList = avalon.define({
                $id:"showList",
                listData:[],
                gid:'0',
                select:[],
                edit:function (el) {
                    cloudMail.getEntry({type:postdata.type,gid:el.gid});
                    showList.gid = el.gid;
                    $(".childPages,.childPages .page-header").fadeIn(100).css("top","60px");
                },
                clearAttr: function () {
                    $('.tips-msg').remove();
                }
            });
            searchList = avalon.define({
                $id:"searchList",
                type:"1",
                //上架
                putaway:function () {
                    cloudMail.judge(1,'确定上架选中的商品吗?','上架以后将展示在销售商品页面!','请选择要上架的商品！');
                },
                //下架
                soldout:function () {
                    cloudMail.judge(2,'确定下架选中的商品吗?','下架以后将展示在全部商品页面!','请选择要下架的商品');
                },
                choice:function (e) {
                    postdata.type = $(e.target).val();
                    searchList.type = $(e.target).val();
                    cloudMail.getResponse(postdata)
                },
                choiceAll:function (e) {
                    if ($(e.target).attr('data') == 0 && $(e.target).html() == '<i class="fa fa-circle-o"></i>全部选中') {
                        $(e.target).html('<i class="fa fa-circle"></i>取消全选');
                        $(e.target).attr('data', 1);
                        for (var i = 0; i < showList.listData.length; i++) {
                            showList.select.push(showList.listData[i].gid.toString())
                        }
                    } else if ($(e.target).attr('data') == 1 && $(e.target).html() == '<i class="fa fa-circle"></i>取消全选') {
                        $(e.target).html('<i class="fa fa-circle-o"></i>全部选中');
                        $(e.target).attr('data', 0);
                        showList.select = [];
                    }
                },
                delete:function () {
                    cloudMail.judge(3,'确定删除选中的商品吗?','删除以后将不会恢复!','请选择要删除的商品');
                }
            });
            //弹出的信息框编辑信息
            basicInfo = avalon.define({
                $id:"basicInfo",
                leixings:[],
                fenleis:[],
                number:'',
                clearAttr: function () {
                    $('.tips-msg').remove();
                },
                basicInfoData:{
                    "wid": 0,
                    "productName": "哈哈哈",
                    "itemNo": "667283702892855994",
                    "putaway": "1",
                    "newest": "1",
                    "sale": "1",
                    "recommend": "1",
                    "specialOffer": "0",
                    "costPrice": 100,
                    "marketPrice": 30,
                    "sellingPrice": 10
                },
                validate: featurepack.pack.checkValue(function () {
                    var pData = {};
                    for(key in basicInfo.basicInfoData){
                        pData[key] = basicInfo.basicInfoData[key];
                    }
                    pData.tid = $('.commodityType').val();
                    pData.cmid = $('.fengleiType').val();
                    pData.gid = showList.gid;
                        delete pData.sort;
                        delete pData.productDescription;
                        delete pData.description;
                        delete pData.imgs;
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
                            gid:showList.gid,
                            description:description.description,
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
                        postD.data =JSON.stringify(pData);
                        postD.gid = showList.gid;
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
                uploadedImage:[],
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
                },
                deleteImage:function (el,value,event) {//删除已经上传的图片
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
                        cloudMail.deleteUploadedImage({gid:showList.gid,url:el.imageUrl},removedata);//删除已经上传的图片
                        });
                }
            });

            avalon.scan(document.body);
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            showList.listData = arguments[0].data.productName;
        },
        getResponse:function (data) {
            featurepack.pack.pager(cloudMail.fn,data,dataUrl.getWareHouseList);
        },
        //判断上架下架删除
        judge:function (type,title,content,tips) {
            if(showList.select<=0){
                swal("先选一个呗",tips, "error");
            }else {
                swal({
                        title: title,
                        text: content,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        closeOnConfirm: false
                    },
                    function () {
                        postdata.ids = {ids:showList.select.toString()};
                        switch (type){
                            case 1://上架
                                cloudMail.putaway(postdata);
                                break;
                            case 2://下架
                                cloudMail.soldout(postdata);
                                break;
                            case 3://删除
                                cloudMail.deleteGoods(postdata);
                                break;
                        }
                    });
            }
        },
        //删除商品
        deleteGoods:function (data) {
            featurepack.pack.ajax(dataUrl.deleteGoodsUrl,"post",data,function (result) {
                if(result.code == 0){
                    swal("删除成功!", "您已经成功删除了选中的商品，点击OK关闭窗口。", "success");
                    delete postdata.ids;
                    cloudMail.getResponse(postdata);
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        //下架商品
        soldout:function (data) {
            featurepack.pack.ajax(dataUrl.downWareHouseUrl,"post",data,function (result) {
                if(result.code == 0){
                    swal("下架成功!", "您已经下架选择的商品，点击OK关闭窗口。", "success");
                    delete postdata.ids;
                    cloudMail.getResponse(postdata);
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        //上架商品
        putaway:function (data) {
            featurepack.pack.ajax(dataUrl.upWareHouseUrl,"get",data,function (result) {
                if(result.code == 0){
                    swal("上架成功!", "您已经上架选择的商品，点击OK关闭窗口。", "success");
                    delete postdata.ids;
                    cloudMail.getResponse(postdata);
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        //获取商品录入
        getEntry:function (d) {
            featurepack.pack.ajax(dataUrl.getEntry,"get",d,function (result) {
                if(result.code == 0){
                    basicInfo.leixings = result.lxfl.leixings;//获取类型下拉菜单
                    basicInfo.fenleis = result.lxfl.fenleis;//获取分类下拉菜单
                    attribute.attributeData = result.attrvals;//获取商品属性
                    basicInfo.basicInfoData = result.waremessage;//获取基本信息填充数据
                    description.description = result.waremessage.description;//描述信息
                    $('#summernote').summernote('code', result.waremessage.productDescription);//填充商品图文描述
                    addImage = 1;//预览的图片
                    featurepack.pack.option();
                }else{
                    swal(result.msg,"", "error");
                }
            })
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
                data: {imgData:data,git:showList.gid},
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
        },
        deleteUploadedImage:function (d,data) {
            featurepack.pack.ajax(entryUrl.deleteUploadedImageUrl,"post",d,function (result) {
                if(result.code == 0){
                    swal("删除成功!", "图片删除成功，点击OK关闭窗口。", "success");
                    showList.uploadedImage.remove(data);
                }else{
                    swal(result.msg,"", "error");
                }
            })
        }

    };

    var initStart = function (url,l) {
        dataUrl = url;
        entryUrl = l;
        $('.getBack').on('click',function () {
            $(".childPages,.childPages .page-header").css("top","260px").fadeOut(100);
        });
        //下拉选项初始化
        featurepack.pack.toggleTops();
        featurepack.pack.datePicker(cloudMail.getTime,"#date-range-picker",false);
        featurepack.pack.noScroll();
        // featurepack.pack.expand();
        //输入框
        cloudMail.initSummernote();
        //分页和查询
        cloudMail.getResponse(postdata);
        //上传图片插件
        cloudMail.avalonStart();featurepack.pack.upload(cloudMail.getUploadimage,cloudMail.getDataUrl,url.uploadImageUrl,2,cloudMail.getUploadError,cloudMail.upLoadimgRemove);

    };
    return {
        init_start: initStart
    };
});

