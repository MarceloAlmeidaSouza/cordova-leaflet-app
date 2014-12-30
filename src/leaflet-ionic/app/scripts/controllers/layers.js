'use strict';

angular.module('LeafletIonic.controllers')

.controller('LayersCtrl', function() {
  var controller = this;
  this.init = function(map, bases, overlays) {
    var baseMaps = {};
    var overlayMaps = {};

    // Add layers
    angular.forEach(bases, function(layer) {
      baseMaps[layer.name] = controller.create(layer);
      if(layer.use)
        baseMaps[layer.name].addTo(map.leaflet);
    });
    angular.forEach(overlays, function(layer) {
      controller.add(map.leaflet, layer);
    });
    // Add layers control
    L.control.layers(baseMaps, overlayMaps, {position: 'bottomleft'}).addTo(map.leaflet);

  };

  this.create = function(layer) {
    if(layer.type === 'L.TileLayer')
      return L.tileLayer(layer.url, layer.options);
  };

});
