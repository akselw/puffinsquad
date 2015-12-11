var myApp = angular.module('myApp.controllers');

myApp.controller('MapController', ['$scope', '$http', '$compile', '$filter', '$timeout', 'OrgunitsGeoService', 'OrgunitService', function ($scope, $http, $compile, $filter, $timeout, OrgunitsGeoService, OrgunitService) {
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

  $http.defaults.headers.common['Authorization'] = 'Basic YWRtaW46ZGlzdHJpY3Q=';
  $http.defaults.headers.common['Content-Type'] = 'application/json';

  $scope.geojson = new Array();
  $scope.markers = new Array();

  $scope.orgUnits = new Array();

  
  $scope.orgUnitsJSON = new Array();

  $scope.editedOrgUnit = null;

  $scope.initNewOrgUnit = function() {
    $scope.user = {
      name: "",
      shortName: "",
      openingDate: "",
      parent: {code : "OU_255005"},
      featureType: "POINT",
    };
  }

  
  $scope.updateUserLocation = function() {
    if (!$scope.user) {
      $scope.selectNewOrg();
    };
    $scope.user.coordinates = [$scope.location.lng, $scope.location.lat];
  };


  
  $scope.saveEditedOrgUnit = function(orgUnit) {

    orgUnit.coordinates = JSON.stringify(orgUnit.coordinates);
    console.log(JSON.stringify(orgUnit));

    var data = orgUnit;
    
    var url = orgUnit.href;
    
    $http.put(url, data).success(function(data) {
      console.log(data);
    });
    $scope.user = null;
  };

  $scope.cancelEdit = function() {
    console.log("Cancel");
    $scope.user = null;
    $scope.selectSearch();
  };

  $scope.pushNewOrgUnit = function(id) { 
    var url = 'https://play.dhis2.org/demo/api/organisationUnits' + '/' + id;
    
    $http.get(url).success(function(data) {
      console.log(data);
    });
  };

  $scope.httpSuccess = function(data) {
    console.log(data);
    response = data.response.importCount;
    console.log(response);
    if (response['imported'] == 1 || response['updated'] == 1) {
      $scope.subPage = 'savedtab';
      $timeout($scope.cancelEdit, 1500);
    }
  };
  

  $scope.submitNew = function(user) {
    $scope.master = angular.copy(user);

    $scope.master.coordinates = JSON.stringify($scope.master.coordinates);

    var url= 'https://play.dhis2.org/demo/api/organisationUnits';
    
    $http.post(url, $scope.master).success(function(data) {
    }).success($scope.httpSuccess);
  };

  $scope.showEditPage = function(orgUnit) {
    $scope.user=orgUnit;
    $scope.subPage = 'editorgtab';
  };

  $scope.getOrgUnit = function(userId) {
    var url = 'https://play.dhis2.org/demo/api/organisationUnits' + '/' + userId;
    var config = {headers: {'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q='}};
    
    $http.get(url, config).success(function(data) {
      console.log(data);
      data.coordinates = JSON.parse(data.coordinates);
      
      console.log(data.coordinates);
      $scope.showEditPage(data);
      // $scope.orgUnitsJSON[userId] = data;
      // console.log($scope.orgUnitsJSON[userId]);
      
    }).error(function (data) {
      console.log("Error");
      $scope.showEditErrorPage();
    });
  };

  $scope.update = function(user) {
    $scope.master = angular.copy(user);

    $scope.master = {openingDate:"2014-11-25",
		     shortName:"Airport Centre",
		     coordinates: "-13,542022705078125, 8,773796283776631",
		     name:"Air Port Centre, Lungis",};
    
    var config = {headers:
		  {'Authorization': 'Basic KGFkbWluOmRpc3RyaWN0KQ=='}};
    $http.post('https://play.dhis2.org/demo/api/organisationUnits', $scope.master, config ).success(function
							      (data) {
								console.log(data);
								//see the length of data - if data has some value, it means dhis2
								// redirect page, then login has failed
								//otherwise login success proceed with your api calls....
							      }).error(function (data) {
								console.log("Error");
							      });
    console.log($scope.master);
  };

  $scope.callServer = function () {
    console.log("Call server");
    var credentials =  $.param({username: 'admin', password:
				'district'});
    var obj = {name: 'Benkia MCHP',
	       
    }
    var config = {headers:
		  {'Authorization': 'Basic KGFkbWluOmRpc3RyaWN0KQ=='}};
    $http.get('https://play.dhis2.org/demo/api/organisationUnits.json', config).success(function
							      (data) {
								console.log(data);
								//see the length of data - if data has some value, it means dhis2
								// redirect page, then login has failed
								//otherwise login success proceed with your api calls....
							      }).error(function (data) {
								console.log("Error");
							      });
    
    console.log("Call server end");
  };

  $scope.geojson.data = OrgunitsGeoService.get({ level: 2 }, function (data) {
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
    
    actions += '<button ng-click="selectEditOrg(\'' + entry.properties.code +'\')" type="submit" class="btn btn-block btn-default">Edit</button>';
    
    var message = '<h4>' + entry.properties.name + '</h4>'  + '<br>' + actions;
    
    return message;
  }


  OrgunitsGeoService.get({ level: 4 }, function (data) {
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

  // console.log();
  // 		    });
  // });

  OrgunitService.get({ id: 'qjboFI0irVu' }, function (data) {
    console.log('Hei');
    console.log(data);
  });



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
    $scope.initNewOrgUnit();
    $scope.subPage = 'neworgtab';
  };

  $scope.selectSearch = function () {
    $('#new-tab').removeClass("active");
    $('#search-tab').addClass("active");
    $('#new-tab-link').html('New');
    $scope.subPage = 'searchtab';
  };

  $scope.selectEditOrg = function (orgUnitCode) {
				     
    // $scope.edited = $scope.orgunit;
    // console.log($scope.edited.name);
    $('#search-tab').removeClass("active");
    $('#new-tab').addClass("active");
    $('#new-tab-link').html('Edit');
    // console.log($scope.orgUnits[orgUnitCode]);
    $scope.editedOrgUnit = $scope.orgUnits[orgUnitCode];

    
    // console.log("orgUnit returned");
    $scope.getOrgUnit($scope.editedOrgUnit.id);
    
    // // console.log($scope.editedOrgUnit);
    // // console.log($scope.editedOrgUnit.properties);
    // // console.log($scope.editedOrgUnit.properties.name);

    // $scope.user = {name : $scope.editedOrgUnit.properties.name,
    // 		   long : $scope.editedOrgUnit.geometry.coordinates[1],
    // 		   lat : $scope.editedOrgUnit.geometry.coordinates[0],
    // 		   code: $scope.editedOrgUnit.id};
    
    // // console.log($scope.editedOrgUnit);
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
  });

  $scope.$on('leafletDirectiveMap.click', function (e, a) {
    var leafEvent = a.leafletEvent;

    $scope.location.lng = leafEvent.latlng.lng;
    $scope.location.lat = leafEvent.latlng.lat;
    if ($scope.markersAdded) {
      $scope.markers.pop();
    }
    $scope.markersAdded = true;


    var t = $scope.markers.filter(function (element, index, array) {
      return element.type !== 'movable_marker';
    });

    angular.extend($scope, {
      markers: t
    });

    var marker = {
      lat: $scope.location.lat,
      lng: $scope.location.lng,
      message: '<draggable-marker-content></draggable-marker-content>',
      type: 'movable_marker',
      getMessageScope: function () {
        return $scope;
      },
      draggable: true
    };

    $scope.updateUserLocation();

    $scope.markers.push(marker);

    // marker.popupOpen();
  });

  $scope.$on('leafletDirectiveMarker.dragend', function (e, a) {
    console.log(a.leafletEvent.target._latlng.lat);
    $scope.current_pos.lat = a.leafletEvent.target._latlng.lat;
    $scope.current_pos.lng = a.leafletEvent.target._latlng.lng;
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

  $http.get('js/json/orgunits/qjboFI0irVu.json').success(function (data) {
    $scope.orgunit = data;
    $scope.init();
  });

  $http.get('js/json/orgunits.json').success(function (data) {
    $scope.orgunits = data;
  });


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
		   editorgtab: 'partials/edit-org-tab.html',
		   savedtab: 'partials/saved.html',};

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

  $scope.showMap = function() {

    $scope.markers.push({
      lat: $scope.location.lat,
      lng: $scope.location.lng,
      //message: "My Added Marker " + $scope.orgunits[0].name
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
