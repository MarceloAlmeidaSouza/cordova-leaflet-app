'use strict';

angular.module('LeafletIonic.directives', [])

.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    replace: true,
    transclude: true,
    templateUrl: 'templates/directives/map.html',
    link: function ($scope, $element, $attr) {

      var map = L.map($element[0]);

      L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
              '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
              'Imagery © <a href="http://mapbox.com">Mapbox</a>',
          id: 'examples.map-i875mjb7'
        }).addTo(map);

      new L.Control.GeoSearch({
          provider: new L.GeoSearch.Provider.Google()
        }).addTo(map);

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

      /*
          app.map.on('locationfound', onLocationFound);
          app.map.on('locationerror', onLocationError);

          app.map.locate({setView: true, maxZoom: 16});
      */
      $scope.onCreate({map: map});

      /*/ Stop the side bar from dragging when mousedown/tapdown on the map
      google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
        e.preventDefault();
        return false;
      });
      */

    }
  };
});
