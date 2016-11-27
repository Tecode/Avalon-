/**
 * Created by ASSOON on 2016/11/7.
 */
define(['bootstrap','avalon','jstree','jquery_select', 'sweet_alert','featurepack'], function(bootstrap,avalon,jstree, jquery_select, swal,featurepack) {
    var manager,dataUrl;
    var initStart = function (l) {
        dataUrl = l ;
        cloudMail.getResponse();
        featurepack.pack.expand();
        cloudMail.initSelect();
        cloudMail.avalonStart();
    };
    var cloudMail = {
        avalonStart: function () {
            manager = avalon.define({
                $id: "controlAllView",
                filldata: {},
                administratorsList: [],
                dataList:[],
                managementScope:[],//管理范围
                paymentAuthority:[],//支付配置权限
                storeuthorityA:[],//门店管理权限
                check:null,//查看选项
                manager:null,//管理选项
                administratorsInfo:{},
                clearAttr: function (e) {$(e.target).parents('.col-sm-10').siblings('.tips-msg').remove();},
                amend:function (value,index,event) {cloudMail.judge(index,1);},
                addAdministrators:function () {cloudMail.judge(3,1);},
                save:function (value,index,event) {cloudMail.judge(index,2)},
                getAdministratorsInfo:function (d) {cloudMail.getAdministratorsInfoUrl({aid:d.aid})},
                validate: featurepack.pack.checkValue(function () {
                    //验证成功的回调
                    var depts = $('.selectdept').select('getSelected');
                    var deptid = '';
                    $(depts).each(function (i, dept) {
                        deptid += cloudMail.getTreeNodeId(dept.id) + ",";
                    });
                    var postdata = {};
                    postdata.deptid = deptid;
                    manager.password.length>0? (function () {
                        postdata.password = manager.password;
                    })():"";
                    for(key in manager.filldata){
                        postdata[key] = manager.filldata[key]
                    }
                    delete postdata.depts;
                    delete postdata.wxcode;
                    delete postdata.time;
                    delete postdata.img;
                    isAddDepartment().doubt?(function () {
                        //$('.data_tree').jstree('get_selected', true)[0].id 获取当前所在部门id
                        cloudMail.addUser(postdata,$('.data_tree').jstree('get_selected', true)[0].id)
                    })():(function () {
                        console.info($('.data_tree').jstree('get_selected', true));
                        cloudMail.editUser(postdata,$('.data_tree').jstree('get_selected', true)[0].id)
                    })();
                })
            });
            avalon.scan(document.body)
        },
        initSelect:function () {
            selectUser = $('.panel-body .select-user').select({
                url:'',
                multiple:false,
                jstree:{
                    url:dataUrl.getDeptTree+'?type=user',
                    selectType:'user'
                }
            });
            selectDept = $('.panel-body .selectdept').select({
                url:'',
                multiple:true,
                jstree:{
                    'url':dataUrl.getDeptTree
                }
            });
        },
        judge:function (index,type) {
            var isOK =true;
            //type2 保存type1修改或添加
            type ==1?(function () {
                switch (index){
                    case 0:
                        alert(10);
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:

                        break;
                }
            })():(function () {
                switch (index){
                    case 0:
                        alert(30);
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                    //保存新建管理员
                        var selectDepts = $('.add .selectdept').select('getSelected');
                        var selectUser = $('.panel-body .select-user').select('getSelected');
                        // if(!(selectUser.length>0 && selectDepts.length>0)){
                        //     $('.panel-body .selectdept').after('<p class="tips-msg color-down">请选择管理员和管理范围</p>');
                        //     isOK = false;
                        //     return;
                        // }
                        // var userid = selectUser[0].id.replace('user_','');
                        break;
                }
            })();
            isOK?(function () {
                $(".modalicon"+index).click();
            })():''
        },
        getResponse:function (d) {
            featurepack.pack.ajax(dataUrl.getAdministratorsUrl, "get", d, function (result) {
                if (result.code == 0) {
                    manager.administratorsList = result.data;
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        addNewAdministratorsUrl:function (d) {
            featurepack.pack.ajax(dataUrl.addNewAdministratorsUrl, "post", d, function (result) {
                if (result.code == 0) {
                    swal("修改成功!", "您已成功修改成员，点击OK关闭窗口。", "success");
                    $(".modalicon3").click();
                    cloudMail.getResponse({deptid:deptid})
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        getAdministratorsInfoUrl:function (d) {
            featurepack.pack.ajax(dataUrl.getAdministratorsInfoUrl, "get", d, function (result) {
                if (result.code == 0) {
                    manager.dataList = result.data;
                    manager.administratorsInfo = result.data[0];
                    manager.managementScope = result.data[0].auth.deptauth;
                    manager.paymentAuthority = result.data[0].auth.merchantauth;
                    manager.storeuthorityA = result.data[0].auth.storeauth;
                } else {
                    swal(result.msg, "", "error");
                }
            })
        }
    };
    return {
        init_start: initStart
    }
});