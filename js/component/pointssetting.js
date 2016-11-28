/**
 * Created by ASSOON on 2016/11/28.
 */
/**
 * Created by ASSOON on 2016/11/26.
 */
define(['avalon','bootstrap','featurepack','sweet_alert'], function(avalon,bootstrap,featurepack,swal) {
    var dataUrl = null;
    var fullPage,integral,cardLevel,cardConfigure;
    var postdata ={type:1};
    var cloudMail = {
        avalonStart : function () {
            fullPage = avalon.define({
                $id:"fullPage"
            });
            integral = avalon.define({
                $id:"integral",
                integralData:{},
                strategyList:[],
                saveintegral:function () {
                    var p_data ={
                        instructions:integral.integralData.instructions,
                        integid:integral.integralData.integid,
                        ruleDescription:integral.integralData.ruleDescription,
                        strategyList:JSON.stringify(integral.strategyList),
                        type:1
                    };
                    cloudMail.getIntegral(p_data);
                }
            });
            cardLevel = avalon.define({
                $id:"cardLevel",
                levelListData:[],
                saveLevel:function () {
                    var p_data ={
                        settingList:JSON.stringify(cardLevel.levelListData),
                        type:2
                    };
                    cloudMail.getLevelList(p_data);
                },
                addLevel:function () {
                    if(cardLevel.levelListData.length>=10){
                        swal("新增失败!", "您的会员等级个数已达上线。")
                    }else {
                        cardLevel.levelListData.push({
                            "levelid": 0,"vipGrade": "","pontsstart": "","pontsend": "","discount": ""
                        })
                    }
                },
                deleteLevel:function (el) {
                    swal({
                            title: "确定删除此会员等级配置吗?",
                            text: "删除以后将不会恢复!",
                            type: "warning",
                            showCancelButton: true,
                            cancelButtonText:"取消",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: false
                        },
                        function(){
                            cardLevel.levelListData.remove(el);
                            swal("删除成功!", "您已成功删除此会员等级配置，点击OK关闭窗口。", "success");
                        });
                }
            });
            cardConfigure = avalon.define({
                $id:"cardConfigure",
                configureinfo:{},
                saveintegral:function () {
                    var p_data ={
                        instructions:integral.integralData.instructions,
                        integid:integral.integralData.integid,
                        ruleDescription:integral.integralData.ruleDescription,
                        strategyList:JSON.stringify(integral.strategyList),
                        type:1
                    };
                    cloudMail.getIntegral(p_data);
                },
                selected:{'selected':'selected'}
            });
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
                choice:function (e) {
                    alert($(e.target).val())
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
            showList.listData = arguments[0].data.productName;
        },
        getIntegral:function (d) {
            featurepack.pack.ajax(dataUrl.getIntegralUrl,"get",d,function (result) {
                if(result.code == 0){
                    integral.integralData = result.data;
                    integral.strategyList = result.data.strategyList;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        getLevelList:function (d) {
            featurepack.pack.ajax(dataUrl.getCardLevelUrl,"get",d,function (result) {
                if(result.code == 0){
                    cardLevel.levelListData = result.data;
                }else{
                    swal(result.msg,"", "error");
                }
            })
        },
        getConfigure:function (d) {
            featurepack.pack.ajax(dataUrl.getConfigureUrl,"get",d,function (result) {
                if(result.code == 0){
                    cardConfigure.configureinfo = result.data;
                }else{
                    swal(result.msg,"", "error");
                }
            })
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
        featurepack.pack.option();
        //分页和查询
        cloudMail.getIntegral();
        cloudMail.getLevelList();
        cloudMail.getConfigure();
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});


