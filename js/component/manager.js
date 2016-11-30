/**
 * Created by ASSOON on 2016/11/7.
 */
define(['bootstrap', 'avalon', 'jstree', 'jquery_select', 'sweet_alert', 'featurepack'], function (bootstrap, avalon, jstree, jquery_select, swal, featurepack) {
    var manager, dataUrl,globalData;
    var initStart = function (l) {
        dataUrl = l;
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
                dataList: [],
                checked: {checked: 'checked'},
                managementScope: [],//管理范围
                paymentAuthority: [],//支付配置权限
                storeuthority: [],//门店管理权限
                allpaymentAuthority: [],//拉取全部支付配置权限
                allstoreuthority: [],//拉取全部门店管理权限
                specialauth:'',//底部复选框
                administratorsInfo: {},
                clearAttr: function (e) {
                    $('.tips-msg').remove();
                },
                saveAdministrator:function () {
                    var data = '';
                    $('.specialauth').find('input:checked').each(function (index,elme) {
                        data +=$(elme).val()+','
                    });
                    data = data.substr(0,data.length-1);
                    cloudMail.saveAdministratorInfo({aid:globalData.aid,specialauth:data})
                },
                deleteAdministrator:function () {
                    swal({
                            title: "确定要删除此管理员吗？?",
                            text: "删除以后将不会恢复!",
                            type: "warning",
                            showCancelButton: true,
                            cancelButtonText:"取消",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: false
                        },
                        function(){
                            cloudMail.deleteAdministrator({aid:globalData.aid})
                        });
                },
                amend: function (value, index, event) {
                    cloudMail.judge(index, 1);
                },
                addAdministrators: function () {
                    cloudMail.judge(3, 1);
                },
                save: function (value, index, event) {
                    cloudMail.judge(index, 2)
                },
                getAdministratorsInfo: function (d) {
                    globalData = d;
                    cloudMail.getAdministratorsInfoUrl({aid: d.aid})
                },
                validate: featurepack.pack.checkValue(function () {
                    //验证成功的回调
                    var depts = $('.selectdept').select('getSelected');
                    var deptid = '';
                    $(depts).each(function (i, dept) {
                        deptid += cloudMail.getTreeNodeId(dept.id) + ",";
                    });
                    var postdata = {};
                    postdata.deptid = deptid;
                    manager.password.length > 0 ? (function () {
                        postdata.password = manager.password;
                    })() : "";
                    for (key in manager.filldata) {
                        postdata[key] = manager.filldata[key]
                    }
                    delete postdata.depts;
                    delete postdata.wxcode;
                    delete postdata.time;
                    delete postdata.img;
                    isAddDepartment().doubt ? (function () {
                        //$('.data_tree').jstree('get_selected', true)[0].id 获取当前所在部门id
                        cloudMail.addUser(postdata, $('.data_tree').jstree('get_selected', true)[0].id)
                    })() : (function () {
                        console.info($('.data_tree').jstree('get_selected', true));
                        cloudMail.editUser(postdata, $('.data_tree').jstree('get_selected', true)[0].id)
                    })();
                })
            });
            avalon.scan(document.body)
        },
        //一些判断初始化和循环方法
        initSelect: function () {
            selectUser = $('.panel-body .select-user').select({
                url: '',
                multiple: false,
                jstree: {
                    url: dataUrl.getDeptTree + '?type=user',
                    selectType: 'user'
                }
            });
            selectDept = $('.panel-body .selectdept').select({
                url: '',
                multiple: true,
                jstree: {
                    'url': dataUrl.getDeptTree
                }
            });
        },
        judge: function (index, type) {
            var isOK = true;
            $('.tips-msg').remove();
            //type2 保存type1修改或添加
            type == 1 ? (function () {
                switch (index) {
                    case 0:
                        var detp=manager.managementScope;
                        for (var i = 0; i < manager.managementScope.length; i++) {
                            detp[i].id = 'dept_' + manager.managementScope[i].id;
                            detp[i].icon = "fa fa-folder";
                        }
                        $('.scope .selectdept').select('setSelected',detp);
                        break;
                    case 1:
                        cloudMail.getAllPayconfig();
                        break;
                    case 2:
                        cloudMail.getAllStoreauth();
                        break;
                    case 3:
                        //清理
                        $('.add .selectdept').select('clearSelected');
                        $('.add .select-user').select('clearSelected');
                        break;
                }
            })() : (function () {
                function getJson(selectDom,checkDetp,isSingular,Dom) {
                    //合并数组，如果是双数要传DOM节点
                    var thisArry=[],meun='';
                    if(isSingular==1){
                            $(selectDom).each(function(index, el) {
                                meun += $(el).val() + ',';
                            });
                            meun = meun.substr(0,meun.length-1);
                            checkDetp.forEach(function (child) {
                                thisArry.push({
                                    id: child.id.replace('dept_',''),
                                    meun:meun
                                });
                            });
                    }else {
                        $(Dom).each(function (index,childDom) {
                            $(childDom).find('input:checked').length>0?(function () {
                                var jsonArr = {
                                    id:$(childDom).attr('data_info'),
                                    meun:''
                                };
                                $(childDom).find('input:checked').each(function (index,el) {
                                    jsonArr.meun += $(el).val() + ',';
                                });
                                jsonArr.meun = jsonArr.meun.substr(0,jsonArr.meun.length-1);
                                thisArry.push(jsonArr);
                            })():''
                        })
                    }

                    return thisArry;
                }

                switch (index) {
                    case 0:
                        var depts = $('.scope .selectdept').select('getSelected');
                        if (!depts.length >0) {
                            $('.scope .selectdept').after('<p class="tips-msg color-down">请选择管理范围</p>');
                            isOK = false;
                            return;
                        }else {
                        cloudMail.editDeptauth({"deptauth":JSON.stringify(getJson('.deptauth input[type=checkbox]:checked',depts,1))});
                        }
                        break;
                    case 1:
                        cloudMail.editMerchantauth({"merchantauth":JSON.stringify(getJson('.merchantauth input[type=checkbox]:checked',null,2,'.merchantauth .items'))});
                        break;
                    case 2:
                        cloudMail.editStoreauth({"storeauth":JSON.stringify(getJson('.storeauth input[type=checkbox]:checked',null,2,'.storeauth .items'))});
                        break;
                    case 3:
                        //保存新建管理员
                        var selectDepts = $('.add .selectdept').select('getSelected');
                        var selectUser = $('.add .select-user').select('getSelected');
                        if (!selectUser.length >0) {
                            $('.panel-body .iamuser').after('<p class="tips-msg color-down">请选择管理员</p>');
                            isOK = false;
                            return;
                        }else if(!selectDepts.length > 0){
                            $('.panel-body .selectdept').after('<p class="tips-msg color-down">请选择管理范围</p>');
                            isOK = false;
                            return;
                        }else {
                            var pData ={
                                userid:selectUser[0].id.replace('user_',''),
                                deptid:''
                            };
                            selectDepts.forEach(function (child) {
                                pData.deptid+=child.id.replace('dept_','')+',';
                            });
                            pData.deptid = pData.deptid.substr(0,pData.deptid.length-1);
                            cloudMail.addNewAdministratorsUrl(pData);
                        }
                        break;
                }
            })();
            if(isOK&&type==1){
                $(".modalicon" + index).click();
            }else if(isOK&&type==2){

            }
        },
        //获取管理员列表ajax方法
        getResponse: function (d) {
            featurepack.pack.ajax(dataUrl.getAdministratorsUrl, "get", d, function (result) {
                if (result.code == 0) {
                    manager.administratorsList = result.data;
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        addNewAdministratorsUrl: function (d) {
            featurepack.pack.ajax(dataUrl.addNewAdministratorsUrl, "get", d, function (result) {
                if (result.code == 0) {
                    swal("添加管理员成功!", "您已添加管理员，点击OK关闭窗口。", "success");
                    $(".modalicon3").click();
                    cloudMail.getResponse();
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        deleteAdministrator: function (d) {
            featurepack.pack.ajax(dataUrl.deleteAdministratorUrl, "get", d, function (result) {
                if (result.code == 0) {
                    swal("删除管理员成功!", "您已成功删除了该管理员，点击OK关闭窗口。", "success");
                    cloudMail.getResponse();
                    manager.dataList = [];
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        getAdministratorsInfoUrl: function (d) {
            featurepack.pack.ajax(dataUrl.getAdministratorsInfoUrl, "get", d, function (result) {
                if (result.code == 0) {
                    manager.dataList = result.data;
                    manager.administratorsInfo = result.data[0];
                    manager.managementScope = result.data[0].auth.deptauth;
                    manager.paymentAuthority = result.data[0].auth.merchantauth;
                    manager.storeuthority = result.data[0].auth.storeauth;
                    manager.specialauth = result.data[0].auth.specialauth;
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        editDeptauth:function (d) {
            console.info(d);
            featurepack.pack.ajax(dataUrl.editDeptauthUrl, "get", d, function (result) {
                if (result.code == 0) {
                    swal("修改管理员范围成功!", "您已成功修改了管理范围，点击OK关闭窗口。", "success");
                    $(".modalicon0").click();
                    cloudMail.getAdministratorsInfoUrl({aid: globalData.aid})
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        editMerchantauth:function (d) {
            console.info(d);
            featurepack.pack.ajax(dataUrl.editMerchantauthUrl, "get", d, function (result) {
                if (result.code == 0) {
                    swal("修改支付权限成功!", "您已成功支付权限，点击OK关闭窗口。", "success");
                    $(".modalicon1").click();
                    cloudMail.getAdministratorsInfoUrl({aid: globalData.aid})
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        editStoreauth:function (d) {
            console.info(d);
            featurepack.pack.ajax(dataUrl.editStoreauthUrl, "get", d, function (result) {
                if (result.code == 0) {
                    swal("修改门店权限成功!", "您已成功修改了门店权限，点击OK关闭窗口。", "success");
                    $(".modalicon2").click();
                    cloudMail.getAdministratorsInfoUrl({aid: globalData.aid})
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        saveAdministratorInfo:function (d) {
            console.info(d);
            featurepack.pack.ajax(dataUrl.saveAdministratorInfoUrl, "get", d, function (result) {
                if (result.code == 0) {
                    swal("修改其它权限成功!", "您已成功修改了其它权限设置，点击OK关闭窗口。", "success");
                    cloudMail.getAdministratorsInfoUrl({aid: globalData.aid})
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        //获取全部支付配置
        getAllPayconfig:function (d) {
            featurepack.pack.ajax(dataUrl.getPayconfig, "get", d, function (result) {
                if (result.code == 0) {
                    var allpaymentAuthority = result.data.merchant;
                    //这里循环为了在页面中不会undefined
                    $.each(allpaymentAuthority,function (i) {
                        allpaymentAuthority[i].meun ="";
                    });
                    $.each(allpaymentAuthority,function (index,child) {
                        $.each(manager.paymentAuthority,function (i,value) {
                            if(child.merchantid == value.id){
                                allpaymentAuthority[index].meun = manager.paymentAuthority[i].meun
                            }
                        })
                    });
                    manager.allpaymentAuthority = allpaymentAuthority;
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        //获取全部门店权限
        getAllStoreauth:function (d) {
            featurepack.pack.ajax(dataUrl.getStroe, "get", d, function (result) {
                if (result.code == 0) {
                    var allstoreuthority = result.data;
                    $.each(allstoreuthority,function (i) {
                        allstoreuthority[i].meun ="";
                    });
                    $.each(allstoreuthority,function (index,child) {
                        $.each(manager.storeuthority,function (i,value) {
                            if(child.branchid == value.id){
                                allstoreuthority[index].meun = manager.storeuthority[i].meun
                            }
                        })
                    });
                    manager.allstoreuthority = allstoreuthority;
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