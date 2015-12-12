'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

// angular.module('myApp.directives', []).
//   directive('dateTime', function(dateTime) {
//     return {
//       require: 'ngModel',
//       link: function(scope, element, attrs, ngModelController) {
// 	ngModelController.$parsers.push(function(data) {
//           //convert data from view format to model format
//           return data; //converted
// 	});

// 	ngModelController.$formatters.push(function(data) {
//           //convert data from model format to view format
//           return data; //converted
// 	});
//       }
//     };
//   });
