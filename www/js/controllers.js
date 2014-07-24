//控制器
'use strict';

angular.module('otrsapp.controllers', [])

.controller('TicketIndexCtrl', function ($scope, $http, $state,$window, TicketService) {
  TicketService.all($http,$window.localStorage.auth).then(function (data) {
    $scope.tickets = data;
  });
})

.controller('TicketDetailCtrl', function ($scope, $http, $stateParams,$window, TicketService) {
  TicketService.get($http, $stateParams.ticketId,$window.localStorage.auth).then(function (data) {
    $scope.ticket = data;
  });
})

.controller('LoginCtrl', function ($rootScope, $scope, $http, $state, $ionicPopup,$window, AuthService) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function (credentials) {
    AuthService.login($http, credentials).then(function (data) {
      $rootScope.$broadcast('app.loggedIn');
      $rootScope.currentUser = credentials;
      $window.localStorage.auth = data ;
      $state.go('tab.ticket-index');
    }, function (err) {
      $rootScope.$broadcast('app.loggedOut');
      $rootScope.currentUser = null;
      delete $window.localStorage.auth ;
      var loginError = $ionicPopup.alert({
        title: '登录错误',
        template: '用户名或口令错误！<br>' + err.ErrorMessage
      });
      loginError.then(function (res) {
        //console.log('error');
      });
    });
  }
  
  $scope.logout = function() {
    AuthService.logout($window) ;
  }
});