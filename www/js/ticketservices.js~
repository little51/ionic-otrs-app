//Ticket服务实现，业务逻辑
'use strict';

angular.module('otrsapp.ticketservices', ['otrsapp.common']).factory('TicketService', function ($q, CommonService) {
  var getByid = function ($http, ticketId, sessionId) {
    var deferred = $q.defer();
    var request = $http({
      method: "post",
      url: "http://61.133.217.140:808/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector",
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns:tic="http://www.otrs.org/TicketConnector/"> ' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
        '<TicketGet>' +
        '  <tic:SessionID>' + sessionId + '</tic:SessionID>' +
        '  <tic:TicketID>' + ticketId + '</tic:TicketID>' +
        '</TicketGet>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>'
    });
    var tickets = null;
    request.success(
      function (html) {
        var xml = null;
        var domParser = new DOMParser();
        xml = domParser.parseFromString(html, 'text/xml').
        childNodes[0].
        childNodes[0].
        childNodes[0].
        childNodes[0];
        var jsonObject = CommonService.xml2json(xml);
        tickets = {
          id: jsonObject.TicketID,
          title: jsonObject.Title,
          description: jsonObject.Created + ' ' + jsonObject.Queue
        };
        deferred.resolve(tickets);
      }
    ).error(function (status) {
      deferred.reject(status);
    });
    return deferred.promise;
  };


  var getAll = function ($http, sessionId) {
    var deferred = $q.defer();
    var request = $http({
      method: "post",
      url: "http://61.133.217.140:808/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector",
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns:tic="http://www.otrs.org/TicketConnector/"> ' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
        '<TicketSearch>' +
        '  <tic:SessionID>' + sessionId + '</tic:SessionID>' +
        '  <tic:Limit>5</tic:Limit>' +
        '  <tic:QueueIDs>6</tic:QueueIDs> ' +
        '  <tic:StateTypeIDs>4</tic:StateTypeIDs> ' +
      //'  <tic:CustomerUserLogin>平罗县中医院</tic:CustomerUserLogin>' +
      '</TicketSearch>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>'
    });
    var ticketsearch = [];
    request.success(
      function (html) {
        var xml = null;
        var domParser = new DOMParser();
        xml = domParser.parseFromString(html, 'text/xml').
        childNodes[0].
        childNodes[0].
        childNodes[0];
        var jsonObject = CommonService.xml2json(xml).TicketID;
        for (var i = 0; i < jsonObject.length; i++) {
          var promise = getByid($http, jsonObject[i], sessionId);
          promise.then(function (data) {
            ticketsearch.push(data);
          });
        }
        deferred.resolve(ticketsearch);
      }
    ).error(function (status) {
      deferred.reject(status);
    });
    return deferred.promise;
  };

  var getOne = function ($http, ticketId, sessionId) {
    var deferred = $q.defer();
    var tickets = null;
    var promise = getByid($http, ticketId, sessionId);
    promise.then(function (data) {
      tickets = data;
      deferred.resolve(tickets);
    });
    return deferred.promise;
  }

  return {
    all: function ($http, sessionId) {
      return getAll($http, sessionId);
    },
    get: function ($http, ticketId, sessionId) {
      return getOne($http, ticketId, sessionId);
    }
  }
});