var myApp = angular.module('myApp.controllers');

myApp.controller('MapController', ['$scope', '$http', '$compile', '$filter', '$cacheFactory', 'OrgunitsGeoService', 'OrgunitService', 'basicAuthService',
function ($scope, $http, $compile, $filter, $cacheFactory, OrgunitsGeoService, OrgunitService, basicAuthService) {
  $scope.location = {lat: 0.602118, lng: 30.160217};
  $scope.current_pos = {
    lat: $scope.location.lat,
    lng: $scope.location.lng
  };

  $scope.cache = $cacheFactory('orgunitCache');
  $scope.current_unit = {};

  $scope.center = {
    lat: 0.577400,
    lng: 30.201073,
    zoom: 4
  };

  $scope.authenticate = function () {
    basicAuthService.generateAuthorizationHeader('admin', 'district');
  }

  $scope.testLogin = function () {
    console.log('Hello World');
    var userData = { username: 'admin', password: 'district' };

    var successCB = function (response) {
      console.log('Success! ' + response);
    };

    var errorCB = function (error) {
      console.log('Error :(  ');
      console.log(error);
    }

    // basicAuthService.generateAuthorizationHeader('admin', 'district');
    basicAuthService.login('https://play.dhis2.org/', userData, successCB, errorCB);

    OrgunitsGeoService.get({ level: 4 }, function (data) {
      var features = data.features;

      features.forEach(function (entry) {
        var geometry = entry.geometry;

        $scope.current_unit = $scope.isCached(entry.id) ? $scope.getOrgunit(entry.id) : OrgunitService.get({ id: entry.id }, function (data) {
          console.log('GET');
        });

        if (geometry.type === 'Point')
          $scope.markers.push({
            lat: geometry.coordinates[1],
            lng: geometry.coordinates[0],
            type: 'marker',
            id: entry.id,
            message: '<orgunitMarkerMsg></orgunitMarkerMsg>'
          });
      });
    });
  }

  $scope.geojson = {};
  $scope.markers = new Array();

  $scope.orgUnits = new Array();

  $scope.geojson.data = OrgunitsGeoService.byLevel(2).get(function (data) {
    console.log('Loaded geojson data GET');
    console.log(data);

    $scope.geojson.style = {
      fillColor: 'green',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: 3,
      fillOpacity: 0.8
    };


    console.log($scope.geojson);
  });

    $scope.markerMessage = function(entry) {
      // 	var groups = '';
      // var dataSets = '<h5>Data sets</h5><ul>';
      // var programs = '<h5>Programs</h5><ul>';

      // for (var i = 0; i < $scope.orgunit.organisationUnitGroups.length; i++) {
      //   groups += $scope.orgunit.organisationUnitGroups[i].name;

      //   if (i+1 < $scope.orgunit.organisationUnitGroups.length) {
      //     groups += ', ';
      //   }
      // }

      // for (var i = 0; i < $scope.orgunit.dataSets.length; i++) {
      //   dataSets += '<li>' + $scope.orgunit.dataSets[i].name + '</li>';
      // }

      // for (var i = 0; i < $scope.orgunit.programs.length; i++) {
      //   programs += '<li>' + $scope.orgunit.programs[i].name + '</li>';
      // }

      // dataSets += '</ul>';
      // programs += '</ul>';



      // var actions = '';


      // if ($scope.orgunit.access.update)
      // actions += '<button ng-click="selectEditOrg()" type="submit" class="btn btn-block btn-default">Edit</button>';

      // if ($scope.orgunit.access.delete)
      // actions += '<button type="button" class="btn btn-block btn-danger">Delete</button>';


      // var message = '<h4>' + entry.properties.name + '</h4><dl class="dl-horizontal"><dt style="width: auto;">Opened:</dt><dd style="margin-left: 60px;">' +
      // $scope.orgunit.openingDate + '</dd><dt style="width: auto;">Groups:</dt><dd style="margin-left: 60px;">' + groups + '</dd></dl><br>' +
      // 	  dataSets + '<br>' + programs + '<br>' + actions;

	var actions = "";

    actions += '<button ng-click="selectEditOrg()" type="submit" class="btn btn-block btn-default">Edit</button>';

	var message = '<h4>' + entry.properties.name + '</h4>'  + '<br>' + actions;

	return message;
    }


  OrgunitsGeoService.byLevel(2, function (data) {
    var features = data.features;
    console.log(features);
    features.forEach(function (entry) {
      var geometry = entry.geometry;


	    if (geometry.type === 'Point')
        $scope.markers.push({
          lat: geometry.coordinates[1],
          lng: geometry.coordinates[0],
          type: 'marker',
            id: entry.id,

	    message: $scope.markerMessage(entry),
	    getMessageScope: function () {
		return $scope;
	    },
        });

        $scope.orgUnits[entry.properties.code] = entry;

    });
      console.log( $scope.orgUnits["ke2gwHKHP3z"]);
  });

  $scope.isCached = function (key) {
    return $scope.cache.get(key);
  }

  $scope.getOrgunit = function (id) {
    return $scope.cache.get(id);
  }


  $(document).ready(function () {
    $(document).on('mouseenter', '.divbutton', function () {
      $(this).find(":button").show();
    }).on('mouseleave', '.divbutton', function () {
      $(this).find(":button").hide();
    });
  });
  $scope.markersAdded = false;
  $scope.subPage='searchtab';
  $scope.edited = null;

  $scope.addMarkers = function () {
    $scope.markers.push({
      lat: $scope.location.lat,
      lng: $scope.location.lng,
      message: "My Added Marker " + $scope.orgunits[0].name,
      type: 'marker'
    });
  };

  $scope.selectNewOrg = function () {
    $('#search-tab').removeClass("active");
    $('#new-tab').addClass("active");
    $('#new-tab-link').html('New');
    $scope.subPage = 'neworgtab';
  };

  $scope.selectSearch = function () {
    $('#new-tab').removeClass("active");
    $('#search-tab').addClass("active");
    $('#new-tab-link').html('New');
    $scope.subPage = 'searchtab';
  };

  $scope.selectEditOrg = function () {
    $scope.edited = $scope.orgunit;
    console.log($scope.edited.name);
    $('#search-tab').removeClass("active");
    $('#new-tab').addClass("active");
    $('#new-tab-link').html('Edit');
    $scope.subPage = 'editorgtab';
  };

  $scope.showOnMap = function () {

    console.log("Finding current position with GeoLocation . . . ");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition($scope.showPosition, showError);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  };

  $scope.showPosition = function (position) {

    console.log("Finding current position on map . . . ");

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);

    $scope.center = {

      lng: longitude,
      lat: latitude,
      zoom: 10,
    };

  }

  $scope.$on('leafletDirectiveGeoJson.click', function (e, a) {
    console.log('Hello geo');
    console.log(a);

    console.log(a.model.id);
  });

  $scope.excludeMarkersOfType = function (type) {
    var new_markers = $scope.markers.filter(function (element, index, array) {
      return element.type !== type;
    });

    angular.extend($scope, {
      markers: new_markers
    });
  };

  $scope.$on('leafletDirectiveMap.click', function (e, a) {
    var leafEvent = a.leafletEvent;

    $scope.location.lng = leafEvent.latlng.lng;
    $scope.location.lat = leafEvent.latlng.lat;

    $scope.excludeMarkersOfType('movable_marker');

    var marker = {
      lat: $scope.location.lat,
      lng: $scope.location.lng,
      focus: true,
      message: '<draggable-marker-content></draggable-marker-content>',
      type: 'movable_marker',
      getMessageScope: function () {
        return $scope;
      },
      draggable: true
    };
    $scope.selectNewOrg();

    $scope.markers.push(marker);
  });

  $scope.$on('leafletDirectiveMarker.dragend', function (e, a) {
    $scope.location.lat = a.leafletEvent.target._latlng.lat;
    $scope.location.lng = a.leafletEvent.target._latlng.lng;
  });

  $scope.$on('leafletDirectiveMarker.click', function (e, a) {

  });

  $scope.removeMarkers = function () {
    $scope.markers = new Array();
  }

  $scope.sign_in = function () {
    var encoded = window.btoa('admin:district');

    $http.defaults.headers.common.Authorization = 'Basic ' + encoded;

    $http.post();
  }



  $scope.init = function () {

    if ($scope.orgunit.featureType === 'POINT') {
      var coords = $.parseJSON($scope.orgunit.coordinates);
      var groups = '';
      var dataSets = '<h5>Data sets</h5><ul>';
      var programs = '<h5>Programs</h5><ul>';

      for (var i = 0; i < $scope.orgunit.organisationUnitGroups.length; i++) {
        groups += $scope.orgunit.organisationUnitGroups[i].name;

        if (i+1 < $scope.orgunit.organisationUnitGroups.length) {
          groups += ', ';
        }
      }

      for (var i = 0; i < $scope.orgunit.dataSets.length; i++) {
        dataSets += '<li>' + $scope.orgunit.dataSets[i].name + '</li>';
      }

      for (var i = 0; i < $scope.orgunit.programs.length; i++) {
        programs += '<li>' + $scope.orgunit.programs[i].name + '</li>';
      }

      dataSets += '</ul>';
      programs += '</ul>';



      var actions = '';


      if ($scope.orgunit.access.update)
      actions += '<button ng-click="selectEditOrg()" type="submit" class="btn btn-block btn-default">Edit</button>';

      if ($scope.orgunit.access.delete)
      actions += '<button type="button" class="btn btn-block btn-danger">Delete</button>';


      var message = '<h4>' + $scope.orgunit.name + '</h4><dl class="dl-horizontal"><dt style="width: auto;">Opened:</dt><dd style="margin-left: 60px;">' +
      $scope.orgunit.openingDate + '</dd><dt style="width: auto;">Groups:</dt><dd style="margin-left: 60px;">' + groups + '</dd></dl><br>' +
      dataSets + '<br>' + programs + '<br>' + actions;


      $scope.markers.push({
        lng: coords[0],
        lat: coords[1],
        message: message,
        getMessageScope: function() {return $scope; },
        type: 'marker',
      });

      $scope.center = {
        lng: coords[0],
        lat: coords[1],
        zoom: 10
      };
    }
  };
  /*

  $http.get('js/json/orgunits/qjboFI0irVu.json').success(function (data) {
    $scope.orgunit = data;
    $scope.init();
  });

  $http.get('js/json/orgunits.json').success(function (data) {
    $scope.orgunits = data;
  });
*/

  $scope.markerExistsAtPoint = function (lat, lng) {
    for (var i = 0; i < $scope.markers.length; i++) {
      var marker = $scope.markers[i];

      if (marker.lng == lng && marker.lat == lat)
      return true;
    }
    return false;
  };

  $scope.findOrgunitAndRelocate = function (unitId) {
    console.log("Heklllo");
    $http.get('js/json/orgunits/' + unitId + '.json').success(function (data) {
      var unit = data;
      var coords = $.parseJSON(unit.coordinates);

      console.log(unit.id);

      if (unit.featureType === 'MULTI_POLYGON' || unit.featureType === 'POLYGON') {
        $scope.geojson = {
          data: {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": unit.featureType === 'POLYGON' ? 'Polygon' : "MultiPolygon",
                  "coordinates": coords
                }
              }
            ]
          },
          style: {
            fillColor: 'green',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: 3,
            fillOpacity: 0.8
          }
        };
      } else if (unit.featureType === 'POINT') {
        if (!$scope.markerExistsAtPoint(coords[0], coords[1])) {
          $scope.markers.push({
            lng: coords[0],
            lat: coords[1],
            type: 'marker',
            message: '<h4>' + $scope.orgunit.name + '</h4><dl class="dl-horizontal"><dt style="width: auto;">Opened:</dt><dd style="margin-left: 60px;">' +
            $scope.orgunit.openingDate + '</dd><dt style="width: auto;">Groups:</dt><dd style="margin-left: 60px;">' + groups + '</dd></dl><br>' +
            dataSets + '<br>' + programs + '<br>' + actions
          });
        }
        $scope.center = {
          lng: coords[0],
          lat: coords[1],
          zoom: 10
        };
      }
    });
  };

  $scope.pages = { searchtab: 'partials/search-tab.html',
  neworgtab: 'partials/new-org-tab.html',
  editorgtab: 'partials/edit-org-tab.html',};

  $scope.removeOsmLayer = function () {
    delete this.layers.baselayers.osm;
    delete this.layers.baselayers.googleTerrain;
    delete this.layers.baselayers.googleRoadmap;
    delete this.layers.baselayers.googleHybrid;
    this.layers.baselayers.cycle = {
      name: 'OpenCycleMap',
      type: 'xyz',
      url: 'http://{s}.title.opencyclemap.org/cycle/{z}/{x}/{y}.png',
      layerOptions: {
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        continuousWorld: true
      }
    };
  };

  $scope.addOsmLayer = function () {
    delete this.layers.baselayers.cycle;
    delete this.layers.baselayers.googleTerrain;
    delete this.layers.baselayers.googleRoadmap;
    delete this.layers.baselayers.googleHybrid;
    this.layers.baselayers.osm = {
      name: 'OpenStreetMap',
      type: 'xyz',
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      layerOptions: {
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        continuousWorld: true
      }
    };
  };

  $scope.showGoogleLayers = function() {
    delete this.layers.baselayers.cycle;
    delete this.layers.baselayers.osm;
    this.layers.baselayers = {
      googleTerrain: {
        name: 'Google Terrain',
        layerType: 'TERRAIN',
        type: 'google'
      },
      googleHybrid: {
        name: 'Google Hybrid',
        layerType: 'HYBRID',
        type: 'google'
      },
      googleRoadmap: {
        name: 'Google Streets',
        layerType: 'ROADMAP',
        type: 'google'
      }
    };
  };

  $scope.showMap = function(organization_data) {

    /*
    TODO: the other way to get out organization data.
    OrgunitService.get({ id: organization_data.id }, function (data) {

    */
      coordinates = getLocation(organization_data, $scope.orgdata);

      var message = '<h4>' + organization_data.name + '</h4><dl class="dl-horizontal"><dt style="width: auto;">Opened:</dt><dd style="margin-left: 60px;">';

      console.log(organization_data.id);

      $scope.markers.push({
        lat: coordinates[0],
        lng: coordinates[1],
        message: message,
        getMessageScope: function() {return $scope; },
        type: 'marker',
      });
    };

  angular.extend($scope, {
    layers: {
      baselayers: {
        osm: {
          name: 'OpenStreetMap',
          type: 'xyz',
          url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          layerOptions: {
            subdomains: ['a', 'b', 'c'],
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            continuousWorld: true
          }
        },
        cycle: {
          name: 'OpenCycleMap',
          type: 'xyz',
          url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
          layerOptions: {
            subdomains: ['a', 'b', 'c'],
            attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            continuousWorld: true
          }
        },
        googleTerrain: {
          name: 'Google Terrain',
          layerType: 'TERRAIN',
          type: 'google'
        },
        googleHybrid: {
          name: 'Google Hybrid',
          layerType: 'HYBRID',
          type: 'google'
        },
        googleRoadmap: {
          name: 'Google Streets',
          layerType: 'ROADMAP',
          type: 'google'
        }
      }
    }
  });
}]);

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
    x.innerHTML = "User denied the request for Geolocation."
    break;
    case error.POSITION_UNAVAILABLE:
    x.innerHTML = "Location information is unavailable."
    break;
    case error.TIMEOUT:
    x.innerHTML = "The request to get user location timed out."
    break;
    case error.UNKNOWN_ERROR:
    x.innerHTML = "An unknown error occurred."
    break;
  }
}

function getLocation(orgname, orgUnits) {

  var coordinates = [];

  angular.forEach(orgdata, function(item) {

    // if one of the organisations in the API equals the organisation id
    if (item.id === orgname.id) {

      coordinates = item.coordinates;

    }

  });

  return  {
  };
}
