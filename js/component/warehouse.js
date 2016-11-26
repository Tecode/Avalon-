/**
 * Created by ASSOON on 2016/11/26.
 */
define(['avalon','bootstrap','featurepack','bootstrap_select','sweet_alert'], function(avalon,bootstrap,featurepack,bootstrap_select,swal) {
    var dataUrl = null;
    var showList,searchList;
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
                add:function () {
                    cloudMail.judge(1,null);
                    globalData ={type:1,data:null}
                },
                choiceAll:function (e) {
                    if ($(e.target).attr('data') == 0 && $(e.target).html() == '<i class="fa fa-circle-o"></i>全部选中') {
                        $(e.target).html('<i class="fa fa-circle"></i>取消全选');
                        $(e.target).attr('data', 1);
                        for (var i = 0; i < showList.listData.length; i++) {
                            showList.select.push(showList.listData[i].mdid.toString())
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
            avalon.scan(document.body);
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            showList.listData = arguments[0].data.deliver;
        },
        getResponse:function (data) {
            featurepack.pack.pager(cloudMail.fn,data,dataUrl.getDistributionList);
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
        addAjaxPost:function (postdata) {
            console.info(postdata)
            featurepack.pack.ajax(dataUrl.addDistributionList,"post",postdata,function (result) {
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
            console.info(postdata)
            featurepack.pack.ajax(dataUrl.editDistributionList,"post",postdata,function (result) {
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
            featurepack.pack.ajax(dataUrl.deleteDistributionList,"post",postdata,function (result) {
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
        //下拉选项初始化
        featurepack.pack.toggleTops();
        featurepack.pack.datePicker(cloudMail.getTime,"#date-range-picker",false);
        //分页和查询
        cloudMail.getResponse();
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});

