'use strict';

angular.module('LeafletIonic.directives')

.directive('layers', ['setup', function(setup) {
  return {
    restrict: 'A',
    controller: 'LayersCtrl',
    require: ['^layers', '^map'],
    link: function(scope, element, attrs, controllers) {
      controllers[0].init(controllers[1], setup.layers.bases, setup.layers.overlays);
    }
  }
}]);
