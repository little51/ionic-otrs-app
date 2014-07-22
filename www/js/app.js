'use strict';

angular.module('otrsapp', ['ionic', 'otrsapp.services', 'otrsapp.controllers'])

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    //$httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.headers.post["Content-Type"] = "text/xml;charset=UTF-8";
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $stateProvider
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    .state('tab.ticket-index', {
        url: '/tickets',
        views: {
            'tickets': {
                templateUrl: 'templates/ticket-index.html',
                controller: 'TicketIndexCtrl'
            }
        }
    })

    .state('tab.ticket-detail', {
        url: '/tickets/:ticketId',
        views: {
            'tickets': {
                templateUrl: 'templates/ticket-detail.html',
                controller: 'TicketDetailCtrl'
            }
        }
    })

    .state('tab.myinfo', {
        url: '/myinfo',
        views: {
            'myinfo-tab': {
                templateUrl: 'templates/myinfo.html'
            }
        }
    })

    .state('tab.about', {
        url: '/about',
        views: {
            'about-tab': {
                templateUrl: 'templates/about.html'
            }
        }
    });

    $stateProvider
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
    }) ;
    
    $urlRouterProvider.otherwise('/login');

});