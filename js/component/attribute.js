/**
 * Created by ASSOON on 2016/11/22.
 */
define(['avalon','bootstrap','featurepack','sweet_alert','niceScroll'], function(avalon,bootstrap,featurepack,swal,niceScroll) {
    var dataUrl = null;
    var showList,searchList,showList2,searchList2;
    var postdata = {value:""};
    var cloudMail = {
        avalonStart : function () {
            showList = avalon.define({
                $id:"showList",
                listData:[],
                select:[],
                filldata:{},
                edit:function (el) {
                    cloudMail.judge(2,el);
                    globalData ={type:2,data:el}
                },
                visiblePage:function (el) {
                    cloudMail.getPageResponse({tid:el.tid});
                    $(".childPages,.childPages .page-header").fadeIn(100).css("top","60px");
                },
                validate: featurepack.pack.checkValue(function () {
                    var postdata = {
                        introduce:showList.filldata.introduce,
                        mdIsNew:showList.filldata.mdIsNew,
                        mdFulfilExpenses:showList.filldata.mdFulfilExpenses,
                        mdTitle:showList.filldata.mdTitle
                    };
                    globalData.type==1?(function () {
                        postdata.mdid = 0;
                        cloudMail.addAjaxPost(postdata)
                    })():(function () {
                        postdata.mdid = globalData.data.mdid;
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
                        cloudMail.deleteAjaxPost({ids:showList.select.toString()})
                    }
                }
            });
            //子页面
            showList2 = avalon.define({
                $id:"showListpage",
                listData:[],
                select:[],
                filldata:{},
                edit:function (el) {
                    cloudMail.judge(2,el);
                    globalData ={type:2,data:el}
                },
                visiblePage:function (el) {
                    cloudMail.getPageResponse({tid:el.tid});
                    $(".childPages,.childPages .page-header").fadeIn(100).css("top","60px");
                },
                validate: featurepack.pack.checkValue(function () {
                    var postdata = {
                        introduce:showList.filldata.introduce,
                        mdIsNew:showList.filldata.mdIsNew,
                        mdFulfilExpenses:showList.filldata.mdFulfilExpenses,
                        mdTitle:showList.filldata.mdTitle
                    };
                    globalData.type==1?(function () {
                        postdata.mdid = 0;
                        cloudMail.addAjaxPost(postdata)
                    })():(function () {
                        postdata.mdid = globalData.data.mdid;
                        cloudMail.editAjaxPost(postdata)
                    })()
                }),
                clearAttr: function () {
                    $('.tips-msg').remove();
                }
            });
            searchList2 = avalon.define({
                $id:"searchListpage",
                getBack:function () {
                    $(".childPages,.childPages .page-header").css("top","260px").fadeOut(100);
                },
                add:function () {
                    cloudMail.judge(1,null);
                    globalData ={type:1,data:null}
                },
                choiceAll:function (e) {
                    if ($(e.target).attr('data') == 0 && $(e.target).html() == '<i class="fa fa-circle-o"></i>全部选中') {
                        $(e.target).html('<i class="fa fa-circle"></i>取消全选');
                        $(e.target).attr('data', 1);
                        for (var i = 0; i < showList2.listData.length; i++) {
                            showList2.select.push(showList2.listData[i].tid.toString())
                        }
                    } else if ($(e.target).attr('data') == 1 && $(e.target).html() == '<i class="fa fa-circle"></i>取消全选') {
                        $(e.target).html('<i class="fa fa-circle-o"></i>全部选中');
                        $(e.target).attr('data', 0);
                        showList2.select = [];
                    }
                },
                delete:function () {
                    if(showList.select<=0){
                        swal("先选一个呗","请先选择要删除的选项。", "error");
                    }else {
                        cloudMail.deleteAjaxPost({ids:showList.select.toString()})
                    }
                }
            });
            avalon.scan(document.body);
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            showList.listData = arguments[0].data.list;
        },
        getResponse:function (data) {
            featurepack.pack.pager(cloudMail.fn,data,dataUrl.getAttributeUrl);
        },
        //获取子页面数据
        getPageResponse:function (postdata) {
            console.info(postdata)
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
        addAjaxPost:function (postdata) {
            console.info(postdata)
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
                    cloudMail.getResponse();
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
        cloudMail.getResponse(postdata);
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});


