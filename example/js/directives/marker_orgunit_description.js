'use strict';

angular.module('myApp.directives', []).
  directive('markerOrgunitDescription', function() {
	return {
	  restrict: 'E',
	  templateUrl: 'js/directives/templates/marker_orgunit_description.html'	
	}
  });