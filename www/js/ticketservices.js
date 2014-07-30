//Ticket服务实现，业务逻辑
'use strict';

angular.module('otrsapp.ticketservices', ['otrsapp.common']).factory('TicketService', function ($q, $window, CommonService, AuthService) {
  var wsUrl = "http://61.133.217.140:808/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector";
  var getByid = function ($http, ticketId, sessionId, ifAll) {
    var deferred = $q.defer();
    var request = $http({
      method: "post",
      url: wsUrl,
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
        '  <tic:AllArticles>' + ifAll + '</tic:AllArticles>' +
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
        if (typeof jsonObject.ErrorCode != 'undefined') {
          AuthService.logout($window);
          deferred.reject('会话过期，请重新登录');
        } else {
          var status = '';
          if (jsonObject.StateID = '1') {
            status = '新建';
          } else if (jsonObject.StateID = '2') {
            status = '完成';
          } else if (jsonObject.StateID = '4') {
            status = '处理中'
          } else {
            status = '挂起';
          }
          var Articles = [];
          if (jsonObject.Article instanceof Array) {
            Articles = jsonObject.Article;
          } else {
            Articles.push(jsonObject.Article);
          }
          tickets = {
            id: jsonObject.TicketID,
            title: jsonObject.Title,
            description: Articles[0].Body.substr(0, 20),
            status: status,
            created: jsonObject.Created,
            queue: jsonObject.Queue.replace('队列', ''),
            articles: Articles
          };
          deferred.resolve(tickets);
        }
      }
    ).error(function (status) {
      deferred.reject(status);
    });
    return deferred.promise;
  };


  var getAll = function ($http, sessionId, customId) {
    var deferred = $q.defer();
    var request = $http({
      method: "post",
      url: wsUrl,
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
        '  <tic:CustomerUserID>' + customId + '</tic:CustomerUserID>' +
        '</TicketSearch>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>'
    });
    request.success(
      function (html) {
        var xml = null;
        var domParser = new DOMParser();
        xml = domParser.parseFromString(html, 'text/xml').
        childNodes[0].
        childNodes[0].
        childNodes[0];
        var jsonObject = CommonService.xml2json(xml).TicketID;
        if (typeof jsonObject == 'undefined') {
          AuthService.logout($window);
          deferred.reject('会话过期，请重新登录');
        } else {
          deferred.resolve(jsonObject);
        }
      }
    ).error(function (status) {
      deferred.reject(status);
    });
    return deferred.promise;
  };

  var getOne = function ($http, ticketId, sessionId, customId) {
    var deferred = $q.defer();
    var tickets = null;
    var promise = getByid($http, ticketId, sessionId, customId);
    promise.then(function (data) {
      tickets = data;
      deferred.resolve(tickets);
    });
    return deferred.promise;
  };

  var updateTicket = function ($http, ticketId, sessionId, customId, body) {
    var deferred = $q.defer();
    var request = $http({
      method: "post",
      url: wsUrl,
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns:tic="http://www.otrs.org/TicketConnector/"> ' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
        '<TicketUpdate> ' +
      //'<tic:SessionID>' + sessionId + '</tic:SessionID>' +
      '<tic:TicketID>' + ticketId + '</tic:TicketID>' +
      //'<tic:CustomerUserID>' + customId + '</tic:CustomerUserID>' +
      '<tic:UserLogin>test</tic:UserLogin>' +
        '<tic:Password>test</tic:Password>' +
        '<tic:Ticket>' +
        '<tic:PriorityID>5</tic:PriorityID>' +
        '</tic:Ticket>' +
        '<tic:Article>' +
        '<tic:From>' + customId + '</tic:From>' +
        '<tic:Subject>用户反馈</tic:Subject>' +
        '<tic:Body>' + body + '</tic:Body>' +
        '<tic:Charset>utf8</tic:Charset>' +
        '<tic:MimeType>text/plain</tic:MimeType>' +
        '</tic:Article>' +
        '</TicketUpdate>' +
        '</soapenv:Body> ' +
        '</soapenv:Envelope>'
    });
    request.success(
      function (html) {
        console.log(html);
        deferred.resolve('updated');
      }
    ).error(function (status) {
      deferred.reject(status);
    });
    return deferred.promise;
  };

  return {
    getByStartAndEnd: function ($http, sessionId, customId, start, end, step) {
      var deferred = $q.defer();
      var ticketsearch = [];
      getAll($http, sessionId, customId).then(function (jsonObject) {
        var ticketIdList = [];
        if (jsonObject instanceof Array) {
          ticketIdList = jsonObject;
        } else {
          ticketIdList.push(jsonObject);
        }
        var j = ticketIdList.length;
        //结束位不能超过长度
        if (end > j) {
          end = j;
        }
        //开始位不能大于结束位
        if (start >= end) {
          start = end - step;
          if (start < 0) {
            start = 0;
          }
        }
        console.log('起始位置:' + start + ' 结束位置：' + end);
        //for 循环同步方法:定义promise数组，将每次循环返回值（promise）压入promise数组
        //$q.all的回调里，返回上层的承诺deferred.resolve(ticketsearch);
        var promiseFor = [];
        for (var i = start; i < end; i++) {
          promiseFor.push(getByid($http, ticketIdList[i], sessionId, 1).then(function (data) {
            ticketsearch.push(data);
          }));
        }
        $q.all(promiseFor).then(function () {
          deferred.resolve(ticketsearch);
        });
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    },
    get: function ($http, ticketId, sessionId) {
      return getOne($http, ticketId, sessionId, 1);
    },
    updateTicket: function ($http, ticketId, sessionId, customId, body) {
      return updateTicket($http, ticketId, sessionId, customId, body);
    }
  }
});