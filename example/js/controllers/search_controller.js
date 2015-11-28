angular.module('myApp.controllers', []).
  controller('SearchController', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {

$http.get('js/json/orgunits.json')
			.success(function (data) {
      		$scope.org_units = data;
    		})
    		.error(function(err) {
    			return err;
    		});            
}]);