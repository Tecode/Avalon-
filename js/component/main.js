/**
 * Created by ASSOON on 2016/11/6.
 */
define(['bootstrap','avalon','d3','rickshaw','featurepack'], function(bootstrap,avalon,d3,rickshaw,featurepack) {
    var overallSituation,showChart,listInfo,url;
//代码从这里开始执行
    var initStart = function (l) {
        url = l;
        cloudMail.avalonStart();
        featurepack.pack.toggleTops();
        cloudMail.drawImg();
        //获取数据
        cloudMail.getAjax.getResponse();
        //获取支付数据
        cloudMail.getAjax.getPayResponse();
        //获取商城数据
        cloudMail.getAjax.getMallResponse()
    };
    var Fn = function () {
        this.drawImg = function () {
            var seriesData = [ [], []];
            var random = new Rickshaw.Fixtures.RandomData(1);
            for (var i = 0; i < 30; i++) {
                random.addData(seriesData);
            }
            // 实例支付
            var paygraph = new Rickshaw.Graph( {
                element: document.getElementById("payChart"),
                renderer: 'bar',
                series: [
                    {
                        color: "#77BBFF",
                        data: seriesData[0],
                        name: '今日微信支付收入'
                    }
                ],
                min:0
            } );
            //实例化商城
            var mallgraph = new Rickshaw.Graph( {
                element: document.getElementById("mallChart"),
                renderer: 'bar',
                series: [
                    {
                        color: "#77BBFF",
                        data: seriesData[0],
                        name: '今日商城收入'
                    }
                ]
            } );
            console.log(seriesData[1]);
            mallgraph.render();

            paygraph.render();
            //鼠标移动到上面弹出提示
            var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                graph: paygraph,
                formatter: function(series, x, y) {
                    var date = '<span class="date">' +x+ '</span>';
                    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                    var content = swatch + series.name + ": " + y + '<br>' + date;
                    return content;
                }
            } );

            var hoverDetai = new Rickshaw.Graph.HoverDetail( {
                graph: mallgraph,
                formatter: function(series, x, y) {
                    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
                    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                    var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
                    return content;
                }
            } );
        };
        //avalon方法
        this.avalonStart = function () {
            overallSituation = avalon.define({
                $id:"overallSituation",
                    payNowday:"0",
                    payNowcount:"0",
                    payNowmonth:"0"
            });
            listInfo = avalon.define({
                $id:"listInfo",
                    payRnking:[],
                    mallRanking:[]
            });
            showChart = avalon.define({
                $id:"showChart"
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
                    }else {
                        alert("Error")
                    }
                });
            },
            //获取商城信息
            getPayResponse:function () {
                featurepack.pack.ajax(url.reportNow,"get",null,function (result) {
                    if(result.code == 0){
                        overallSituation.payChart = result.data;
                        overallSituation.payNowday = result.data.nowday;
                        overallSituation.payNowcount = result.data.nowcount;
                        overallSituation.payNowmonth = result.data.nowmonth;
                    }else {
                        alert("Error")
                    }
                });
            },
            //获取商城数据
            getMallResponse:function () {
                featurepack.pack.ajax(url.mallReport,"get",null,function (result) {
                    if(result.code == 0){
                        showChart.mallChar = result.data
                    }else {
                        alert("Error")
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
