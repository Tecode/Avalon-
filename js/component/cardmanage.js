
/**
 * Created by ASSOON on 2016/11/18.
 */
define(['avalon','bootstrap','bootstrap_select','moment','daterangepicker','featurepack','sweet_alert'], function(avalon,bootstrap,selectpicker,moment,daterangepicker,featurepack,swal) {
    var dataUrl = null;
    var showList,searchList;
    var postdata = {
        starttime:"",
        endtime:"",
        cardname:"",
        cardtype:""
    };
    var cloudMail = {
        avalonStart:function () {
            showList = avalon.define({
                $id:"showList",
                listData:[],
                filldata:{},
                deadline:'',//截至时间
                discount:'',//打几折
                reducesum:'',//减多少元
                deleteCard:function (el) {
                    swal({
                            title: "确定要删除吗？?",
                            text: "删除以后将不会恢复!",
                            type: "warning",
                            showCancelButton: true,
                            cancelButtonText:"取消",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: false
                        },
                        function(){
                            cloudMail.deleteCard({cardclomid:el.cardclomid});
                        });
                },
                editCard:function (el) {
                    cloudMail.Judgment(2,el);
                    globalData =2;
                },
                clearAttr:function () {
                    $('.tips-msg').remove()
                },
                validate: featurepack.pack.checkValue(function () {
                    var postdata ={
                        cardname:showList.filldata.cardname,
                        cardsums:showList.filldata.cardsums,
                        cardtype:showList.filldata.cardtype,
                        deadline:showList.deadline,
                        discount:showList.discount,
                        reducesum:showList.reducesum
                    };
                    globalData==1?(function () {
                        postdata.cardclomid = 0;
                        cloudMail.addCard(postdata);
                    })():function () {
                        postdata.cardclomid = showList.filldata.cardclomid;
                        cloudMail.editCard(postdata);
                    }()
                })
            });

            searchList = avalon.define({
                $id:"searchList",
                addCard:function () {
                    cloudMail.Judgment(1,null);
                    globalData = 1;
                },
                searchButton:function () {
                    $("form").serializeArray().map(function (child,index) {
                        postdata[child.name] = child.value
                    });
                    cloudMail.getResponse(postdata);
                }
            });
            avalon.scan(document.body);
        },
        Judgment:function (type,value) {
            type==1?(function () {
                showList.filldata = {cardname:"",cardtype:"1",cardsums:"",arrivsum:""};
                showList.arrivsum ="";//减多少
                showList.discount ="";//打几折
                showList.deadline ="";
            })():(function () {
                showList.filldata = value;
            })();
            $('#showBigBox').click();
        },
        //分页插件封装的avalon需要传url
        fn:function () {
            showList.listData = arguments[0].data.cardtend;
        },
        getResponse:function (data) {
            featurepack.pack.pager(cloudMail.fn,data,dataUrl.getcardcountList);
        },
        getTime:function () {
            postdata.starttime = arguments[0];
            postdata.endtime = arguments[1];
        },
        deleteCard:function (postdata) {
            featurepack.pack.ajax(dataUrl.refundMoneyUrl,"get",postdata,function (result) {
                if(result.code == 0){
                    swal("删除成功!", "您已经删除该卡券成功了，点击OK关闭窗口。", "success");
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        editCard:function (postdata) {
            featurepack.pack.ajax(dataUrl.editCardUrl,"get",postdata,function (result) {
                if(result.code == 0){
                    swal("修改成功!", "您已经成功修改了卡券，点击OK关闭窗口。", "success");
                    globalData = null;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        addCard:function (postdata) {
            featurepack.pack.ajax(dataUrl.addCardUrl,"get",postdata,function (result) {
                if(result.code == 0){
                    swal("添加成功!", "您已经添加该卡券成功了，点击OK关闭窗口。", "success");
                    globalData = null;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        }
    };
    var initStart = function (url) {
        dataUrl = url;
        //下拉选项初始化
        featurepack.pack.option();
        featurepack.pack.toggleTops();
        featurepack.pack.datePicker(cloudMail.getTime,"#date-range-picker",false);
        featurepack.pack.datePicker(cloudMail.getTime,"#date-picker",true);
        //分页和查询
        cloudMail.getResponse(postdata);
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});