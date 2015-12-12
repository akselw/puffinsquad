var myApp = angular.module('myApp.controllers');

myApp.controller('SearchController', ['$scope', '$http', '$compile', '$filter', function ($scope, $http, $compile, $filter) {



  $scope.getLocationLt = function (org) {

    var coordinates = [];
    var lat = 0;
    coordinates = [];

    console.log(org);

    angular.forEach($scope.markers, function(item) {

      // if one of the organisations in the API equals the organisations markers´ id
      if (item.id === org.orgid) {

	lat = item.lat;

      }

    });

    return lat;
  };

  $scope.getLocationLg = function (org) {
    var coordinates = [];
    var lng = 0;
    var orgdata;
    coordinates = [];

    angular.forEach($scope.markers, function(item) {

      // if one of the organisations in the API equals the organisations markers´ id
      if (item.id === org.orgid) {
	orgdata = item;
	lng = item.lng;

      }

    });

    return lng;
  };

  
}]);
