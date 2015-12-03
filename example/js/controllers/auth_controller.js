var myApp = angular.module('myApp.controllers');

myApp.controller('AuthController', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
    $scope.auth_query = {
      name: 'OAuth2 Demo Client',
      cid: 'demo',
      secret: '1e6db50c-0fee-11e5-98d0-3c15c2c6caf6',
      grantTypes: [
        'password',
        'refresh_token',
        'authorization_code'
      ]
    };

    $scope.user = {};


    $scope.sign_in = function () {
      $http({
        method: 'GET',
        url: 'https://play.dhis2.org/demo/api/organisationUnits.geojson?level=2&level=4'
      }, $scope.auth_query).then(function successCallback(response) {
        console.log(response.data);
      }, function errorCallback(response) {
        console.log('Response error: ' + response.status);
      });
    };

    $scope.sign_out = function () {

    };
  }]);
