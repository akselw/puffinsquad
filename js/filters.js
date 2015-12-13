'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).
  filter('filterMovableMarkes', function () {
    return function (marker) {
      if ('name' in marker)
        if (marker['name'] !== 'movable_marker')
          return marker;
      return null;
    };
  });
