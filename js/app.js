'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngResource',
  'leaflet-directive'
]).
config(['$routeProvider', function($routeProvider , RestangularProvider) {
  $routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: 'MapController'});
  $routeProvider.otherwise({redirectTo: '/map'});
}]);
