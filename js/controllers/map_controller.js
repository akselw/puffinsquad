var myApp = angular.module('myApp.controllers');

// Disables Angular debug
myApp.config(function($logProvider){
  $logProvider.debugEnabled(false);
});

myApp.controller('MapController', ['$scope', '$http', '$compile', '$filter', '$timeout', 'OrgunitsGeoService', 'OrgunitService', function ($scope, $http, $compile, $filter, $timeout, OrgunitsGeoService, OrgunitService) {
  // Setting headers
  $http.defaults.headers.common['Authorization'] = 'Basic YWRtaW46ZGlzdHJpY3Q=';

  /* Variable declarations */
  $scope.geojson = new Array();
  $scope.markers = new Array();
  $scope.orgUnits = new Array();
  $scope.orgs = new Array(); // using orgs to fetch more information than just geodata.

  $scope.orgUnitsJSON = new Array();
  $scope.editedOrgUnit = null;

  $scope.markersAdded = false;
  $scope.subPage='searchtab';
  $scope.edited = null;

  $scope.pages = {searchtab: 'partials/search-tab.html',
		  neworgtab: 'partials/new-org-tab.html',
		  editorgtab: 'partials/edit-org-tab.html',
		  savedtab: 'partials/saved.html'};


  $scope.location = {lat: 0.602118, lng: 30.160217};

  $scope.current_pos = {
    lat: $scope.location.lat,
    lng: $scope.location.lng
  };

  $scope.center = {
    lat: 0.577400,
    lng: 30.201073,
    zoom: 4
  };



  /*  GUI code  */

  $scope.showEditPage = function(orgUnit) {
    $scope.user=orgUnit;
    $scope.subPage = 'editorgtab';
  };

  $scope.selectNewOrg = function () {
    $('#search-tab').removeClass("active");
    $('#new-tab').addClass("active");
    $('#new-tab-link').html('New');
    $scope.initNewOrgUnit();
    $scope.subPage = 'neworgtab';
  };

  $scope.selectSearch = function () {
    $('#new-tab').removeClass("active");
    $('#search-tab').addClass("active");
    $('#new-tab-link').html('New');
    $scope.subPage = 'searchtab';
  };

  $scope.selectEditOrg = function (orgUnitId) {
    $('#search-tab').removeClass("active");
    $('#new-tab').addClass("active");
    $('#new-tab-link').html('Edit');
    $scope.getOrgUnit(orgUnitId);
    $scope.subPage = 'editorgtab';
  };

  $scope.cancelEdit = function() {
    $scope.user = null;
    $scope.popMarker();
    $scope.selectSearch();
  };

  $scope.pushNewOrgUnit = function(id) {
    var url = dhisAPI + 'api/organisationUnits/' + id;
    $http.get(url).success(function(data) {
      console.log(data);
      $scope.popMarker();
      $scope.markers.push($scope.createMarker(data));
    });
  };

  $scope.httpSuccess = function(data) {
    console.log(data);
    response = data.importCount;
    console.log(response);
    if (response['imported'] == 1 || response['updated'] == 1) {
      $scope.subPage = 'savedtab';
      $scope.pushNewOrgUnit(data.lastImported);
      $timeout($scope.cancelEdit, 1500);
    }
  };

  $scope.initNewOrgUnit = function() {
    if (!$scope.user || $scope.subPage == 'editorgtab') {
      $scope.user = {
      	name: "",
      	shortName: "",
      	openingDate: "",
      	parent: {code : "OU_255005"},
      	featureType: "Point",
      	active: true,
      };
    }
  }

  $scope.submitNew = function(user) {
    $scope.master = angular.copy(user);
    $scope.master.coordinates = JSON.stringify($scope.master.coordinates);
    var url= dhisAPI + 'api/organisationUnits';
    $http.post(url, $scope.master).success(function(data) {
    }).success($scope.httpSuccess);
  };

  $scope.saveOrgUnit = function(orgUnit) {
    orgUnit.coordinates = JSON.stringify(orgUnit.coordinates);
    var data = orgUnit;
    var url = orgUnit.href;
    $http.put(url, data).success(function(data) {
      console.log(data);
    });
    $scope.user = null;
  };

  $scope.getOrgUnit = function(userId) {
    var url = dhisAPI + 'api/organisationUnits/' + userId;

    $http.get(url).success(function(data) {
      console.log(data);
      data.coordinates = angular.fromJson(data.coordinates);

      console.log(data.coordinates);
      $scope.showEditPage(data);

    }).error(function (data) {
      console.log("Error");
      $scope.showEditErrorPage();
    });
  };

  $scope.createMarker = function(orgUnit) {
    coordinates = JSON.parse(orgUnit.coordinates);
    return {
      lat: coordinates[1],
      lng: coordinates[0],
      type: 'marker',
      id: orgUnit.id,
      message: $scope.markerMessageJSON(orgUnit),
      getMessageScope: function () {
	       return $scope;
      },
    }
  };


  $scope.markerMessageJSON = function(orgUnit) {
    var actions = "";
    actions += '<button ng-click="selectEditOrg(\''
      + orgUnit.id
      +'\')" type="submit" class="btn btn-block btn-default">Edit</button>';
    var message = '<h4>' + orgUnit.name + '</h4>'  + '<br>' + actions;
    return message;
  };



  /* Map code */


  $scope.geojson.data = OrgunitsGeoService.get({ level: 2 }, function (data) {
    console.log('Hello');
    $scope.geojson.style = {
      fillColor: 'green',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: 3,
      fillOpacity: 0.8
    };
  }, function (error) {
    console.log(error);
  });

  OrgunitsGeoService.get({ level: 4 }, function (data) {
    var features = data.features;
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
  });


  /*  Added and renewed service for getting organisation-data */
  OrgunitService.get(function (data) {
    console.log(name);
    var test = "";
    var orgsdata = data.organisationUnits;

    orgsdata.forEach(function (entry) {
      var name = entry.name;
      var id = entry.id;

      $scope.orgs.push({

        orgname: name,
        orgid: id,

      });
    });
  });


  $(document).ready(function () {
    $(document).on('mouseenter', '.divbutton', function () {
      $(this).find(":button").show();
    }).on('mouseleave', '.divbutton', function () {
      $(this).find(":button").hide();
    });
  });


  $scope.addMarkers = function () {
    $scope.markers.push({
      lat: $scope.location.lat,
      lng: $scope.location.lng,
      message: "My Added Marker " + $scope.orgunits[0].name,
      type: 'marker'
    });
  };


  $scope.showOnMap = function () {
    console.log("Finding current position with GeoLocation . . . ");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  };


  $scope.showPosition = function (position) {
    $scope.center = {
      lng: position.coords.longitude,
      lat: position.coords.latitude,
      zoom: 10,
    };
  };

    $scope.new_marker_msg = ' \
    <p class="lead"> \
  	 Drag this marker to the location on the map where you want to add your organization unit. \
    </p> \
    <div class="row text-center"> \
      <button type="button" ng-click="selectNewOrg()" class="btn btn-success btn-lg">Create new orgunit</button> \
    </div> \
  ';

  $scope.popMarker = function() {
    if ($scope.markersAdded) {
      $scope.markers.pop()
      $scope.markersAdded = false;
    }
  };

  $scope.updateUserLocation = function() {
    if (!$scope.user || $scope.subPage == 'editorgtab') {
      $scope.selectNewOrg();
    };
    $scope.user.coordinates = [$scope.location.lng, $scope.location.lat];
  };

  $scope.$on('leafletDirectiveGeoJson.click', function (e, a) {
    console.log('Hello geo');
    console.log(a);
  });

  $scope.$on('leafletDirectiveMap.click', function (e, a) {
    var leafEvent = a.leafletEvent;

    // $scope.location.lng = leafEvent.latlng.lng;
    // $scope.location.lat = leafEvent.latlng.lat;
    // $scope.popMarker();
    $scope.markersAdded = true;

    // Remove the existing movable markers
    $scope.excludeMarkersOfType('movable_marker');

    // Then we add a new one at the current location
    $scope.markers.push({
      lat: $scope.location.lat = a.leafletEvent.latlng.lat,
      lng: $scope.location.lng = a.leafletEvent.latlng.lng,
      message: $scope.new_marker_msg,
      type: 'movable_marker',
      getMessageScope: function () {
        return $scope;
      },
      draggable: true
    });
    $scope.selectNewOrg();
    $scope.updateUserLocation();
  });

  $scope.excludeMarkersOfType = function (type) {
    var t = $scope.markers.filter(function (element, index, array) {
      return element.type !== type;
    });

    angular.extend($scope, {
      markers: t
    });
  }

  $scope.$on('leafletDirectiveMarker.dragend', function (e, a) {
    $scope.location.lat = a.leafletEvent.target._latlng.lat;
    $scope.location.lng = a.leafletEvent.target._latlng.lng;
  });

  $scope.removeMarkers = function () {
    $scope.markers = new Array();
  }

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



  $scope.showError = function(error) {
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
  };

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
    actions += '<button ng-click="selectEditOrg(\'' + entry.id +'\')" type="submit" class="btn btn-block btn-default">Edit</button>';
    var message = '<h4>' + entry.properties.name + '</h4>'  + '<br>' + actions;
    return message;
  };





  /* Leaflet code */

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

  $scope.showMap = function(org) {

    var coordinates = [];
    var lat;
    var lng;

    lat = $scope.getLocationLt(org);
    lng = $scope.getLocationLg(org); //= getLocationLg(org, $scope.markers);

    $scope.center = {

      lng: lng,
      lat: lat,
      zoom: 12,
    };
    $scope.findMarkerForUnit(org.orgid);

  };

  $scope.findMarkerForUnit = function (orgunitId) {
    $scope.markers.forEach(function (entry) {
      if (orgunitId === entry.id) {
        console.log("Found it!");
        console.log(entry);
      }
    })
  }

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
