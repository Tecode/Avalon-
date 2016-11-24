/**
 * Created by ASSOON on 2016/11/23.
 */
define(['avalon','bootstrap','bootstrap_select','moment','daterangepicker','featurepack','sweet_alert','niceScroll'], function(avalon,bootstrap,selectpicker,moment,daterangepicker,featurepack,swal,niceScroll) {
    var dataUrl = null;
    var showList,searchList;
    var postdata = {dingdan:"",fahuo:"",payout:"",value:"",zhifu:""};
    var cloudMail = {
        avalonStart:function () {
        showList = avalon.define({
            $id:"showList",
            listData:[],
            childList:[],
            address:{},
            orderInfo:{},
            readmore:function (el) {
                cloudMail.readMore({oid:el.uid});
                globalData = el;
            },
            getBack:function () {
                $(".childPages,.childPages .page-header").css("top","260px").fadeOut(100);
            },
            cancel:function () {
                swal({
                        title: "确定作废此订单吗?",
                        text: "作废订单将不会恢复!",
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText:"取消",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        closeOnConfirm: false
                    },
                    function(){
                        cloudMail.cancel({oid:globalData.uid})
                    });
            }
        });

        searchList = avalon.define({
            $id:"searchList",
            total:"0",//总笔数
            sum:"0",//总收入
            searchButton:function () {
                $("#firstPage").serializeArray().map(function (child,index) {
                    postdata[child.name] = child.value
                });
                cloudMail.getResponse(postdata);
            }
        });
        avalon.scan(document.body);
    },
        fn:function () {
        showList.listData = arguments[0].data.orderlist;
        },
        getResponse : function (data) {
        featurepack.pack.pager(cloudMail.fn,data,dataUrl.getallordersList);
        },
        readMore:function (postdata) {
            featurepack.pack.ajax(dataUrl.getChildPage,"get",postdata,function (result) {
                if(result.code == 0){
                    $(".childPages,.childPages .page-header").fadeIn(100).css("top","60px");
                    showList.childList = result.data;
                    showList.address = result.oaddress;
                    showList.orderInfo = result.dorderInfo;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        cancel:function (postdata) {
            featurepack.pack.ajax(dataUrl.cancelOrderUrl,"get",postdata,function (result) {
                if(result.code == 0){
                    swal("作废成功!", "您已经成功将此订单作废，点击OK关闭窗口。", "success");
                    setTimeout(function () {
                        $(".childPages,.childPages .page-header").css("top","260px").fadeOut(100);
                        swal.close();
                    },1200);
                    globalData = null;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        }
    };
    var initStart = function (url) {
        dataUrl = url;
        $(".controls").on("click",".selectpicker a",function () {
            $("#firstPage").serializeArray().map(function (child,index) {
                postdata[child.name] = child.value
            });
            cloudMail.getResponse(postdata);
        });
        //下拉选项初始化
        featurepack.pack.option();
        featurepack.pack.toggleTops();
        featurepack.pack.noScroll();
        //分页和查询
        cloudMail.getResponse(postdata);
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});
