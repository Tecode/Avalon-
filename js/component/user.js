/**
 * Created by ASSOON on 2016/11/6.
 */
define(['bootstrap','avalon', 'jstree','jquery_select','sweet_alert'], function (bootstrap,avalon,jstree,jquery_select,swal) {

    var initStart = function () {
        $('.panel-tools .expand-tool').on('click', function(){
            if($(this).parents(".panel").hasClass('panel-fullsize'))
            {
                $(this).parents(".panel").removeClass('panel-fullsize');
            }
            else
            {
                $(this).parents(".panel").addClass('panel-fullsize');

            }
        });


        $('.selectdept').select({
            url: '',
            multiple: true,
            jstree: {
                'url': 'json/datatree.json'
            }
        });

        $('.data_tree').jstree({
            "plugins" : ["wholerow", "types", "contextmenu"],
            'core' : {
                "check_callback" : true,
                'data' : {
                    "url" : "json/datatree.json",
                    "dataType" : "json" // needed only if you do not supply JSON headers
                }
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder"
                }
            },
            "contextmenu":{
                "items":{
                    addPerson: {
                        label: "新增成员",
                        action: function (node) {
                            $('#showBigBox').click();
                        },
                        "separator_after": true
                    },
                    createItem: {
                        label: "添加部门",
                        action: function (node) {
                            console.log(node);
                            $('#showSmallbox').click();
                        }
                    },
                    renameItem: {
                        label: "修改名称",
                        action: function (node) {
                            $('#showSmallbox').click();
                        }
                    },
                    deleteItem: {
                        label: "删除",
                        action: function (node) {
                                swal({
                                        title: "Are you sure?",
                                        text: "You will not be able to recover this imaginary file!",
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#DD6B55",
                                        confirmButtonText: "Yes, delete it!",
                                        closeOnConfirm: false
                                    },
                                    function(){
                                        swal("Deleted!", "Your imaginary file has been deleted.", "success");
                                    });
                        },
                        "separator_after": true
                    }
                },

            }

        })
            .on("changed.jstree", function (e, data) {
                console.info(data.node.id);
            })
            .on('open_node.jstree', function (e, data) {
                console.info(e);
                console.info(data.node);
            });

    };


    return {
        init_start: initStart
    };
});