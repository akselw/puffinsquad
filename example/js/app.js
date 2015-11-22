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
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.when('/view4', {templateUrl: 'partials/partial4.html', controller: 'MyCtrl4'});
  $routeProvider.when('/view3', {templateUrl: 'partials/partial3.html', controller: 'MapController'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
