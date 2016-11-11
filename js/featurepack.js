/**
 * Created by ASSOON on 2016/11/6.
 */
define(['jquery','avalon','moment','daterangepicker'], function ($,avalon,moment,daterangepicker) {
    var pack = function () {
        //定义ajax方法
        this.ajax = function (url,type,postdata,fn) {
            $.ajax({
                url:url,type:type,data:postdata,dataType:"json",
                success:function (result) {
                    fn?fn.call(this,result):'';
                },
                error:function (result) {
                    fn?fn.call(this,result):'';
                }
            })
        };
        //分页
        this.pager = function (fn,postdata,url) {
            var ajaxdata = {
                pageSize: 20,
                curPage:1
            };
            for(key in postdata){
                ajaxdata[key] = postdata[key];
            }

            var vm = null;
            var self = this;
            var ajax = function (postdata) {
                self.ajax(url,"get",postdata,function (result) {
                    if(result.code == 0){
                        vm.totalItems = result.data.pagejson[0].totalcount;
                        fn.call(this,result);
                    }
                });
            };

            ajax(ajaxdata);

             vm = avalon.define({
                $id: "test",
                curPage: 1,//开始页
                totalPages: 15,//总页数
                totalItems: 0,//总共多少条
                pageItems: [1,2,3,4,5,6,7,8,9,10],
                pageSize: 20,//每页显示条数
                changePage: function (p) {
                    if(p<0){
                        p = 0
                    }else if(p>vm.totalPages){
                        p = vm.totalPages
                    }

                    this.curPage = p;
                    page = p;
                    //回调函数
                var changePage = {
                    pageSize: 20,
                    curPage:this.curPage
                };
                for(ket in postdata){
                    changePage[key] = postdata[key]
                }
                    ajax(changePage);

                    console.log(changePage);
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
        };
        //隐藏或者显示的一些事件
        this.toggleTops = function () {
            $("#topstats").click(function () {
                $(".topstats").slideToggle(100);
            });
        };
        //正则表达式
        this.datePicker = function () {
            $('#date-range-picker').daterangepicker(null, function(start, end, label) {
                console.log(start.toISOString(), end.toISOString(), label);
            });
        };
        this.RE = function () {

        }
    };
    var _featurepack = new pack();
    return {
        pack: _featurepack
    }
});