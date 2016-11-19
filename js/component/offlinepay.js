/**
 * Created by ASSOON on 2016/11/9.
 */
define(['bootstrap','avalon','jstree','jquery_select','sweet_alert','featurepack'], function(bootstrap,avalon,jstree,jquery_select,swal,featurepack) {
    var offlinepay,dataUrl;
    var postdata = {sname:""};
    var cloudMail = {
        getTreeNodeId:function (nodeid) {
            return nodeid.split('_').length > 1 ? nodeid.split('_')[1] : nodeid.split('_')
        },
        avalonStart:function () {
            offlinepay = avalon.define({
                $id:"offlinepay",
                sname:"",
                offlinepayList:[],
                filldata:[],
                ispull:'0',
                istransfer:'1',
                transferUrl:'',
                globalData:{},
                dispalyImg:function (el) {
                    $('.dispalyimg img').attr('src',el.scode);
                    $('.dispalyimg').stop().fadeIn(500);
                },
                hiddenImg:function () {
                    $('.dispalyimg').stop().fadeOut(500);
                },
                searchButton:function () {
                    postdata.sname = offlinepay.sname;
                    cloudMail.getResponse(postdata);
                },
                addPay:function () {
                    cloudMail.Judgment(1,null);
                    offlinepay.globalData ={type:1}
                },
                editPay:function (el) {
                    offlinepay.filldata = el;
                    cloudMail.Judgment(2,el);
                    offlinepay.globalData ={type:2}
                },
                refund:function (el) {
                    swal({
                            title: "确定删除吗？?",
                            text: "您将会删除该支付配置!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: false
                        },
                        function () {
                            cloudMail.refundMoney(el.sid);
                        });
                },
                clearAttr:function () {
                    $('.tips-msg').remove()
                },
                validate: featurepack.pack.checkValue(function () {
                    var postdata = {};
                    var deptid = '';
                    $('.tips-msg').remove();
                    if($('.select-user').select('getSelected').length ==0){
                        $('.select-user').parent('div').after('<p class="col-sm-offset-3 tips-msg col-sm-9 color-down">请选择管理员</p>');
                    }
                    else if($('.select-users').select('getSelected').length ==0){
                        $('.select-users').parent('div').after('<p class="col-sm-offset-3 tips-msg col-sm-9 color-down">请选择提醒用户</p>');
                    }else {
                        $($('.select-users').select('getSelected')).each(function (i, dept) {
                                deptid += cloudMail.getTreeNodeId(dept.id) + ",";
                            });
                            postdata.sname = offlinepay.filldata.sname;
                            postdata.user = $('.select-user').select('getSelected')[0].id;
                            postdata.users = deptid;
                            offlinepay.globalData.type == 1 ? (function () {
                                postdata.istransfer = offlinepay.istransfer;
                                postdata.ispull = offlinepay.ispull;
                                postdata.transferUrl = offlinepay.transferUrl;
                                cloudMail.addPayment(postdata);
                            })():(function () {
                                cloudMail.editPayment(postdata);
                            })();
                    }
                })
            });

            avalon.scan(document.body)
        },
        //分页插件封装的avalon需要传url
            fn:function () {
                offlinepay.offlinepayList = arguments[0].data.goods;
            },
            getResponse:function (data) {
                featurepack.pack.pager(cloudMail.fn,data,dataUrl.getOfflinepayList);
            },
            Judgment:function (type,value) {
                    $('.select-user').select('clearSelected');
                    $('.select-users').select('clearSelected');
                type==1?(function () {
                    offlinepay.filldata = {sname:""};
                    offlinepay.ispull = 0;
                    offlinepay.istransfer = 0;
                    offlinepay.transferUrl = "";
                    })():(function () {
                    //json数据要有一个[]才可以
                        $('.select-user').select('setSelected',value.suser);
                        $('.select-users').select('setSelected',value.reminduser);
                    })();
                $('#showBigBox').click();
            },
            jsTreeInit:function () {
                $('.select-user').select({
                    url:'',
                    multiple:false,
                    jstree:{
                        url:dataUrl.getDeptTree,//+'?type=user'
                        selectType:'user'
                    }
                });
                $('.select-users').select({
                    url:'',
                    multiple:true,
                    jstree:{
                        url:dataUrl.getDeptTree,//+'?type=user'
                        selectType:'user'
                    }
                });
                $('.choose-input-list').on('click',function () {
                    $('.tips-msg').remove()
                })
            },
        editPayment:function (postdata) {
            featurepack.pack.ajax(dataUrl.editPayUrl, "post", postdata, function (result) {
                if (result.code == 0) {
                    swal("修改成功!", "您已经修改了该成员，点击OK关闭窗口。", "success");
                    $("#showBigBox").click();
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        addPayment:function (postdata) {
            featurepack.pack.ajax(dataUrl.addPayUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    swal("添加成功!", "您已经添加成员，点击OK关闭窗口。", "success");
                    $("#showBigBox").click();
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        refundMoney:function () {
            featurepack.pack.ajax(dataUrl.refundMoneyUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    swal("退款成功!", "您已经添加成员，点击OK关闭窗口。", "success");
                } else {
                    swal(result.msg, "", "error");
                }
            })
        }
    };
    var initStart = function (l) {
        dataUrl = l;
        featurepack.pack.toggleTops();
        cloudMail.jsTreeInit();
        cloudMail.getResponse(postdata);
        cloudMail.avalonStart();
    };
    return {
        init_start: initStart
    }
});