'use strict';

angular.module('LeafletIonic.controllers')

.controller('LayersCtrl', function($scope) {

  var layers = [];

  this.init = function(map) {

      angular.forEach($scope.layers, function(layer) {

        layers.push(
          L.tileLayer(layer.url, layer.options).addTo(map)
        );

      });

      return;

  };

});
