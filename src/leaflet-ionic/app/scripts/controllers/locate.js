'use strict';

angular.module('LeafletIonic.controllers')

.controller('LocateCtrl', function() {
  this.init = function(map) {
    var control = L.control.locate().addTo(map.leaflet);
  };
});
