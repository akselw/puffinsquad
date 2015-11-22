angular.module('myApp.controllers', []).
  controller('MapController', ['$scope', '$http', function ($scope, $http) {

    $scope.location = {lat: 0.602118, lng: 30.160217};

    $scope.center = {
      lat: 0.577400,
      lng: 30.201073,
      zoom: 4
    };

    $scope.markers = new Array();

    $scope.addMarkers = function () {
      $scope.markers.push({
        lat: $scope.location.lat,
        lng: $scope.location.lng,
        message: "My Added Marker " + $scope.orgunits[0].name
      });

    };

    $scope.$on('leafletDirectiveMap.click', function (e, a) {
      var leafEvent = a.leafletEvent;

      $scope.location.lng = leafEvent.latlng.lng;
      $scope.location.lat = leafEvent.latlng.lat;

      $scope.markers.push({
        lat: leafEvent.latlng.lat,
        lng: leafEvent.latlng.lng,
        message: 'My added marker <show-orgunit unit="test"></show-orgunit>'
      });
    });

    $scope.removeMarkers = function () {
      $scope.markers = new Array();
    }

    $scope.markers.push({
      lat: $scope.location.lat,
      lng: $scope.location.lng,
      focus: true,
      message: '<show-orgunit unit="test"></show-orgunit><br><a href="#" class="btn btn-success" style="color: #fff;">Add org.unit</a>',
      draggable: true
    });

    $scope.initGeojson = function () {
      $http.get('js/json/geo.json').success(function (data) {
        $scope.geojson = data;
        console.log('Hello');

      });
    }

    $scope.init = function () {
      $scope.initGeojson();

      if ($scope.orgunit.featureType === 'POINT') {
        var coords = $.parseJSON($scope.orgunit.coordinates);
        var groups = '<ul>';
        var dataSets = '<h5>Data sets</h5><ul>';
        var programs = '<h5>Programs</h5><ul>';

        for (var i = 0; i < $scope.orgunit.organisationUnitGroups.length; i++) {
          groups += '<li>' + $scope.orgunit.organisationUnitGroups[i].name + '</li>'
        }

        for (var i = 0; i < $scope.orgunit.dataSets.length; i++) {
          dataSets += '<li>' + $scope.orgunit.dataSets[i].name + '</li>';
        }

        for (var i = 0; i < $scope.orgunit.programs.length; i++) {
          programs += '<li>' + $scope.orgunit.programs[i].name + '</li>';
        }

        groups += '</ul>';
        dataSets += '</ul>';
        programs += '</ul>';

        $scope.markers.push({
          lng: coords[0],
          lat: coords[1],
          message: '<h4>' + $scope.orgunit.name + '</h4>' + groups + '<br>' + dataSets + '<br>' + programs,
          scrollable: true
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
      console.log(data);
      $scope.init();
    }).error(function () {
      alert('Error');
    });

    $http.get('js/json/orgunits.json').success(function (data) {
      $scope.orgunits = data;
    });



    $scope.findOrgunitAndRelocate = function (unitId) {
      $http.get('js/json/orgunits/' + unitId + '.json').success(function (data) {
        var unit = data;
        var coords = $.parseJSON(unit.coordinates);

        if (unit.featureType === 'MULTI_POLYGON') {
          $scope.geojson = {
            data: {
              "type": "FeatureCollection",
              "features": [
                {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                    "type": "MultiPolygon",
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
        }
      });
    };

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
    }

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
