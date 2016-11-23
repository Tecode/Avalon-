/**
 * Created by ASSOON on 2016/11/23.
 */
define(['avalon','bootstrap','featurepack','sweet_alert','niceScroll'], function(avalon,bootstrap,featurepack,swal,niceScroll) {
    var dataUrl = null;
    var showList,searchList,showList2,searchList2;
    var cloudMail = {
        avalonStart : function () {
            showList = avalon.define({
                $id:"showList",
                listData:[],
                select:[],
                filldata:{},
                edit:function (el) {
                    cloudMail.judge(2,el);
                    globalData = {type:2,data:el};
                },
                // visiblePage:function (el) {
                //     showList2.attr = el.username;
                //     searchList2.attr = el.username;
                //     tid = el.tid;
                //     cloudMail.getPageResponse({tid:el.tid});
                //     $(".childPages,.childPages .page-header").fadeIn(100).css("top","60px");
                // },
                validate: featurepack.pack.checkValue(function () {
                    var postdata = {
                        introduce:showList.filldata.username,
                        mdIsNew:showList.filldata.discript
                    };
                    globalData.type==1?(function () {
                        postdata.tid = 0;
                        cloudMail.addAjaxPost(postdata)
                    })():(function () {
                        postdata.tid = globalData.data.tid;
                        cloudMail.editAjaxPost(postdata)
                    })()
                }),
                clearAttr: function () {
                    $('.tips-msg').remove();
                }
            });
            searchList = avalon.define({
                $id:"searchList",
                value:"",
                search:function (e) {
                    if(e.code==undefined){
                        postdata.value = searchList.value;
                        cloudMail.getResponse(postdata)
                    }else if(e.code=="Enter"){
                        postdata.value = searchList.value;
                        cloudMail.getResponse(postdata)
                    }
                },
                add:function () {
                    cloudMail.judge(1,null);
                    globalData ={type:1,data:null}
                },
                choiceAll:function (e) {
                    if ($(e.target).attr('data') == 0 && $(e.target).html() == '<i class="fa fa-circle-o"></i>全部选中') {
                        $(e.target).html('<i class="fa fa-circle"></i>取消全选');
                        $(e.target).attr('data', 1);
                        for (var i = 0; i < showList.listData.length; i++) {
                            showList.select.push(showList.listData[i].tid.toString())
                        }
                    } else if ($(e.target).attr('data') == 1 && $(e.target).html() == '<i class="fa fa-circle"></i>取消全选') {
                        $(e.target).html('<i class="fa fa-circle-o"></i>全部选中');
                        $(e.target).attr('data', 0);
                        showList.select = [];
                    }
                },
                delete:function () {
                    if(showList.select<=0){
                        swal("先选一个呗","请先选择要删除的选项。", "error");
                    }else {
                        swal({
                                title: "确定删除选中的商品属性?",
                                text: "删除以后将不会恢复!",
                                type: "warning",
                                showCancelButton: true,
                                cancelButtonText:"取消",
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "确定",
                                closeOnConfirm: false
                            },
                            function(){
                                cloudMail.deleteAjaxPost({ids:showList.select.toString()})
                            });
                    }
                }
            });
            //子页面
            // showList2 = avalon.define({
            //     $id:"showListpage",
            //     listData:[],
            //     select:[],
            //     filldata:{},
            //     attr:"",
            //     edit:function (el) {
            //         cloudMail.judgeChildPage(2,el);
            //         globalDataChild ={type:2,data:el}
            //     },
            //     validate: featurepack.pack.checkValue(function () {
            //         var postdata = {
            //             checkvalue:showList2.attr,
            //             commodityAttributeName:showList2.filldata.commodityAttributeName,
            //             attributeValues:showList2.filldata.attributeValues,
            //             tid:tid
            //         };
            //         globalDataChild.type==1?(function () {
            //             postdata.cpmid = 0;
            //             cloudMail.addChildPageAjaxPost(postdata)
            //         })():(function () {
            //             postdata.cpmid = globalDataChild.data.cpmid;
            //             cloudMail.editChildPageAjaxPost(postdata)
            //         })()
            //     }),
            //     clearAttr: function () {
            //         $('.tips-msg').remove();
            //     }
            // });
            // searchList2 = avalon.define({
            //     $id:"searchListpage",
            //     attr:"",
            //     getBack:function () {
            //         $(".childPages,.childPages .page-header").css("top","260px").fadeOut(100);
            //     },
            //     add:function () {
            //         cloudMail.judgeChildPage(1,null);
            //         globalDataChild ={type:1,data:null}
            //     },
            //     choiceAll:function (e) {
            //         if ($(e.target).attr('data') == 0 && $(e.target).html() == '<i class="fa fa-circle-o"></i>全部选中') {
            //             $(e.target).html('<i class="fa fa-circle"></i>取消全选');
            //             $(e.target).attr('data', 1);
            //             for (var i = 0; i < showList2.listData.length; i++) {
            //                 showList2.select.push(showList2.listData[i].cpmid.toString())
            //             }
            //         } else if ($(e.target).attr('data') == 1 && $(e.target).html() == '<i class="fa fa-circle"></i>取消全选') {
            //             $(e.target).html('<i class="fa fa-circle-o"></i>全部选中');
            //             $(e.target).attr('data', 0);
            //             showList2.select = [];
            //         }
            //     },
            //     delete:function () {
            //         if(showList2.select<=0){
            //             swal("先选一个呗","请先选择要删除的选项。", "error");
            //         }else {
            //             swal({
            //                     title: "确定删除选中的属性?",
            //                     text: "删除以后将不会恢复!",
            //                     type: "warning",
            //                     showCancelButton: true,
            //                     cancelButtonText:"取消",
            //                     confirmButtonColor: "#DD6B55",
            //                     confirmButtonText: "确定",
            //                     closeOnConfirm: false
            //                 },
            //                 function(){
            //                     cloudMail.deleteAjaxPost({ids:showList2.select.toString()})
            //                 });
            //         }
            //     }
            // });
            avalon.scan(document.body);
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            showList.listData = arguments[0].data.data;
        },
        getResponse:function (data) {
            featurepack.pack.pager(cloudMail.fn,data,dataUrl.getAttributeUrl);
        },
        //获取子页面数据
        getPageResponse:function (postdata) {
            featurepack.pack.ajax(dataUrl.getChildAttributeUrl,"get",postdata,function (result) {
                if(result.code == 0){
                    showList2.listData = result.data.commInfo;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        judge:function (type,value) {
            type==1?(function () {
                showList.filldata = {
                    username:"",
                    discript:""
                };
                $(".modal-title strong").text("新增商品属性类型")
            })():function () {
                showList.filldata = value;
                $(".modal-title strong").text("修改商品属性类型")
            }();
            $('#showBigBox').click()
        },
        judgeChildPage:function (type,value) {
            type==1?(function () {
                showList2.filldata = {
                    commodityAttributeName:"",
                    attributeValues:""
                };
                $(".modal-title strong").text("新增商品类型")
            })():function () {
                showList2.filldata = value;
                $(".modal-title strong").text("修改商品类型")
            }();
            $('#showBigBox2').click()
        },
        addAjaxPost:function (postdata) {
            featurepack.pack.ajax(dataUrl.addAttributeUrl,"post",postdata,function (result) {
                if(result.code == 0){
                    swal("添加成功!", "您已经成功添加了配送方式，点击OK关闭窗口。", "success");
                    globalData = null;
                    $('#showBigBox').click();
                    cloudMail.getResponse();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        editAjaxPost:function (postdata) {
            featurepack.pack.ajax(dataUrl.editAttributeUrl,"post",postdata,function (result) {
                if(result.code == 0){
                    swal("修改成功!", "您已经成功修改了配送方式，点击OK关闭窗口。", "success");
                    globalData = null;
                    $('#showBigBox').click();
                    cloudMail.getResponse();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        deleteAjaxPost:function (postdata) {
            featurepack.pack.ajax(dataUrl.deleteAttributeUrl,"post",postdata,function (result) {
                if(result.code == 0){
                    swal("修改成功!", "您已经成功修改了配送方式，点击OK关闭窗口。", "success");
                    globalData = null;
                    cloudMail.getPageResponse();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        deleteChildPageAjaxPost:function (postdata) {
            featurepack.pack.ajax(dataUrl.deleteChildPageAjaxPost,"post",postdata,function (result) {
                if(result.code == 0){
                    swal("修改成功!", "您已经成功修改了配送方式，点击OK关闭窗口。", "success");
                    globalDataChild = null;
                    cloudMail.getPageResponse({tid:tid});
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        addChildPageAjaxPost:function (postdata) {
            featurepack.pack.ajax(dataUrl.addChildPageAjaxPost,"post",postdata,function (result) {
                if(result.code == 0){
                    swal("修改成功!", "您已经成功修改了配送方式，点击OK关闭窗口。", "success");
                    globalDataChild = null;
                    cloudMail.getPageResponse({tid:tid});
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        editChildPageAjaxPost:function (postdata) {
            featurepack.pack.ajax(dataUrl.editChildPageAjaxPost,"post",postdata,function (result) {
                if(result.code == 0){
                    swal("修改成功!", "您已经成功修改了配送方式，点击OK关闭窗口。", "success");
                    globalDataChild = null;
                    cloudMail.getPageResponse({tid:tid});
                }else{
                    swal(result.msg,"", "error");
                }
            })
        }

    };

    var initStart = function (url) {
        dataUrl = url;
        //点击菜单关闭弹框避免选择失败
        $(".sidebar-open-button").on("click",function () {$(".childPages,.childPages .page-header").css("top","260px").fadeOut(100); });
        //下拉选项初始化
        featurepack.pack.noScroll();
        featurepack.pack.toggleTops();
        featurepack.pack.datePicker(cloudMail.getTime,"#date-range-picker",false);
        //分页和查询
        cloudMail.getResponse(null);
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});



