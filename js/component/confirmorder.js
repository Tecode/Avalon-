/**
 * Created by ASSOON on 2016/12/2.
 */
define(['avalon','bootstrap','featurepack','sweet_alert','niceScroll'], function(avalon,bootstrap,featurepack,swal,niceScroll) {
    var dataUrl = null;
    var showList,searchList;
    var cloudMail = {
        avalonStart : function () {
            showList = avalon.define({
                $id:"showList",
                listData:[],
                select:[],
                childList:[],
                address:{},
                orderInfo:{},
                getBack:function () {
                    $(".childPages,.childPages .page-header").css("top","260px").fadeOut(100);
                },
                readmore:function (el) {
                    cloudMail.readMore({uid:el.uid});
                },
                clearAttr: function () {
                    $('.tips-msg').remove();
                }
            });

            searchList = avalon.define({
                $id:"searchList",
                confirmOrder:function () {
                    cloudMail.judge(1,'要确认此订单吗？','确认以后在全部订单中查看','请选择一个要确定的订单');
                },
                choiceAll:function (e) {
                    if ($(e.target).attr('data') == 0 && $(e.target).html() == '<i class="fa fa-circle-o"></i>全部选中') {
                        $(e.target).html('<i class="fa fa-circle"></i>取消全选');
                        $(e.target).attr('data', 1);
                        for (var i = 0; i < showList.listData.length; i++) {
                            showList.select.push(showList.listData[i].uid.toString())
                        }
                    } else if ($(e.target).attr('data') == 1 && $(e.target).html() == '<i class="fa fa-circle"></i>取消全选') {
                        $(e.target).html('<i class="fa fa-circle-o"></i>全部选中');
                        $(e.target).attr('data', 0);
                        showList.select = [];
                    }
                },
                delete:function () {
                    cloudMail.judge(2,'确定删除此订单？','删除用户将不会恢复！','请选择一个要删除的订单');
                }
            });
            avalon.scan(document.body);
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            showList.listData = arguments[0].data.orderlist;
        },
        getResponse:function (data) {
            featurepack.pack.pager(cloudMail.fn,data,dataUrl.getConfirmorderList);
        },
        judge:function (type,title,content,tips) {
            if(showList.select.length<1){
                swal(tips,"", "error");
            }
            else {
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
                        type==1?(function () {
                            cloudMail.deletConfirmorder({ids:showList.select.toString()});
                        })():(function () {
                            cloudMail.confirmorderPost({ids:showList.select.toString()});
                        })()
                    });
            }

        },
        deletConfirmorder:function (postdata) {
            featurepack.pack.ajax(dataUrl.deletConfirmorderUrl,"get",postdata,function (result) {
                if(result.code == 0){
                    swal("确认成功!", "您已经成功确认了选择的订单，点击OK关闭窗口。", "success");
                    cloudMail.getResponse();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        confirmorderPost:function (postdata) {
            featurepack.pack.ajax(dataUrl.confirmorderUrl,"post",postdata,function (result) {
                if(result.code == 0){
                    swal("删除成功!", "您已经成功删除了选中的订单，点击OK关闭窗口。", "success");
                    cloudMail.getResponse();
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        readMore:function (d) {
            featurepack.pack.ajax(dataUrl.viewDetailUrl,"get",d,function (result) {
                if(result.code == 0){
                    $(".childPages,.childPages .page-header").fadeIn(100).css("top","60px");
                    showList.childList = result.data;
                    showList.address = result.oaddress;
                    showList.orderInfo = result.dorderInfo;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        }

    };

    var initStart = function (url) {
        dataUrl = url;
        //点击菜单栏隐藏弹出窗
        $(".sidebar-open-button").on('click',function () {
            $(".childPages,.childPages .page-header").css("top","260px").fadeOut(100);
        });
        //下拉选项初始化
        featurepack.pack.toggleTops();
        featurepack.pack.datePicker(cloudMail.getTime,"#date-range-picker",false);
        //分页和查询
        cloudMail.getResponse();
        cloudMail.avalonStart();
        featurepack.pack.noScroll();

    };
    return {
        init_start: initStart
    };
});

