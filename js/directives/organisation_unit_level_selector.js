'use strict';

angular.module('myApp.directives', []).
  directive('organisationUnitLevelSelector', function() {
	return {
	  restrict: 'E',
	  templateUrl: 'js/directives/templates/organisation_unit_level_selector.html'
	}
  });
