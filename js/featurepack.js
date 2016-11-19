/**
 * Created by ASSOON on 2016/11/6.
 */
define(['jquery', 'avalon', 'daterangepicker', 'moment'], function ($, avalon, daterangepicker,moment) {
    var vm,data;
    var render = true;
    var pack = function () {
        //定义ajax方法
        this.render = function (fn) {
            render = fn.call(this,'');
        };
        this.ajax = function (url, type, postdata, fn) {
            $.ajax({
                url: url, type: type, data: postdata, dataType: "json",
                success: function (result) {
                    fn ? fn.call(this, result) : '';
                },
                error: function (result) {
                    fn ? fn.call(this, result) : '';
                }
            })
        };
        //分页
        this.pager = function (fn, postdata, url) {
            data = postdata;
            var ajaxdata = {
                pageSize: 20,
                curPage: 1
            };
            for (key in postdata) {
                ajaxdata[key] = postdata[key];
            }

            var self = this;
            var ajax = function (postdata) {
                self.ajax(url, "get", postdata, function (result) {
                    if (result.code == 0) {
                        vm.totalItems = result.data.pagejson.totalcount;
                        vm.totalPages = result.data.pagejson.pagecount;
                        fn.call(this, result);
                    }
                });
            };

            ajax(ajaxdata);
            console.info("搜索传的数据:"+JSON.stringify(ajaxdata));
        //让他初始化一次,不然点击就会一直渲染导致崩溃
            if(render){init();render = false;}
            function init() {
                vm = avalon.define({
                    $id: "test",
                    curPage: 1,//开始页
                    totalPages: 0,//总页数
                    totalItems: 0,//总共多少条
                    pageItems: [1],
                    pageSize: 20,//每页显示条数
                    changePage: function (p) {
                        if (p < 0) {
                            p = 0
                        } else if (p > vm.totalPages) {
                            p = vm.totalPages
                        }

                        this.curPage = p;
                        page = p;
                        //回调函数
                        changePage = {
                            pageSize: 20,
                            curPage: this.curPage
                        };
                        for (key in data) {
                            changePage[key] = data[key]
                        }
                        console.info("分页传的数据"+JSON.stringify(changePage));
                        if (this.totalPages <= 5) {
                            this.pageItems = avalon.range(1, this.totalPages + 1);
                        } else {
                            if (this.curPage < 4) {
                                this.pageItems = avalon.range(1, 6);
                            } else if (this.curPage > 3 && this.curPage < this.totalPages - 1) {
                                this.pageItems = avalon.range(this.curPage - 2, this.curPage + 3);
                            } else {
                                this.pageItems = avalon.range(this.totalPages - 4, this.totalPages + 1);
                            }
                        }
                    }
                });
                avalon.scan(document.body);
            }
        };
        this.expand = function () {
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
        };
        //隐藏或者显示的一些事件
        this.toggleTops = function () {
            $("#topstats").click(function () {
                $(".topstats").slideToggle(100);
            });

            $("#search").click(function () {
                $(".panel").slideToggle(100);
            });
        };
        this.datePicker = function (fn,id,type) {
            var dateUntil = moment();
            type?(function () {
                dateUntil = null;
                })():(function () {
                dateUntil= moment();
                });
            $(id).daterangepicker(
                {
                    singleDatePicker: type,
                    // startDate: moment().startOf('day'),
                    //endDate: moment(),
                    //minDate: '01/01/2012',    //最小时间
                    maxDate: dateUntil, //最大时间
                    dateLimit: {
                        days: 30
                    }, //起止时间的最大间隔
                    showDropdowns: true,
                    showWeekNumbers: false, //是否显示第几周
                    timePicker: false, //是否显示小时和分钟
                    //timePickerIncrement : 60, //时间的增量，单位为分钟
                    //timePicker12Hour : false, //是否使用12小时制来显示时间
                    ranges: {
                        //'最近1小时': [moment().subtract('hours',1), moment()],
                        '今日': [moment().startOf('day'), moment()],
                        '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
                        '最近7日': [moment().subtract('days', 6), moment()],
                        '最近30日': [moment().subtract('days', 29), moment()]
                    },
                    opens: 'left', //日期选择框的弹出位置
                    buttonClasses: ['btn btn-default'],
                    applyClass: 'btn-small btn-primary blue',
                    cancelClass: 'btn-small',
                    format: 'YYYY-MM-DD', //控件中from和to 显示的日期格式
                    separator: ' to ',
                    locale: {
                        applyLabel: '确定',
                        cancelLabel: '取消',
                        fromLabel: '起始时间',
                        toLabel: '结束时间',
                        customRangeLabel: '自定义',
                        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                            '七月', '八月', '九月', '十月', '十一月', '十二月'],
                        firstDay: 1
                    }
                }, function (start, end, label) {//格式化日期显示框

                    //console.info(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'))
                    fn.call(this, start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                });
        };
        this.option = function () {
            $('.selectpicker').selectpicker({
                size: "auto"
            });
        };
        this.checkValue = function (fn) {
            return{
                // onError: function (reasons) {
                //     $('.tips-msg').remove();
                //     reasons.forEach(function (child) {
                //         $(child.element).parents('.col-sm-10').after('<p class="col-sm-offset-2 tips-msg col-sm-10 color-down">'+child.message+'</p>');
                //     })
                // },
                onValidateAll: function (reasons) {
                    reasons.length == 0?(function () {
                        fn.call(this,'',reasons);
                    })():(function () {
                        $('.tips-msg').remove();
                        reasons.forEach(function (child) {
                            if($(child.element).parent('div').hasClass('col-sm-9')){
                                $(child.element).parent('div').after('<p class="col-sm-offset-3 tips-msg col-sm-9 color-down">'+child.message+'</p>');
                            }else if($(child.element).parent('div').hasClass('col-sm-10')){
                                $(child.element).parent('div').after('<p class="col-sm-offset-2 tips-msg col-sm-10 color-down">'+child.message+'</p>');
                            }
                        })
                    })();
                },
                validateInBlur:true,
                validateInKeyup:true
            }
        };
        this.upload = function () {
        //上传文件
        }
    };
    var _featurepack = new pack();
    return {
        pack: _featurepack
    }
});