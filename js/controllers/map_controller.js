var myApp = angular.module('myApp.controllers');

// Disables Angular debug
myApp.config(function($logProvider){
  $logProvider.debugEnabled(false);
});

myApp.controller('MapController', ['$scope', '$http', '$compile', '$filter', '$timeout', 'OrgunitsGeoService', 'OrganisationUnitLevels', 'OrgunitService', 'OrgunitParentService', function ($scope, $http, $compile, $filter, $timeout, OrgunitsGeoService, OrganisationUnitLevels, OrgunitService, OrgunitParentService) {
  // Setting headers
  $http.defaults.headers.common['Authorization'] = 'Basic YWRtaW46ZGlzdHJpY3Q=';


  /* Variable declarations */
  $scope.geojson = new Array();
  $scope.markers = new Array();
  $scope.orgUnits = new Array();
  $scope.orgs = new Array(); // using orgs to fetch more information than just geodata.
  $scope.parents = new Array();

  $scope.orgUnitsJSON = new Array();
  $scope.editedOrgUnit = null;

  $scope.markersAdded = false;
  $scope.subPage='searchtab';
  $scope.edited = null;

  $scope.pages = {searchtab: 'partials/search-tab.html',
		  neworgtab: 'partials/new-org-tab.html',
		  editorgtab: 'partials/edit-org-tab.html',
		  savedtab: 'partials/saved.html'};

  $scope.organisationUnitLevels = new Array();


  $scope.location = {lng: -13.48297, lat: 8.36369};

  $scope.current_pos = {
    lat: $scope.location.lat,
    lng: $scope.location.lng
  };

  $scope.center = {
    lat: 8.61904,
    lng: -12.63290,
    zoom: 9,
  };

  $scope.level = 0;

  $scope.setLevel = function (level) {
    $scope.level = level;
  }

  $scope.setOrgs = function (level) {
    $('#search').find('.ui.dimmer').addClass('active');

    OrgunitService.get({ level: level }, function (data) {
      data.organisationUnits.forEach(function (entry) {
        $scope.orgs.push({
          orgname: entry.name,
          orgid: entry.id,
          level: level
        });
      });
      $('#search').find('.ui.dimmer').removeClass('active');
    });
  };



  $scope.init = function () {
    $scope.orgs = new Array();
    // Load and sort the organisation unit levels
    OrganisationUnitLevels.get(function (data) {
      data.organisationUnitLevels.forEach(function (entry) {
        OrganisationUnitLevels.get({ id: entry.id}, function (level) {

          $scope.organisationUnitLevels.push({
            id: level.id,
            name: level.displayName,
            level: level.level
          });

          $scope.organisationUnitLevels.sort(function (a, b) {
            if (a.level < b.level)
              return -1;
            if (a.level > b.level)
              return 1;
            else
              return 0;
          });
          $('.ui.dropdown').dropdown();
        });
      });
    }, function (error) {
      console.log(error);
    });
  };

  $scope.init();


  /*  GUI code  */

  $scope.showEditPage = function(orgUnit) {
    $scope.user=orgUnit;
    $scope.user.parent = {code: $scope.user.parent.code};
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

  $scope.removeMarkerById = function(id) {
    for (var i = 0; i < $scope.markers.length; i++)
      if ($scope.markers[i].id && $scope.markers[i].id === id) {
        $scope.markers.splice(i, 1);
        break;
      }
    $(".leaflet-popup-close-button")[0].click();
  };

  $scope.httpSuccess = function(data) {
    console.log(data);
    response = data.importCount;
    console.log(response);
    if (response['imported'] == 1 || response['updated'] == 1) {
      $scope.subPage = 'savedtab';
      $timeout($scope.cancelEdit, 1500);
      if (response['updated'] == 1) {
	$scope.removeMarkerById(data.lastImported);
      }
      $scope.pushNewOrgUnit(data.lastImported);
    }
  };

  $scope.initNewOrgUnit = function() {
    if (!$scope.user || $scope.subPage == 'editorgtab') {
      $scope.user = {
      	name: "",
      	shortName: "",
      	openingDate: "",
      	parent: {code : ""},
      	featureType: "Point",
      	active: true,
      };
    }
  };

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
    $http.put(url, data).success($scope.httpSuccess);
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

  OrgunitParentService.get(function (data) {
    $scope.parents = data.organisationUnits;
    console.log(data);
    console.log($scope.parents);

  });

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

  $scope.addMarkers = function () {
    $scope.markers.push({
      lat: $scope.location.lat,
      lng: $scope.location.lng,
      message: "My Added Marker " + $scope.orgunits[0].name,
      type: 'marker'
    });
  };

  $scope.findMe = function () {
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
    // marker.valueOf()._icon.style.backgroundColor = 'green';

    angular.forEach($scope.markers, function(item) {

      // if positions markeris already set, remove the old marker before setting a new one.
      if (item.id === "currentpos") {
         $scope.markers.pop(item);

      }

    });


    $scope.markers.push({
          lng: position.coords.longitude,
          lat: position.coords.latitude,
          type: 'marker',
          id: 'currentpos',
          message: 'Your are here!'
        });

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

  /* When clicking the map */
  $scope.$on('leafletDirectiveMap.click', function (e, a) {

    var leafEvent = a.leafletEvent;

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



  $scope.getLocation = function(org) {

    var tmp;

    angular.forEach($scope.markers, function(item) {

      // if one of the organisations in the API equals the organisations markers´ id
      if (item.id === org.orgid) {
        $scope.center = {

          lng: item.lng,
          lat: item.lat,
          zoom: 12,
        }
        tmp = item;

        //L.marker(L.latLng(item.lat, item.lng)).popupOpen();

        //tmp.openOn("#main-map");
        //L.marker(item).bindPopup('Hello').openPopup();
        //L.tmp.bindPopup("helooooooooooooo").openPopup();
      /* var circle = L.circle([8, 14], 500, {
	     color: 'red',
	     fillColor: '#f03',
	     fillOpacity: 0.5
	     }).addTo("#main-map"); 
        */
      }
    });
  };

  $scope.markerMessage = function(entry) {
    
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

  $scope.filterMarkers = function(org) {

    $scope.removeMarkers();
    $scope.markers.push({
          lat: org.geometry.coordinates[1],
          lng: org.geometry.coordinates[0],
          type: 'marker',
          id: entry.id,

        message: $scope.markerMessage(entry),
        getMessageScope: function () {
      return $scope;
      },
    });
  };

  $scope.returnGeoFromId = function(org) {
    angular.forEach($scope.markers, function(item) {
      // if one of the organisations in the API equals the organisations markers´ id
      if (item.id === org.orgid) {
        return item;
      }
    });
  };

  $scope.showMap = function(org) {

    var coordinates = $scope.getLocation(org);
  };

  $scope.findMarkerForUnit = function (orgunitId) {
    $scope.markers.forEach(function (entry) {
      if (orgunitId === entry.id) {
        console.log("Found it!");
        console.log(entry);
      }
    });
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

  angular.extend($scope, {
    layers: {
      baselayers: {
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
        },

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
      }
    }
  });
}]);
