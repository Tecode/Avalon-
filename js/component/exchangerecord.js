/**
 * Created by ASSOON on 2016/11/9.
 */

define(['avalon', 'bootstrap', 'bootstrap_select', 'moment', 'daterangepicker', 'featurepack', 'sweet_alert'], function (avalon, bootstrap, selectpicker, moment, daterangepicker, featurepack, swal) {
    var dataUrl = null;
    var showList, searchList;
    var postdata = {
        starttime: "",
        endtime: "",
        giftname: "",
        hxcode: ''
    };
    var Fn = function () {

    };
    var cloudMail = {
        avalonStart: function () {
            showList = avalon.define({
                $id: "showList",
                listData: [],
                filldata: {},
                editDepartment: '',
                clear: function () {
                    $('.tip').remove();
                },
                validate: {
                    onValidateAll: function (reasons) {
                        reasons.length == 0 ? (function () {
                            cloudMail.checkCode({hxcode:showList.editDepartment})
                        })() : (function () {
                            $('.tip').remove();
                            $(reasons[0].element).parents('.errortips').after('<p class="color-down tip">' + reasons[0].message + '</p>')
                        })();
                    },
                    validateInBlur: true
                },
                readMore: function (el) {
                    showList.filldata = el;
                    $("#showBigBox").click()
                },
                check: function () {
                    $("#showSmallbox").click()
                }
            });

            searchList = avalon.define({
                $id: "searchList",
                searchButton: function () {
                    $("form").serializeArray().map(function (child, index) {
                        postdata[child.name] = child.value
                    });
                    cloudMail.getResponse(postdata);
                }
            });
            avalon.scan(document.body);
        },
        //分页插件封装的avalon需要传url
        fn: function () {
            showList.listData = arguments[0].data.giftrecord;
        },
        getResponse: function (data) {
            featurepack.pack.pager(cloudMail.fn, data, dataUrl.getExchangeRecordList);
        },
        getTime: function () {
            postdata.starttime = arguments[0];
            postdata.endtime = arguments[1];
        },
        checkCode: function (postdata) {
            cos
            featurepack.pack.ajax(dataUrl.checkCodeUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    swal("核销成功!", "您已经核销成功了，点击OK关闭窗口。", "success");
                } else {
                    swal(result.msg, "", "error");
                }
            })
        }
    };
    var initStart = function (url) {
        dataUrl = url;
        //下拉选项初始化
        featurepack.pack.option();
        featurepack.pack.toggleTops();
        featurepack.pack.datePicker(cloudMail.getTime, "#date-range-picker", false);
        //分页和查询
        cloudMail.getResponse(postdata);
        cloudMail.avalonStart();

    };
    return {
        init_start: initStart
    };
});