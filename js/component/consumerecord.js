/**
 * Created by ASSOON on 2016/11/9.
 */

define(['avalon','bootstrap','bootstrap_select','moment','daterangepicker','featurepack','sweet_alert'], function(avalon,bootstrap,selectpicker,moment,daterangepicker,featurepack,swal) {
  var dataUrl = null;
  var showList,searchList;
  var postdata = {
    starttime:"",
    endtime:"",
    vipname:""
  };
  var Fn = function () {
    this.avalonStart = function () {
      showList = avalon.define({
        $id:"showList",
        listData:[]
      });

      searchList = avalon.define({
        $id:"searchList",
        searchButton:function () {
          $("form").serializeArray().map(function (child,index) {
            postdata[child.name] = child.value
          });
          cloudMail.getResponse(postdata);
        }
      });
      avalon.scan(document.body);
    };
    //分页插件封装的avalon需要传url
    this.fn = function () {
      showList.listData = arguments[0].data.xflist;
    };
    this.getResponse = function (data) {
      featurepack.pack.pager(this.fn,data,dataUrl.getConsumeRecordList);
    };
    this.getTime = function () {
      postdata.starttime = arguments[0];
      postdata.endtime = arguments[1];
    };
    this.getAjax = {
      refundMoney:function (postdata) {
        featurepack.pack.ajax(dataUrl.refundMoneyUrl,"get",postdata,function (result) {
          if(result.code == 0){
            swal("退款成功!", "您已经退款成功了，点击OK关闭窗口。", "success");
          }else{
            swal(result.msg,"", "error");
          }
        })
      }
    }
  };
  var cloudMail = new Fn();
  var initStart = function (url) {
    dataUrl = url;
    //下拉选项初始化
    featurepack.pack.option();
    featurepack.pack.toggleTops();
    featurepack.pack.datePicker(cloudMail.getTime,"#date-range-picker",false);
    //分页和查询
    cloudMail.getResponse(postdata);
    cloudMail.avalonStart();

  };
  return {
    init_start: initStart
  };
});