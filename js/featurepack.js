/**
 * Created by ASSOON on 2016/11/6.
 */
define(['jquery', 'avalon', 'daterangepicker', 'moment', 'sweet_alert'], function ($, avalon, daterangepicker, moment, swal) {
    var vm, data;
    var render = true;
    var pack = function () {
        //定义ajax方法
        this.render = function (fn) {
            render = fn.call(this, '');
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
            console.info("搜索传的数据:" + JSON.stringify(ajaxdata));
            //让他初始化一次,不然点击就会一直渲染导致崩溃
            if (render) {
                init();
                render = false;
            }
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
                        ajax(changePage);
                        console.info("分页传的数据" + JSON.stringify(changePage));
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
            $('.panel-tools .expand-tool').on('click', function () {
                if ($(this).parents(".panel").hasClass('panel-fullsize')) {
                    $(this).parents(".panel").removeClass('panel-fullsize');
                }
                else {
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
        this.datePicker = function (fn, id, type) {
            var dateUntil = moment();
            type ? (function () {
                dateUntil = null;
            })() : (function () {
                dateUntil = moment();
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
            return {
                // onError: function (reasons) {
                //     $('.tips-msg').remove();
                //     reasons.forEach(function (child) {
                //         $(child.element).parents('.col-sm-10').after('<p class="col-sm-offset-2 tips-msg col-sm-10 color-down">'+child.message+'</p>');
                //     })
                // },
                onValidateAll: function (reasons) {
                    reasons.length == 0 ? (function () {
                        fn.call(this, '', reasons);
                    })() : (function () {
                        $('.tips-msg').remove();
                        reasons.forEach(function (child) {
                            if ($(child.element).parent('div').hasClass('col-sm-9')) {
                                $(child.element).parent('div').after('<p class="col-sm-offset-3 tips-msg col-sm-9 color-down">' + child.message + '</p>');
                            } else if ($(child.element).parent('div').hasClass('col-sm-10')) {
                                $(child.element).parent('div').after('<p class="col-sm-offset-2 tips-msg col-sm-10 color-down">' + child.message + '</p>');
                            }
                        })
                    })();
                },
                validateInBlur: true,
                validateInKeyup: true
            }
        };
        this.removeUpLoadimg = function (value) {
            return value;
        };
        this.upload = function (fn,getUrl,url,more,errtip,removeData) {
            //上传文件
            var uploader = new plupload.Uploader({
                runtimes: 'html5,flash,silverlight,html4',
                browse_button: 'pickfiles',
                url: url,
                flash_swf_url: 'js/bower_components/plupload/Moxie.swf',
                silverlight_xap_url: 'js/bower_components/plupload/Moxie.xap',
                filters: {
                    max_file_size: '10mb',
                    mime_types: [
                        {title: "Image files", extensions: "jpg,gif,png"},
                        {title: "Zip files", extensions: "zip"},
                        {title: "证书文件", extensions: "xmp"}
                    ]
                },

                init: {
                    PostInit: function () {
                       document.getElementById('uploadfiles').onclick = function () {
                                if (uploader.files.length == 0) {
                                    $('#uploadtips').fadeIn(100).text('您还没有选择图片哦！').removeClass('color-up').addClass('color-down');
                                    timer();
                                } else {
                                    if(more!=2){
                                        uploader.files.length>1?(function () {
                                            uploader.files.splice(0,uploader.files.length-1);
                                        })():'';
                                        //判断上传多张是否在上传时删除了，如果删除了要在提交前移除他
                                    }else if(more==2||removeData.call(this,'').length>0){
                                        var rData = removeData.call(this,'');
                                        for (var i = 0;i < uploader.files.length; i++) {
                                            for(var j=0;j<rData.length;j++){
                                                if(uploader.files[i].id==rData[j].id){
                                                    uploader.files.splice(i, 1);
                                                }
                                            }
                                        }
                                    }
                                    uploader.start();
                                    return false;
                                }
                            };
                        document.getElementById('pickfiles').onclick = function () {

                        }
                    },
                    FilesAdded: function (up, files) {
                            $.each(up.files, function (i, file) {
                                if (up.files.length <= 1) {
                                    return;
                                }
                                    try {

                                    }catch (e){
                                        up.removeFile(file);
                                    }
                            });
                            files.length > 1 ? (function () {
                            swal(
                                {
                                    title: "选择的文件太多啦！",
                                    text: "每次只能选择一个文件上传哦！",
                                    timer: 4500,
                                    showConfirmButton: true
                                });
                        })() : (function () {
                            for (var i = 0, len = files.length; i < len; i++) {
                                if(files[i].type.indexOf('image')>=0&&more==3){
                                    uploader.files.splice(i, 1);
                                    swal(
                                        {
                                            title: "上传文件格式错误！",
                                            text: "上传的不是支付证书格式，请重新选择",
                                            timer: 4000,
                                            showConfirmButton: true
                                        });
                                }
                                if (files[i].size > 819200) {
                                    uploader.files.splice(i, 1);
                                    swal(
                                        {
                                            title: "上传的文件过大!",
                                            text: "上传的文件不能超过800KB",
                                            timer: 4500,
                                            showConfirmButton: true
                                        });
                                } else {
                                    if(files[i].type.indexOf('image')>=0){
                                        !function (i) {
                                            previewImage(files[i], function (imgsrc) {
                                                fn.call(this,imgsrc,files[i].size,files[i].name,files[i]);
                                                $('#uploadtips').fadeIn().text('添加成功').removeClass('color-down').addClass('color-up');
                                                timer();
                                            });
                                        }(i);
                                    }else {
                                        fn.call(this,files[i].size,files[i].name);
                                    }
                                }
                            }
                        })();
                    },
                    UploadProgress: function (up, file) {
                        $('#uploadtips').fadeIn(100).text("上传进度" + file.percent + "%").addClass('color-up');
                    },
                    FileUploaded: function (up, file, info) {
                        var resule = JSON.parse(info.response);
                        if (resule.code == 0) {
                            $('#uploadtips').fadeIn().text('上传成功').addClass('color-up');
                            //$('#deleteimg').show();
                            timer();
                            getUrl.call(this,resule)
                        }
                    },
                    Error: function (up, err) {
                        if(more==2||more==3){
                            errtip.call(this,err.message);
                        }else {
                            $('#uploadtips').fadeIn().text(err.message).addClass('color-down');
                            timer();
                        }
                    }
                }
            });

            var previewImage = function (file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
                if (!file || !/image\//.test(file.type)) return; //确保文件是图片
                if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                    var fr = new mOxie.FileReader();
                    fr.onload = function () {
                        callback(fr.result);
                        fr.destroy();
                        fr = null;
                    };
                    fr.readAsDataURL(file.getSource());
                } else {
                    var preloader = new mOxie.Image();
                    preloader.onload = function () {
                        //preloader.downsize(550, 400);//先压缩一下要预览的图片,宽300，高300
                        var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                        callback && callback(imgsrc); //callback传入的参数为预览图片的url
                        preloader.destroy();
                        preloader = null;
                    };
                    preloader.load(file.getSource());
                }
            };
            var timer = function () {
                setTimeout(function () {
                    $('#uploadtips').fadeOut()
                }, 3000)
            };
            uploader.init();
        };
        this.noScroll = function () {
            $('#content,#contentStroe,#contentCard').niceScroll({
                cursorcolor: "#ccc",//#CC0071 光标颜色
                cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
                touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
                cursorwidth: "4px", //像素光标的宽度
                cursorborder: "0", // 	游标边框css定义
                cursorborderradius: "5px",//以像素为光标边界半径
                autohidemode: false //是否隐藏滚动条
            });
        };
        this.cropimage = function (fn) {
                var options ={imageBox: '.imageBox',thumbBox: '.thumbBox',spinner: '.spinner',imgSrc: 'img/example1.jpg'};
                var cropper = new cropbox(options);
                document.querySelector('#file').addEventListener('change', function(){
                    var reader = new FileReader();
                    if(this.files[0].size>819200){
                        swal("图片太大了！","图片不能大于800KB,请重新选择。", "error");
                    }else if(this.files[0].type.indexOf("image")==-1){

                        swal("上传的不是图片哦！","上传的图片支持jpg,png,gif图像类型", "error");
                    }else{
                        $(".cropbox").show();
                        $(".cropimg").hide().children('img').remove();
                        reader.onload = function(e) {
                            $('#modalicon').click();
                            options.imgSrc = e.target.result;
                            cropper = new cropbox(options);
                        };
                        reader.readAsDataURL(this.files[0]);
                        //是一个伪数组
                        this.files.length=[];
                    }
                });
                document.querySelector('#btnCrop').addEventListener('click', function(){
                    var img = cropper.getDataURL();
                    fn.call(this,img,cropper);
                    $(".cropbox").hide();
                    $(".cropimg button").before('<img src="'+img+'">').parent().fadeIn();
                });
            };
        this.progress = function () {
            NProgress.start();
            setTimeout(function() { NProgress.done(); $('.fade').removeClass('out'); }, 1000);

            $("#b-0").click(function() { NProgress.start(); });
            $("#b-40").click(function() { NProgress.set(0.4); });
            $("#b-inc").click(function() { NProgress.inc(); });
            $("#b-100").click(function() { NProgress.done(); });
        };
    };
    var _featurepack = new pack();
    return {
        pack: _featurepack
    }
});