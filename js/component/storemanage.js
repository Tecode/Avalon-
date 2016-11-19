/**
 * Created by ASSOON on 2016/11/11.
 */
define(['bootstrap', 'avalon', 'jstree', 'jquery_select', 'featurepack', 'sweet_alert'], function (bootstrap, avalon, jstree, jquery_select, featurepack, swal) {
    var overallSituation, dataUrl, selectUser, selectDept, selectPayType;
    var cloudMail = {
        avalonStart: function () {
            overallSituation = avalon.define({
                $id: "storeManage",
                storeList: [],
                filldata: {},
                person: [],
                scope: [],
                paytype: [],
                addStore: function () {
                    globalData = {type:1,value:0};
                    cloudMail.setBranch(1, null);
                },
                editStore: function (el) {
                    globalData = {type:2,value:el};
                    overallSituation.filldata = el;
                    cloudMail.setBranch(2, el);
                },
                clearAttr: function () {
                    $('.tips-msg').remove()
                },
                validate: featurepack.pack.checkValue(function () {
                    overallSituation.person = selectUser.select('getSelected');
                    overallSituation.scope=selectDept.select('getSelected');
                    overallSituation.paytype=selectPayType.select('getSelected');
                    $('.tips-msg').remove();
                        if(overallSituation.person.length ==0){
                            $('.select-user').parent('div').after('<p class="col-sm-offset-3 tips-msg col-sm-9 color-down">请选择负责人</p>');
                        }
                        else if(overallSituation.scope.length ==0){
                            $('.select-dept').parent('div').after('<p class="col-sm-offset-3 tips-msg col-sm-9 color-down">请选择负责人的管辖范围</p>');
                        }
                        else if(overallSituation.paytype.length ==0){
                            $('.select-paytype').parent('div').after('<p class="col-sm-offset-3 tips-msg col-sm-9 color-down">请选择收款方式</p>');
                        }else {
                            var user = (selectUser.select('getSelected')).length > 0 ? cloudMail.getTreeNodeId((selectUser.select('getSelected'))[0].id) : '';
                            var postdata = {
                                user:user,
                                scope:selectDept.select('getSelected'),
                                paytype:selectPayType.select('getSelected'),
                                branchname:overallSituation.filldata.branchname,
                                branchpaydes:overallSituation.filldata.branchpaydes,
                                isonline:overallSituation.filldata.isonline
                            };
                            globalData.type ==1?(function () {
                                //增加
                                postdata.branchid = 0;
                                cloudMail.addStore(postdata);
                            })():(function () {
                                //修改
                                postdata.branchid = globalData.value.branchid;
                                cloudMail.editStore(postdata);
                            })();
                    }
                }),
                deleteStore: function (el) {
                    swal({
                            title: "确定删除该支付配置?",
                            text: "删除以后将不会恢复!",
                            type: "warning",
                            showCancelButton: true,
                            cancelButtonText: "取消",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: false
                        },
                        function () {
                            cloudMail.deleteStore({branchid:el.branchid})
                        });
                }
            });
            avalon.scan(document.body)
        },
        jsTreeInit: function () {
            selectUser = $('.select-user').select({
                url: '',
                multiple: false,
                jstree: {
                    url: dataUrl.getDeptTree+'?type=user',
                    selectType: 'user'
                }
            });
            selectDept = $('.select-dept').select({
                url: '',
                multiple: false,
                jstree: {
                    'url': dataUrl.getDeptTree
                }
            });
            selectPayType = $('.select-paytype').select({
                multiple: false,
                jsonData: []
            });
            //清除提示
            $('.choose-input-list').on('click',function () {
                $('.tips-msg').remove()
            })
        },
        setBranch: function (type, value) {
            type == 1 ? (function () {
                overallSituation.filldata = {branchname:"",branchpaydes:"",isonline:"1"};
                selectPayType.select('clearSelected');
                selectDept.select('clearSelected');
                selectUser.select('clearSelected');

            })() : (function () {
                $(value.branchmanage).each(function (i, v) {
                    v['icon'] = 'tree-icon fa fa-user';
                });
                $(value.branchdept).each(function (i, v) {
                    v['icon'] = 'tree-icon fa fa-folder';
                });
                $(value.branchpay).each(function (i, v) {
                    v['icon'] = 'fa fa-usd';
                });

                selectUser.select('setSelected', value.branchmanage);
                selectDept.select('setSelected', value.branchdept);
                selectPayType.select('setSelected', value.branchpay);
            })();
            $("#showBigBox").click();
        },
        getTreeNodeId: function (nodeid) {
            return nodeid.split('_').length > 1 ? nodeid.split('_')[1] : nodeid;
        },
        getResponse: function (postdata) {
            featurepack.pack.ajax(dataUrl.storemanageUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    overallSituation.storeList = result.data;
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        addStore: function (postdata) {
            featurepack.pack.ajax(dataUrl.addStoreUrl, "post", postdata, function (result) {
                if (result.code == 0) {
                    swal("添加成功!", "您已经成功添加了门店，点击OK关闭窗口。", "success");
                    $("#showBigBox").click();
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        editStore: function (postdata) {
            featurepack.pack.ajax(dataUrl.editStoreUrl, "post", postdata, function (result) {
                if (result.code == 0) {
                    swal("修改成功!", "您已经修改了门店，点击OK关闭窗口。", "success");
                    $("#showBigBox").click();
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        deleteStore: function (postdata) {
            featurepack.pack.ajax(dataUrl.deleteStoreUrl, "post", postdata, function (result) {
                if (result.code == 0) {
                    swal("删除成功!", "您已经删除了门店，点击OK关闭窗口。", "success");
                    console.info(postdata)
                } else {
                    swal(result.msg, "", "error");
                }
            })
        }
    };
    var initStart = function (l) {
        dataUrl = l;
        cloudMail.avalonStart();
        cloudMail.getResponse();
        cloudMail.jsTreeInit();
    };


    return {
        init_start: initStart
    }
});