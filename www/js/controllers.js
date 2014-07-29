//控制器
'use strict';

angular.module('otrsapp.controllers', [])

.controller('TicketIndexCtrl', function ($scope, $http, $state, $window, TicketService) {
  $scope.start = -10;
  $scope.end = 0;
  $scope.step = 10;
  $scope.tickets = [];
  $scope.noMoreItemsAvailable = false;

  $scope.getByStartAndEnd = function (stepIt) {
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
      if (data.length == 0) {
        $scope.noMoreItemsAvailable = true;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.refreshComplete');
    }, function (error) {
      console.log(error);
      $state.go('login');
    });
  }
})

.controller('TicketDetailCtrl', function ($scope, $http, $stateParams, $window, $ionicPopup, $timeout, TicketService) {
  TicketService.get($http, $stateParams.ticketId, $window.localStorage.auth).then(function (data) {
    $scope.ticket = data;
  });

  $scope.andArticle = function () {
    $scope.data = {
      choice: 'A',
      another: ''
    };
    var articleType =
      '<ion-radio ng-model="data.choice" ng-value="A">处理不及时</ion-radio>' +
      '<ion-radio ng-model="data.choice" ng-value="B">服务态度差</ion-radio>' +
      '<ion-radio ng-model="data.choice" ng-value="C">未正确处理</ion-radio>' +
      '<ion-radio ng-model="data.choice" ng-value="D">其它</ion-radio>' +
      '<input type="text" ng-model="data.another"></input>';

    var addPopup = $ionicPopup.show({
      template: articleType,
      title: '投诉原因',
      subTitle: '请选择',
      scope: $scope,
      buttons: [
        {
          text: '放弃'
        },
        {
          text: '<b>保存</b>',
          type: 'button-positive',
          onTap: function (e) {
            return $scope.data;
          }
      },
    ]
    });
    addPopup.then(function (res) {
      console.log(res);
    });
    $timeout(function () {
      addPopup.close();
    }, 30000);
  }
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
        / /
        console.log('error');
      });
    });
  }

  $scope.logout = function () {
    AuthService.logout($window);
  }
});