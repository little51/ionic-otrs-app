ionic-otrs-app
==============
a otrs(Open-source Ticket Request System) app base on ionic<br>
基于Ionic开发的Otrs(http://www.otrs.com/?lang=zh-hans IT运维管理/客服系统)手机客户端<br>
主要实现客户查询工单的功能，

##1.运行程序
###下载源码
git clone https://github.com/little51/ionic-otrs-app.git或download zip
###下载依赖包
在ionic-otrs-app目录下执行：npm install<br>
为了使用gulp，还需要执行：npm install gulp -g
###启动程序
gulp
###运行App（在浏览器中测试）
为了解决跨域访问问题
* Linux：chromium-browser --disable-web-security&
* Window:chrome浏览器启动项加disable-web-security
* http://localhost:8080
* 用户名：640001 口令:0000
##2.将ionic-otrs-app用于您的otrs
###导入GenericTicketConnector webservice接口
http://yourhost/otrs/index.pl?Action=AdminGenericInterfaceWebservice<br>
导入 ionic-otrs-app\ws\GenericTicketConnector.yml<br>
###修改app中webservice调用指向
在 ionic-otrs-app\www\js\ticketservices.js和authservices.js中的wsUrl变量值
##3.用到的技术要点
* gulp管理包依赖关系
* gulp-connect 实现web监听（浏览器环境下）
* GenericInterfaceWebservice 实现App调用otrs后台
* locationChangeStart event拦截实现Session控制
* $window.localStorage 实现Session的本地持久
* ion-infinite-scroll 实现分页
##4.文件列表
index.html       主页面
js:
  app.js           路由和模块引入<br>
  authservices.js  登录控制<br>
  common.js        xml转json<br>
  controllers.js   控制器<br>
  ticketservices.js工单查询服务<br>
templates:<br>
  about.html      关于<br>
  login.html      登录<br>
  myinfo.html     我的<br>
  tabs.html       Tab<br>
  ticket-detail.html 工单详细<br>
  ticket-index.html  工单索引<br>

##5.license
MIT license