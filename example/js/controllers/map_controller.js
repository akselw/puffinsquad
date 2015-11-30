angular.module('myApp.controllers', []).
  controller('MapController', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {

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

      $scope.markers = new Array();
      $scope.subPage='searchtab';

    $scope.addMarkers = function () {
      $scope.markers.push({
        lat: $scope.location.lat,
        lng: $scope.location.lng,
        message: "My Added Marker " + $scope.orgunits[0].name
      });

    };

      $scope.selectNewOrg = function () {
	  $('#search-tab').removeClass("active");
	  $('#new-tab').addClass("active");
	  $scope.subPage = 'neworgtab';
      };

      $scope.selectSearch = function () {
	  $('#new-tab').removeClass("active");
	  $('#search-tab').addClass("active");
	  $scope.subPage = 'searchtab';
      };
      
      $scope.selectNewOrg = function () {
	  $('#search-tab').removeClass("active");
	  $('#new-tab').addClass("active");
	  $scope.subPage = 'editorgtab';
      };

    $scope.$on('leafletDirectiveMap.click', function (e, a) {
      var leafEvent = a.leafletEvent;

      $scope.location.lng = leafEvent.latlng.lng;
      $scope.location.lat = leafEvent.latlng.lat;

      $scope.markers.push({
        lat: $scope.location.lat,
        lng: $scope.location.lng,
        focus: true,
        message: '<draggable-marker-content></draggable-marker-content>',
        getMessageScope: function () {
          return $scope;
        },
        draggable: true
      });
    });
    
    $scope.$on('leafletDirectiveMarker.dragend', function (e, a) {
      console.log(a.leafletEvent.target._latlng.lat);
      $scope.current_pos.lat = a.leafletEvent.target._latlng.lat;
      $scope.current_pos.lng = a.leafletEvent.target._latlng.lng;
    });

    $scope.removeMarkers = function () {
      $scope.markers = new Array();
    }

    $scope.markers.push({
      lat: $scope.location.lat,
      lng: $scope.location.lng,
      focus: true,
      message: '<draggable-marker-content></draggable-marker-content>',
      getMessageScope: function () {
        return $scope;
      },
      draggable: true
    });

    $scope.initGeojson = function () {
      $http.get('js/json/geo.json').success(function (data) {
        $scope.geojson = data;
      });
    }

    $scope.init = function () {
      $scope.initGeojson();

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
          actions += '<button type="button" class="btn btn-block btn-default">Edit</button>';
        
        if ($scope.orgunit.access.delete) 
          actions += '<button type="button" class="btn btn-block btn-danger">Delete</button>';   
        
        

        $scope.markers.push({
          lng: coords[0],
          lat: coords[1],
          message: '<h4>' + $scope.orgunit.name + '</h4><dl class="dl-horizontal"><dt style="width: auto;">Opened:</dt><dd style="margin-left: 60px;">' + 
                  $scope.orgunit.openingDate + '</dd><dt style="width: auto;">Groups:</dt><dd style="margin-left: 60px;">' + groups + '</dd></dl><br>' + 
                  dataSets + '<br>' + programs + '<br>' + actions
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
      $http.get('js/json/orgunits/' + unitId + '.json').success(function (data) {
        var unit = data;
        var coords = $.parseJSON(unit.coordinates);    

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
