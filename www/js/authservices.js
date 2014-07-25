//Auth服务实现，业务逻辑
'use strict';

angular.module('otrsapp.authservices', []).factory('AuthService', function ($q, CommonService) {

  return {
    login: function ($http, credentials) {
      var credentialsTemp = {
        username: '',
        password: ''
      };
      credentialsTemp.username = credentials.username;
      credentialsTemp.password = credentials.password;
      //解决以客户编号登录的问题,我的Otrs客户名字初始化成了汉字，直接用客户名字登录比较麻烦，所以改用客户编号
      //以客户编号登录不检验密码
      if (typeof credentials.username != 'undefined') {
        var firstChar = credentials.username.substring(0,1);
        if (firstChar >= "0" && firstChar <= "9") {
          credentialsTemp.username = 'test';
          credentialsTemp.password = 'test';
        }
      }
      //
      var deferred = $q.defer();
      var wsUrl = "http://61.133.217.140:808/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector";
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
          '<SessionCreate>' +
          '  <tic:UserLogin>' + credentialsTemp.username + '</tic:UserLogin>' +
          '  <tic:Password>' + credentialsTemp.password + '</tic:Password>' +
          '</SessionCreate>' +
          '</soapenv:Body>' +
          '</soapenv:Envelope>'
      });
      request.success(
        function (html) {
          var domParser = new DOMParser();
          var xml = domParser.parseFromString(html, 'text/xml')
            .childNodes[0]
            .childNodes[0]
            .childNodes[0]
            .childNodes[0];
          if (xml.nodeName == 'Error') {
            deferred.reject(CommonService.xml2json(xml));
          } else {
            deferred.resolve(CommonService.xml2json(xml));
          }
        }
      ).error(function (status) {
        deferred.reject(status);
      });
      return deferred.promise;
    },
    logout: function ($window) {
      if (typeof $window.localStorage.auth != 'undefined') {
        delete $window.localStorage.auth;
        delete $window.localStorage.username ;
      }
    },
    isLoggedIn: function ($window) {
      if (typeof $window.localStorage.auth == 'undefined') {
        return false;
      } else {
        return true;
      }
    }
  }
});