/**
 * Created by ASSOON on 2016/11/19.
 */
define(['avalon','bootstrap','bootstrap_select','moment','daterangepicker','featurepack','sweet_alert'], function(avalon,bootstrap,selectpicker,moment,daterangepicker,featurepack,swal) {
    var dataUrl = null;
    var showList,searchList;
    var postdata = {
        starttime:"",
        endtime:"",
        uname:"",
        usestatus:''
    };
    var cloudMail = {
        avalonStart : function () {
            showList = avalon.define({
                $id:"showList",
                listData:[],
                globalData:{},
                filldata:{},
                xffee:'0',
                recharge:'0',
                addLineDown:function (el) {
                    cloudMail.judge(1,el);
                    showList.globalData ={type:1,data:el}
                },
                rechargeEvent:function (el) {
                    cloudMail.judge(2,el);
                    showList.globalData ={type:2,data:el}
                },
                detail:function (el) {
                    showList.filldata = el;
                    $('#showBigBox').click();
                },
                validate: {
                    onValidateAll: function (reasons) {
                        reasons.length == 0 ? (function () {
                            showList.globalData.type==1?(function () {
                                cloudMail.addMore({xffee:showList.xffee})
                            })():(function () {
                                cloudMail.addMore({recharge:showList.recharge})
                            })()
                        })() : (function () {
                            $('.tip').remove();
                            $(reasons[0].element).parents('.errortips').after('<p class="color-down tip">' + reasons[0].message + '</p>')
                        })();
                    },
                    validateInBlur: true
                },
                clear: function () {
                    $('.tip').remove();
                }
            });

            searchList = avalon.define({
                $id:"searchList",
                searchButton:function () {
                    $("form").serializeArray().map(function (child,index) {
                        postdata[child.name] = child.value
                    });
                    cloudMail.getResponse(postdata);
                }
            });
            avalon.scan(document.body);
        },
        addMore:function (postdata) {
            featurepack.pack.ajax(dataUrl.getembershipcardList,"get",postdata,function (result) {
                if(result.code == 0){
                    swal("添加成功!", "您已经添加成功了，点击OK关闭窗口。", "success");
                    $('#showSmallbox').click();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        getTime : function () {
            postdata.starttime = arguments[0];
            postdata.endtime = arguments[1];
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            showList.listData = arguments[0].data.userinfolist;
        },
        getResponse:function (data) {
            featurepack.pack.pager(cloudMail.fn,data,dataUrl.getembershipcardList);
        },
        judge:function (type,value) {
            showList.xffee="0";
            showList.recharge="0";
            type==1?(function () {
                $(".tips").text("新增会员线下消费金额")
                })():function () {
                $(".tips").text("新增会员线下充值金额")
                }();
            $('#showSmallbox').click()
        }
    };

    var initStart = function (url) {
        dataUrl = url;
        //下拉选项初始化
        featurepack.pack.option();
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
