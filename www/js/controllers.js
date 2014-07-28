//控制器
'use strict';

angular.module('otrsapp.controllers', [])

.controller('TicketIndexCtrl', function ($scope, $http, $state, $window, TicketService) {
  $scope.start = -10;
  $scope.end = 0;
  $scope.step = 10;
  $scope.tickets = [];
  $scope.getByStartAndEnd = function (stepIt) {
    console.log(stepIt);
    if (stepIt) {
      $scope.start += $scope.step;
      $scope.end += $scope.step;
    }
    TicketService.getByStartAndEnd($http, $window.localStorage.auth,
      $window.localStorage.username, $scope.start, $scope.end).then(function (data) {
      if (stepIt) {
        $scope.tickets = $scope.tickets.concat(data);
      } else {
        $scope.tickets = data;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
})

.controller('TicketDetailCtrl', function ($scope, $http, $stateParams, $window, TicketService) {
  TicketService.get($http, $stateParams.ticketId, $window.localStorage.auth).then(function (data) {
    $scope.ticket = data;
  });
})

.controller('LoginCtrl', function ($rootScope, $scope, $http, $state, $ionicPopup, $window, AuthService) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.username = $window.localStorage.username;

  $scope.login = function (credentials) {
    AuthService.login($http, credentials).then(function (data) {
      $window.localStorage.auth = data;
      $window.localStorage.username = credentials.username;
      $state.go('tab.ticket-index');
    }, function (err) {
      delete $window.localStorage.username;
      delete $window.localStorage.auth;
      var loginError = $ionicPopup.alert({
        title: '登录错误',
        template: '用户名或口令错误！<br>' + err.ErrorMessage
      });
      loginError.then(function (res) {
        //console.log('error');
      });
    });
  }

  $scope.logout = function () {
    AuthService.logout($window);
  }
});