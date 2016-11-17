/**
 * Created by ASSOON on 2016/11/6.
 */
define(['bootstrap', 'avalon', 'jstree', 'jquery_select', 'sweet_alert', 'featurepack'], function (bootstrap, avalon, jstree, jquery_select, swal, featurepack) {
    var dataUrl, overallSituation, checkMiniBox ,isAddDepartment;
    var cloudMail = {
        getTreeNodeId:function (nodeid) {
        return nodeid.split('_').length > 1 ? nodeid.split('_')[1] : nodeid.split('_')
        },
        initSlect: function () {
            $('.selectdept').select({
                url: '',
                multiple: true,
                jstree: {
                    'url': dataUrl.getJstreeUrl
                }
            });

            $('.data_tree').jstree({
                "plugins": ["wholerow", "types", "contextmenu"],
                'core': {
                    "check_callback": true,
                    'data': {
                        "url": "json/datatree.json",
                        "dataType": "json" // needed only if you do not supply JSON headers
                    }
                },
                "types": {
                    "default": {
                        "icon": "fa fa-folder"
                    }
                },
                "contextmenu": {
                    "items": {
                        addPerson: {
                            label: "新增成员",
                            action: function (node) {
                                $('.loginname').removeAttr('readonly', 'readonly');
                                cloudMail.setDeptUser(1,node);
                                overallSituation.filldata ={
                                    name:"",sex:"1",loginname:"",mobile:"",email:"",position:""
                                };
                            },
                            "separator_after": true
                        },
                        createItem: {
                            label: "添加部门",
                            action: function (node) {
                                cloudMail.setDeptDialog(1);
                            }
                        },
                        renameItem: {
                            label: "修改名称",
                            action: function (node) {
                                cloudMail.setDeptDialog(2);
                            }
                        },
                        deleteItem: {
                            label: "删除",
                            action: function (node) {
                                swal({
                                        title: "确定删除吗？?",
                                        text: "您将会删除该成员!",
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#DD6B55",
                                        confirmButtonText: "确定",
                                        cancelButtonText: "取消",
                                        closeOnConfirm: false
                                    },
                                    function () {
                                        cloudMail.delDept(node);
                                    });
                            },
                            "separator_after": true
                        }
                    }

                }

            })
                .on("changed.jstree", function (e, data) {

                })
                .on('open_node.jstree', function (e, data) {

                });
        },
        avalonStart: function () {
            overallSituation = avalon.define({
                $id: "userlist",
                filldata: {},
                userList: [],
                select: [],
                password:"",
                editTree: function (el) {
                    overallSituation.filldata = el;
                    $('.loginname').attr('readonly', 'readonly');
                    $('.selectdept').select('setSelected', el.depts);
                    cloudMail.setDeptUser(2);
                },
                clearAttr: function (e) {
                    $(e.target).parents('.col-sm-10').siblings('.tips-msg').remove();
                },
                deleteSelect: function () {
                    overallSituation.select.length == 0 ? swal("出错啦！", "您当前没有选择删除的内容。", "error") : (function () {
                        swal({
                                title: "确定删除选中的人员?",
                                text: "删除以后将不会恢复!",
                                type: "warning",
                                showCancelButton: true,
                                cancelButtonText: "取消",
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "确定",
                                closeOnConfirm: false
                            },
                            function () {
                                cloudMail.deletePeople({ids: overallSituation.select});
                            });
                    })()
                },
                choiceAll: function (e) {
                    if ($(e.target).attr('data') == 0 && $(e.target).text() == '全部选中') {
                        $(e.target).text('取消全选');
                        $(e.target).attr('data', 1);
                        for (var i = 0; i < overallSituation.userList.length; i++) {
                            overallSituation.select.push(overallSituation.userList[i].id.toString())
                        }
                    } else if ($(e.target).attr('data') == 1 && $(e.target).text() == '取消全选') {
                        $(e.target).text('全部选中');
                        $(e.target).attr('data', 0);
                        overallSituation.select = [];
                    }
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
                                overallSituation.password.length>0? (function () {
                                    postdata.password = overallSituation.password;
                                })():"";
                                for(key in overallSituation.filldata){
                                    postdata[key] = overallSituation.filldata[key]
                                }
                            delete postdata.depts;
                            delete postdata.wxcode;
                            delete postdata.time;
                            delete postdata.img;
                    console.log(isAddDepartment());
                            isAddDepartment().doubt?(function () {
                                //$('.data_tree').jstree('get_selected', true)[0].id 获取当前所在部门id
                                cloudMail.addUser(postdata,$('.data_tree').jstree('get_selected', true)[0].id)
                                })():(function () {
                                cloudMail.editUser(postdata,$('.data_tree').jstree('get_selected', true)[0].id)
                                })();
                }),
                choice: function (e) {
                    $(e.target).children('input').attr({'selected': 'selected'})
                }
            });
            checkMiniBox = avalon.define({
                $id:"minibox",
                editDepartment:"",
                clear:function () {
                    $('.tip').remove();
                },
                validate:{
                    onValidateAll: function (reasons) {
                        reasons.length == 0?(function () {
                            isAddDepartment().doubt?(function () {
                                cloudMail.adddept({deptId:0});
                            })():(function () {
                                cloudMail.editdept({deptId:isAddDepartment().deptId});
                            })();
                        })():(function () {
                            $('.tip').remove();
                            $(reasons[0].element).parents('.errortips').after('<p class="color-down tip">'+reasons[0].message+'</p>')
                        })();
                    },
                    validateInBlur:true
                }
            });
            avalon.scan(document.body)
        },
            // 添加修改用户
        setDeptUser:function (type) {
            type==1?(function () {
                $('.selectdept').select('clearSelected');
                isAddDepartment = function () {
                    return {
                        doubt:true
                    }
                };
                })():(function () {
                    isAddDepartment = function () {
                        return {
                            doubt:false
                        }
                    };
                })();

            $('#showBigBox').click();

    },
        /*添加修改部门 type:  1新增，2重命名*/
        setDeptDialog: function (type) {
            var deptTree = $('.data_tree');
            var selectedNode = deptTree.jstree().get_selected(true);
            type == 1?(function () {
                    $('.modal-header .modal-title').text('添加部门');
                    checkMiniBox.editDepartment = "";
                    isAddDepartment = function () {
                        return {
                            doubt:true
                        }
                    };
                })():(function () {
                    $('.modal-header .modal-title').text('修改部门');
                    checkMiniBox.editDepartment = selectedNode[0].text;
                    isAddDepartment = function () {
                        return {
                            doubt:false,
                            deptId:cloudMail.getTreeNodeId(selectedNode[0].id)
                        }
                    };
                })();

            $('#showSmallbox').click();
        },
        //删除部门
        delDept: function () {
            cloudMail.deletePeople({deptId:$('.data_tree').jstree('get_selected', true)[0].id},$('.data_tree').jstree('get_selected', true));
        },
        //ajax方法
        getResponse: function (postdata) {
            featurepack.pack.ajax(dataUrl.getUserListUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    overallSituation.userList = result.data;
                    console.log(overallSituation.userList)
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        deletePeople: function (postdata,node) {
            featurepack.pack.ajax(dataUrl.deletePeopleUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    $('.data_tree').jstree('delete_node', node);
                        swal("删除成功!", "您已经删除了该成员，点击OK关闭窗口。", "success");
                    console.info(postdata)
                } else {
                        swal(result.msg, "", "error");
                }
            })
        },
        editdept:function (postdata) {
            featurepack.pack.ajax(dataUrl.editdeptUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    var ref = $('.data_tree').jstree();
                    var sel = ref.get_selected();
                    ref.rename_node(sel[0], checkMiniBox.editDepartment);
                    swal("修改成功!", "您已经修改了该成员，点击OK关闭窗口。", "success");
                    console.info(postdata)
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        adddept:function (postdata) {
            featurepack.pack.ajax(dataUrl.adddeptUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    var ref = $('.data_tree').jstree();
                    var sel = ref.get_selected();
                        ref.create_node(sel[0], {
                            "text": checkMiniBox.editDepartment,
                            "id": 'dept_' + result.data.deptid,
                            "icon": 'tree-icon fa fa-folder'
                        });
                    swal("添加成功!", "您已经添加成员，点击OK关闭窗口。", "success");
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        addUser:function (postdata,deptid) {
            featurepack.pack.ajax(dataUrl.addUserUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    swal("添加成功!", "您已经添加成员，点击OK关闭窗口。", "success");
                    cloudMail.getResponse({deptid:deptid});
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        editUser:function (postdata,deptid) {
            featurepack.pack.ajax(dataUrl.editUserUrel, "get", postdata, function (result) {
                if (result.code == 0) {
                    swal("修改成功!", "您已成功修改成员，点击OK关闭窗口。", "success");
                    cloudMail.getResponse({deptid:deptid})
                } else {
                    swal(result.msg, "", "error");
                }
            })
        }
    };

    var initStart = function (url) {
        dataUrl = url;
        //放大表格
        featurepack.pack.expand();
        cloudMail.initSlect();
        cloudMail.avalonStart();
        cloudMail.getResponse();
    };

    return {
        init_start: initStart
    };
});