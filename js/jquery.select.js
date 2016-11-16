/**
 * Created by ASSOON on 2016/11/8.
 */
;(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define(["jquery"], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function($) {

    function init(obj){
        var options = $(obj).data("select").options;
        if(options.jstree.url != ""){
            var initHtml = '<div class="choose-input-list"><ul><li class="input"><input style="box-shadow:none;height: 22px" type="text" placeholder=""></li></ul><div class="input-select-list"><div class="list-tree"></div></div></div>';
        }else{
            var initHtml = '<div class="choose-input-list"><ul><li class="input"><input style="box-shadow:none;height: 22px" type="text" placeholder=""></li></ul><div class="input-select-list"><ul class="list-ul"></ul></div></div>';
        }

        var selectObj = $(initHtml).appendTo($(obj));
        var selectList = $(selectObj).find('.input-select-list');

        options.selectObj = selectObj;
        options.selectList = selectList;

        initData(obj);
        //初始化事件
        $(selectObj).click(function(event) {
            $(selectObj).find('li.input input').focus();
            event.stopPropagation();
        });

        $(selectObj).find('li.input input').focus(function(event) {
            $(selectList).show();
            $(selectList).css({
                width:$(selectObj).width()+2
            })
        });

        $(document.body).click(function(event) {
            $(options.selectList).hide();
        });

        $(selectList).delegate('.list-ul >li>a', 'click', function(event) {
            addSelect(obj,$(this).attr('data-id'),$(this).find('.item-text').text());
            $(selectObj).find('li.input input').focus();
        });
    }

    function initData(obj){
        var options = $(obj).data("select").options;

        if(options.jstree.url != ''){
            var jstreeConfig = {
                'plugins':["wholerow","types"],
                'core' : {
                    "check_callback" : true,
                    'data':{
                        'url' : options.jstree.url,
                        "dataType" : "json",
                        "data" : function (node) {
                            return { "id" : node.id };
                        }
                    }
                },
                'types':{
                    // "dept":{
                    //     "icon" : "fa fa-folder"
                    // },
                    // "user":{
                    //     "icon" : "fa fa-folder"
                    // },
                    "default" : {
                        "icon" : "fa fa-folder"
                    }
                }
            };
            $(obj).find('.list-tree').jstree(jstreeConfig).on('changed.jstree', function(e,data) {
                if(options.jstree.selectType && options.jstree.selectType!=''){
                    if(options.jstree.selectType ==data.node.type){
                        addSelect(obj,data.node.id,data.node.text,data.node.icon);
                    }
                }else{
                    addSelect(obj,data.node.id,data.node.text,data.node.icon);
                }

            })
        }else{
            var data = options.jsonData;
            $(options.selectList).find('.list-ul').html('');
            for (var i=0; i < data.length; i++) {
                var liobj = '<li><a href="javascript:;" data-id="'+ data[i].id +'"><i class="fa fa-folder"></i> <span class="item-text">'+ data[i].text +'</span></a></li>';
                $(liobj).appendTo($(options.selectList).find('.list-ul'));
            }
        }

        var selected = options.selected;
        for(var i=0;i<selected.length;i++){
            addSelect(obj,selected[i].id,selected[i].text,selected[i].icon);
        }

    }



    function addSelect(obj,id,text,icon){
        var options = $(obj).data("select").options;
        if($(options.selectObj).find('li[data-id="'+id+'"]').length>0){
            return;
        }
        if(!icon){
            icon = 'fa fa-folder';
        }
        if(options.multiple){
            var liobj = '<li class="input-list-item" data-id="'+ id +'"><span class="item-icon"><i class="'+  icon+'"></i></span> <span class="item-text">'+ text +'</span> <a href="javascript:;" class="item-remove"><i class="fa fa-trash-o"></i></a></li>';
            $(liobj).insertBefore($(options.selectObj).find('li.input')).find('.item-remove').click(function(event) {
                $(this).parent().remove();
            });
        }else{
            $(options.selectObj).find('.input-list-item').remove();
            var liobj = '<li class="input-list-item" data-id="'+ id +'"><span class="item-icon"><i class="'+  icon+'"></i></span> <span class="item-text">'+ text +'</span></li>';
            $(liobj).insertBefore($(options.selectObj).find('li.input'))
        }

        $(options.selectList).hide();
    }

    $.fn.select = function(target,parm) {
        if (typeof target == "string") {
            return $.fn.select.methods[target](this, parm);
        }
        target = target || {};
        return this.each(function () {
            var select = $(this).data("select");
            if (select) {
                $.extend(select.options, target);
            } else {
                select = $(this).data("select", {
                    options: $.extend({}, $.fn.select.defaults, target)
                });
                init(this);

            }
        })
    };

    function _getSelected(obj){
        var options = $(obj).data("select").options;
        var selected = $(options.selectObj).find('.input-list-item');
        var json = [];
        for(var i=0;i<selected.length;i++){
            var temp = {
                id:$(selected[i]).attr('data-id'),
                text:$(selected[i]).find('.item-text').text()
            };
            json.push(temp);
        }
        return json;
    }

    function _clearSelected(obj){
        var options = $(obj).data("select").options;
        options.selected = [];
        $(options.selectObj).find('.input-list-item').remove();
        return obj;
    }

    function _setSelected(obj,data){
        var options = $(obj).data("select").options;
        options.selected = data;
        _clearSelected(obj);
        for(var i=0;i<data.length;i++){
            addSelect(obj,data[i].id,data[i].text,data[i].icon);
        }
    }

    function _setJsonData(obj,data){
        var options = $(obj).data("select").options;
        options.jsonData = data;
        initData(obj);
    }

    $.fn.select.methods = {
        getSelected:function(obj){
            return _getSelected(obj);
        },
        clearSelected:function(obj){
            return _clearSelected(obj);
        },
        setSelected:function(obj,data){
            return _setSelected(obj,data);
        },
        setJsonData:function(obj,data){
            return _setJsonData(obj,data);
        }
    };
    $.fn.select.defaults = {
        url: '',
        jsonData:'',
        multiple:true,
        jstree:{
            url:'',
            selectType:'',
        },
        selected:[]
    };
}));


