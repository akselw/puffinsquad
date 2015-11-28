
/*
define([
  "app",
  "services/orgUnitService"
], function (app) {
  "use strict";

  app.controller("OrgUnitCtrl", [
    "$scope", "OrgUnitService",
    function ($scope, OrgUnitService) {
      $scope.orgUnits = [];
      $scope.query = "";

      $scope.search = function () {
        OrgUnitService.search($scope.query).then(
          function (data) {
            $scope.orgUnits = data;
          }
        );
      };

      $scope.byId = function () {
        OrgUnitService.getOrgUnit($scope.query).then(
          function (data) {
            var list = [];
            if (data !== undefined) {
              list.push(data);
            }
            $scope.orgUnits = list;
          }
        );
      };

      OrgUnitService.getOrgUnits().then(
        function (data) {
          $scope.orgUnits = data;
        }
      );
    }
  ]);
});
*/

org.fac('orgs', ['$http', function($http) { 
  return $http.get('js/json/orgunits.json') 
            .success(function(data) { 
              return data; 
            }) 
            .error(function(err) { 
              return err; 
            }); 
}]);

