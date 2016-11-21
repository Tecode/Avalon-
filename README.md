# -2.0.0
增加新的UI交互和设计，对以前的代码进行了优化提升性能。

对所有的页面都进行了改版，对已有的js进行优化通过对象的方式进行调用。

参数：
overallSituation:avalon全局作用域
avalonStart:定义avalon组件
Fn:构造函数名称
cloudMail:实例化对象名称

完成度：
main:已完成参数需要增加
payConfig:需不需要验证
paycount:查看需要显示那些信息
图片单张上传已经封装好

变更：
album页面的ids是一个json数组，不再是一串字符串

分页名称格式统一为：
    "pagejson": {
      "pagesize": 20,
      "pagecount": 6,
      "pageindex": 0,
      "totalcount":500
    }