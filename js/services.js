'use strict';

/* It has become considered better practise to separate services into
 different files. Not like it's done here. See angular-seed for an example
 of how it's done (this is based on angular-seed one year ago.
 */

/* Services */

var myAppServices = angular.module('myApp.services', ['ngResource']);

myAppServices.factory("MeService", function ($resource) {
    return $resource(
        'play.dhis2.org/demo/api/me',
        {
            // If you're passing variables, for example into the URL
            // they would be here and then as :varName in the URL
        },
        {
            // If you want to implement special functions, you'd
            // put them here.
        }
    );
});

myAppServices.factory("ProfileService", function ($resource) {
    return $resource(
            dhisAPI+'/api/me/profile',
        {
            // If you're passing variables, for example into the URL
            // they would be here and then as :varName in the URL
        },
        {
            // If you want to implement special functions, you'd
            // put them here.
        }
    );
});

myAppServices.factory('OrgunitsGeoService', function ($resource) {
  var level = 1;

  return {
    byLevel: function (level) {
      return $resource(
        'https://play.dhis2.org/demo/api/organisationUnits.geojson?level=:level',
        {
          level: level
        },
        {
          
        }
      )
    }
  }


/***

<<<<<<< HEAD
  return {
    byLevel: function (level) {
      return $resource(
        'https://play.dhis2.org/demo/api/organisationUnits.geojson?level=:level',
        {
          level: level
        },
        { }
      );
=======
  return $resource(
    '/js/json/geo.json',
   // dhisAPI + 'api/organisationUnits.geojson?level=:level',
    {
      level: level
>>>>>>> 798333773ba5a27d1dd81b14e8487a9d1f53eb7a
    },
    withParent: function (parent, levels) {
      var levels = '';

      for (var i = 0; i < levels.length; i++) {
        levels += 'level=' + levels[i];

        if (i+1 < levels.length)
          levels += '&';
      }

      var ending = levels += '&parent=' + parent;

      return $resource(
        'https://play.dhis2.org/demo/api/organisationUnits.geojson?' + ending,
        {

        },
        {

        }
      );
    }
  };


**/
});

myAppServices.factory("OrgunitService", function ($resource, $http) {
  var unitId = '';
  return $resource(
    dhisAPI + 'organisationUnits/:id.json',
    {
      id: unitId
    },
    { }
  );
});



myAppServices.factory("UserSettingService", function ($resource) {
    return $resource(
            dhisAPI+'/api/userSettings/exampleapp.usersetting',
        {
            // If you're passing variables, for example into the URL
            // they would be here and then as :varName in the URL
        },
        {
            // If you want to implement special functions, you'd
            // put them here. In this case, the content type cannot be
            // JSON, so we need to change it to text/plain
            save: {
                method:'POST',
                isArray:false,
                headers: {'Content-Type': 'text/plain'}}
        }
    );
});
