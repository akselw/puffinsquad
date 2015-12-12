angular.module('myApp.services', ['ngResource']).factory('OrganisationUnitLevels', function ($resource)) {
  return $resource(
    dhisAPI + 'api/organisationUnitLevels.json', //?paging=false', // organisationUnits.json?paging=false
    {
      
    },
    {

    }
  );
}
