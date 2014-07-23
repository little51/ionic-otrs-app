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

.controller('LoginCtrl', function ($scope, $http, $state) {
    $scope.user = {};
    $scope.login = function () {
        console.log($scope.user);
        $state.go('tab.ticket-index');
    }
});