/**
 * Created by ASSOON on 2016/11/6.
 */

define(['bootstrap','avalon','d3','rickshaw'], function(bootstrap,avalon,d3,rickshaw) {

    var Fn = function () {
        this.active = function () {
            $("#topstats").click(function () {
                $(".topstats").slideToggle(100);
            });
        };
        this.drawImg = function () {
            var seriesData = [ ['21','23'], [], [] ];
            var random = new Rickshaw.Fixtures.RandomData(10);

            for (var i = 0; i < 30; i++) {
                random.addData(seriesData);
            }
            // 实例化我们的图
            var graph = new Rickshaw.Graph( {
                element: document.getElementById("todaysales"),
                renderer: 'bar',
                series: [
                    {
                        color: "#77BBFF",
                        data: seriesData[1],
                        name: '今日收入'
                    }
                ]
            } );

            graph.render();
            //弹出提示
            var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                graph: graph,
                formatter: function(series, x, y) {
                    var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
                    var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
                    var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
                    return content;
                }
            } );
        }
    };
    var cloudMail = new Fn();
//代码从这里开始执行
    var initStart = function () {
        cloudMail.active();
        cloudMail.drawImg();
    };
    
    return {
        init_start: initStart
    };
    
});
