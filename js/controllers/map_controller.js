var myApp = angular.module('myApp.controllers');

myApp.controller('MapController', ['$scope', '$http', '$compile', '$filter', function ($scope, $http, $compile, $filter) {

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

    $(document).ready(function () {
                $(document).on('mouseenter', '.divbutton', function () {
                    $(this).find(":button").show();
                }).on('mouseleave', '.divbutton', function () {
                    $(this).find(":button").hide();
                });
            });

      $scope.markers = new Array();
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


      console.log(t);

      angular.extend($scope, {
        markers: t
      });

      var marker = {
        lat: $scope.location.lat,
        lng: $scope.location.lng,
        focus: true,
<<<<<<< HEAD:js/controllers/map_controller.js
        // message: '<draggable-marker-content></draggable-marker-content>',
=======
        message: '<draggable-marker-content></draggable-marker-content>',
        type: 'movable_marker',
>>>>>>> 7a2a66ba6aa9d4e566eb5f0b334c00353b7cdb37:example/js/controllers/map_controller.js
        getMessageScope: function () {
          return $scope;
        },
        draggable: true
<<<<<<< HEAD:js/controllers/map_controller.js
      });
	$scope.selectNewOrg();
=======
      };

      $scope.markers.push(marker);

      marker.popupOpen();
>>>>>>> 7a2a66ba6aa9d4e566eb5f0b334c00353b7cdb37:example/js/controllers/map_controller.js
    });

    $scope.$on('leafletDirectiveMarker.dragend', function (e, a) {
      console.log(a.leafletEvent.target._latlng.lat);
      $scope.current_pos.lat = a.leafletEvent.target._latlng.lat;
      $scope.current_pos.lng = a.leafletEvent.target._latlng.lng;
    });

    $scope.removeMarkers = function () {
	$scope.markers = new Array();
	
    }

<<<<<<< HEAD:js/controllers/map_controller.js
    // $scope.markers.push({
    //   lat: $scope.location.lat,
    //   lng: $scope.location.lng,
    //   focus: true,
    //   message: '<draggable-marker-content></draggable-marker-content>',
    //   getMessageScope: function () {
    //     return $scope;
    //   },
    //   draggable: true
    // });
=======
    $scope.markers.push({
      lat: $scope.location.lat,
      lng: $scope.location.lng,
      focus: true,
      type: 'movable_marker',
      message: '<draggable-marker-content></draggable-marker-content>',
      getMessageScope: function () {
        return $scope;
      },
      draggable: true
    });
>>>>>>> 7a2a66ba6aa9d4e566eb5f0b334c00353b7cdb37:example/js/controllers/map_controller.js

    $scope.initGeojson = function () {
      $http.get('https://play.dhis2.org/demo/api/organisationUnits.geojson?level=2').success(function (data) {
        angular.extend($scope, {
          geojson: {
            data: data,
            style: {
              fillColor: 'green',
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: 3,
              fillOpacity: 0.8
            }
          }
        });

        console.log($scope.geojson);

      }).error(function (data) {
        console.log('ERROR');
        console.log(data);
      });
    }

    $scope.initGeojson();

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
<<<<<<< HEAD:js/controllers/map_controller.js
        
        
        if ($scope.orgunit.access.update) 
            actions += '<button ng-click="selectEditOrg()" type="submit" class="btn btn-block btn-default">Edit</button>';
        
        if ($scope.orgunit.access.delete) 
          actions += '<button type="button" class="btn btn-block btn-danger">Delete</button>';   
        

	var message = '<h4>' + $scope.orgunit.name + '</h4><dl class="dl-horizontal"><dt style="width: auto;">Opened:</dt><dd style="margin-left: 60px;">' + 
                  $scope.orgunit.openingDate + '</dd><dt style="width: auto;">Groups:</dt><dd style="margin-left: 60px;">' + groups + '</dd></dl><br>' + 
            dataSets + '<br>' + programs + '<br>' + actions;
=======


        if ($scope.orgunit.access.update)
          actions += '<button type="button" class="btn btn-block btn-default">Edit</button>';

        if ($scope.orgunit.access.delete)
          actions += '<button type="button" class="btn btn-block btn-danger">Delete</button>';

>>>>>>> 7a2a66ba6aa9d4e566eb5f0b334c00353b7cdb37:example/js/controllers/map_controller.js


        $scope.markers.push({
          lng: coords[0],
          lat: coords[1],
<<<<<<< HEAD:js/controllers/map_controller.js
            message: message,
            getMessageScope: function() {return $scope; },
=======
          type: 'marker',
          message: '<h4>' + $scope.orgunit.name + '</h4><dl class="dl-horizontal"><dt style="width: auto;">Opened:</dt><dd style="margin-left: 60px;">' +
                  $scope.orgunit.openingDate + '</dd><dt style="width: auto;">Groups:</dt><dd style="margin-left: 60px;">' + groups + '</dd></dl><br>' +
                  dataSets + '<br>' + programs + '<br>' + actions
>>>>>>> 7a2a66ba6aa9d4e566eb5f0b334c00353b7cdb37:example/js/controllers/map_controller.js
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
<<<<<<< HEAD:js/controllers/map_controller.js

        console.log(unit.id);
=======
>>>>>>> 7a2a66ba6aa9d4e566eb5f0b334c00353b7cdb37:example/js/controllers/map_controller.js

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
<<<<<<< HEAD:js/controllers/map_controller.js
=======
              type: 'marker',
>>>>>>> 7a2a66ba6aa9d4e566eb5f0b334c00353b7cdb37:example/js/controllers/map_controller.js
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

<<<<<<< HEAD

      $scope.$on('$viewContentLoaded', function () {
	  // selectSearch();

=======
      
<<<<<<< HEAD:js/controllers/map_controller.js
    /*($scope.moreInfo() = {
=======
      $scope.$on('$viewContentLoaded', function () {
	  // selectSearch();
	  
>>>>>>> 06f4b7dd7bb23453acfcc83e0d221d6b56ddb888
	  document.getElementById('new-link').onclick = function () {
	      selectNewOrg();
	  };

	  document.getElementById('search-link').onclick = function () {
	      var html = selectSearch();
	      $compile( document.getElementById('panel-body') )($scope);
<<<<<<< HEAD

=======
	      
>>>>>>> 06f4b7dd7bb23453acfcc83e0d221d6b56ddb888
	      // $('#panel-body').html();
	  };
      });
>>>>>>> 7a2a66ba6aa9d4e566eb5f0b334c00353b7cdb37:example/js/controllers/map_controller.js

    } // TODO:

    */

    

    

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
