'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('draggableMarkerContent', function() {
	return {
	  restrict: 'E',
	  templateUrl: 'js/directives/templates/draggable_marker_content.html'	
	}
  });
