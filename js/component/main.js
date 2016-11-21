/**
 * Created by ASSOON on 2016/11/6.
 */
define(['bootstrap','avalon','d3','rickshaw','featurepack','sweet_alert'], function(bootstrap,avalon,d3,rickshaw,featurepack,swal) {
    var overallSituation,listInfo,url;
//代码从这里开始执行
    var initStart = function (l) {
        url = l;
        cloudMail.avalonStart();
        featurepack.pack.toggleTops();
        //获取数据
        cloudMail.getAjax.getResponse();
        //获取支付数据
        cloudMail.getAjax.getPayResponse();
        //获取商城数据
        cloudMail.getAjax.getMallResponse();
        //绘制

    };
    var Fn = function () {
        this.drawImg = function (id,chartData,tips) {
            var d = [];
            for(var a=0;a<chartData.length;a++){
                d.push({x:null,y:null});
                d[a].x = parseFloat(chartData[a].day);
                d[a].y = parseFloat(chartData[a].money);
            }
            var seriesData = [ [], [], []];
            var random = new Rickshaw.Fixtures.RandomData(1);
            for (var i = 0; i < chartData.length; i++) {
                random.addData(seriesData);
            }
            var tip = tips?'今日微信支付收入':'今日商城收入';
            // 实例支付
            var graph = new Rickshaw.Graph( {
                element: document.getElementById(id),
                renderer: 'bar',
                series: [
                    {
                        color: "#77BBFF",
                        //支付收入图标
                        data:d,
                        name: tip
                    }
                ]
            } );
            graph.render();
            //鼠标移动到上面弹出提示
            var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                graph: graph,
                formatter: function(series, x, y) {
                    var date = '<span class="date">' +new Date().getFullYear()+'年'+(new Date().getMonth()+1)+'月'+x+'日'+ '</span>';
                    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                    var content = swatch + series.name + ": " + y +'元' + '<br>' + date;
                    return content;
                }
            } );
        };
        this.avalonStart = function () {
            overallSituation = avalon.define({
                $id:"overallSituation",
                    payNowday:"0",
                    payNowcount:"0",
                    payNowmonth:"0",
                    mallNowday:"0",
                    mallNowcount:"0",
                    mallNowmonth:"0"
            });
            listInfo = avalon.define({
                $id:"listInfo",
                    payRnking:[],
                    mallRanking:[],
                    payinfodata:{},
                    mallinfodata:{}
            });

            avalon.scan(document.body);
        };
        //ajax方法
        this.getAjax = {
            //获取门店的排名
            getResponse:function () {
                featurepack.pack.ajax(url.reportStoreAll,"get",null,function (result) {
                    if(result.code == 0){
                        // alert("OK");
                        listInfo.mallRanking = result.data.RankNow;
                        listInfo.payRnking = result.data.RankAll;
                        //要加数据就在这里获取
                        listInfo.payinfodata = result.data.mallinfo;
                        listInfo.mallinfodata = result.data.payinfo;
                    }else {
                        swal(result.msg,"", "error");
                    }
                });
            },
            //获取商城信息
            getPayResponse:function () {
                featurepack.pack.ajax(url.reportNow,"get",null,function (result) {
                    if(result.code == 0){
                        // showChart.payChart = result.data.nowmonthday;
                        overallSituation.payNowday = result.data.nowday;
                        overallSituation.payNowcount = result.data.nowcount;
                        overallSituation.payNowmonth = result.data.nowmonth;
                        //绘制商城数据图像
                        cloudMail.drawImg("payChart",result.data.nowmonthday,true);
                    }else {
                        swal(result.msg,"", "error");
                    }
                });
            },
            //获取商城数据
            getMallResponse:function () {
                featurepack.pack.ajax(url.mallReport,"get",null,function (result) {
                    if(result.code == 0){
                        // showChart.mallChar = result.data.nowmonthday;
                        overallSituation.mallNowday = result.data.nowday;
                        overallSituation.mallNowcount = result.data.nowcount;
                        overallSituation.mallNowmonth = result.data.nowmonth;
                        //绘制商城数据图像
                        cloudMail.drawImg("mallChart",result.data.nowmonthday,false);
                    }else {
                        swal(result.msg,"", "error");
                    }
                });
            }
        }
    };
    // 实例化
    var cloudMail = new Fn();


    return {
        init_start: initStart
    };
    
});
