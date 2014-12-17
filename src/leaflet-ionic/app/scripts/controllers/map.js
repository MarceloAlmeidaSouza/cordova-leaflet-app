'use strict';

angular.module('LeafletIonic.controllers')

.controller('MapCtrl', ['$scope', '$q', function($scope, $q) {

  angular.extend($scope, {
    layers: {
      mapbox: {
        url: 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',
        options: {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
              '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
              'Imagery © <a href="http://mapbox.com">Mapbox</a>',
          id: 'examples.map-i875mjb7'
        }
      }
    }
  });

  var _map = $q.defer();

  this.getMap = function() {
    return _map.promise;
  };

  this.init = function(element) {

      // Create leaflet instance
      var map = L.map(element);

      new L.Control.GeoSearch({
          provider: new L.GeoSearch.Provider.Google()
      }).addTo(map);

      // Deliver promise to child directives
      _map.resolve(map);

      /*
      // Initialise the FeatureGroup to store editable layers
      var drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      var drawControl = new L.Control.Draw({
        draw: {
          position: 'topleft',
          polygon: {
            title: 'Draw a sexy polygon!',
            allowIntersection: false,
            drawError: {
              color: '#b00b00',
              timeout: 1000
            },
            shapeOptions: {
              color: '#bada55'
            },
            showArea: true
          },
          polyline: {
            metric: false
          },
          circle: {
            shapeOptions: {
              color: '#662d91'
            }
          }
        },
        edit: {
          featureGroup: drawnItems
        }
      });
      map.addControl(drawControl);

      map.on('draw:created', function (e) {
        var type = e.layerType,
          layer = e.layer;

        if (type === 'marker') {
          layer.bindPopup('A popup!');
        }

        drawnItems.addLayer(layer);
      });

      app.map.on('locationfound', onLocationFound);
      app.map.on('locationerror', onLocationError);
      app.map.locate({setView: true, maxZoom: 16});    $scop


      */
  };

  $scope.$watch('deviceready', function() {

    // TODO: Init use of Cordova plugins here.

    _map.promise.then(function(map) {
      map.locate({setView : true, maxZoom: 18});
    });

  });



  /*
  $scope.centerOnMe = function () {
    console.log('Centering');
    if (!$scope.map) {
      return;
    }

    $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    /*
    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  */

}]);
