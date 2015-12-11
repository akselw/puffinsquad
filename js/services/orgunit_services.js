'use strict';

/* It has become considered better practise to separate services into
 different files. Not like it's done here. See angular-seed for an example
 of how it's done (this is based on angular-seed one year ago.
 */

/* Services */

var myAppServices = angular.module('myApp.services', ['ngResource']);


myAppServices.factory("OrganisationUnits", function ($resource, $http) {
  return $resource(
    dhisAPI + 'organisationUnits/:id.json',
    {
      
    },
    {

    }
  );
});
