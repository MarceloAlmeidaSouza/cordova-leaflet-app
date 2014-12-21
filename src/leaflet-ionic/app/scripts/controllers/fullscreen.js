'use strict';

angular.module('LeafletIonic.controllers')

.controller('FullscreenCtrl', function() {
  this.init = function(map) {
    var control = L.control.fullscreen().addTo(map.leaflet);
  };
});
