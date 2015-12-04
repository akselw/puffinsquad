'use strict';

angular.module('myApp.directives', []).
  directive('orgunitMarkerMsg', function() {
	return {
	  restrict: 'E',
	  templateUrl: 'js/directives/templates/orgunit_marker_msg.html'
	}
  });
