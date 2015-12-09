myApp.service("OrgServices", [
    "$http",
    function ($http) {
      var ORGUNIT_URL = "http://apps.dhis2.org/demo/api/organisationUnits.json?paging=false";

      function getOrganisationUnits() {
        
         $http({
            method: "GET",
            url: "http://apps.dhis2.org/demo/api/organisationUnits.json?paging=false",
            headers: { "Authorization": "Basic YWRtaW46ZGlzdHJpY3Q=" }

          }).success(function (data) {
            $scope.orgunits = data;
          });

      return {
     
        getOrganisationUnits

      };
    }
  ]);
