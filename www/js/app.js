//主控文件，主要包含模块引入、路由配置
'use strict';

angular.module('otrsapp', ['ionic', 'otrsapp.ticketservices', 'otrsapp.authservices', 'otrsapp.controllers'])

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  //$httpProvider.defaults.useXDomain = true;
  //$httpProvider.defaults.headers.post["Content-Type"] = "text/xml;charset=UTF-8";
  //delete $httpProvider.defaults.headers.common['X-Requested-With'];
  //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  //tab主状态
  $stateProvider
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
  //tab子状态ticket-index（url要与主状态url拼起来）
  .state('tab.ticket-index', {
    url: '/tickets',
    views: {
      'tickets': {
        templateUrl: 'templates/ticket-index.html',
        controller: 'TicketIndexCtrl'
      }
    }
  })
  //tab子状态ticket-detail
  .state('tab.ticket-detail', {
    url: '/tickets/:ticketId',
    views: {
      'tickets': {
        templateUrl: 'templates/ticket-detail.html',
        controller: 'TicketDetailCtrl'
      }
    }
  })
  //tab子状态myinfo
  .state('tab.myinfo', {
    url: '/myinfo',
    views: {
      'myinfo-tab': {
        templateUrl: 'templates/myinfo.html',
        controller: 'LoginCtrl'
      }
    }
  })
  //tab子状态about
  .state('tab.about', {
    url: '/about',
    views: {
      'about-tab': {
        templateUrl: 'templates/about.html',
        controller: 'AboutCtrl'
      }
    }
  });

  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    });

  $urlRouterProvider.otherwise('/tab/tickets');

})
//登录拦截器
.run(function ($rootScope, $window, $location, AuthService) {
  $rootScope.$on("$locationChangeStart", function (event, next, current) {
    if (AuthService.isLoggedIn($window)) {
      //登录
      //event.preventDefault();
    } else {
      //未登录
      $location.path('/login');
      //event.preventDefault();
    }
  });
});