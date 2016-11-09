/**
 * Created by ASSOON on 2016/11/6.
 */
define(['jquery','avalon'], function ($,avalon) {
    var pack = function () {
        //定义ajax方法
        this.ajax = function (url,type,postdata,dataType,fn) {
            $.ajax({
                url:url,type:type,data:postdata,dataType:dataType,
                success:function (result) {
                    fn?fn.call(this,result):'';
                },
                error:function (result) {
                    fn?fn.call(this,result):'';
                }
            })
        };
        this.pager = function (fn,url) {
            var vm = null;
            var self =this;
            var ajax = function () {
                self.ajax(url.getpaycountList,"get",null,"json",function (result) {
                    if(result.code == 0){
                        vm.totalItems = result.data.pagejson[0].totalcount;
                        fn.call(this,result);
                    }
                });
            };

            ajax();
             vm = avalon.define({
                $id: "test",
                curPage: 1,
                totalPages: 15,
                totalItems: 0,
                pageItems: [1,2,3,4,5,6],
                pageSize: 10,
                changePage: function (p) {
                    this.curPage = p;
                    page = p;
                    //回调函数
                    ajax();
                    console.log('curPage:' + this.curPage);
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
        //正则表达式
        this.RE = function () {

        }
    };
    var _featurepack = new pack();
    return {
        pack: _featurepack
    }
});