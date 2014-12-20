'use strict';

angular.module('LeafletIonic.controllers')

.controller('LayersCtrl', function() {
  this.init = function(map, layers) {
    angular.forEach(layers, function(layer) {
        L.tileLayer(layer.url, layer.options).addTo(map.leaflet)
    });
  };
});
