//控制器
'use strict';

angular.module('otrsapp.controllers', [])

.controller('TicketIndexCtrl', function ($scope, $http, $state, TicketService) {
  TicketService.all($http).then(function (data) {
    $scope.tickets = data;
  });
})

.controller('TicketDetailCtrl', function ($scope, $http, $stateParams, TicketService) {
  TicketService.get($http, $stateParams.ticketId).then(function (data) {
    $scope.ticket = data;
  });
})

.controller('LoginCtrl', function ($rootScope, $scope, $http, $state,$ionicPopup) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function (credentials) {
    if (credentials.username == '') {
      $rootScope.$broadcast('login error');
      $rootScope.currentUser = null;
      var loginError = $ionicPopup.alert({
        title: '登录错误',
        template: '用户名或口令错误！' 
      });
      loginError.then(function (res) {
        console.log('error');
      });

    } else {
      $rootScope.$broadcast('login ok');
      $rootScope.currentUser = credentials;
      $state.go('tab.ticket-index');
    }
  }
});