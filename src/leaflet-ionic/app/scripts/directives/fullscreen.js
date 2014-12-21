'use strict';

angular.module('LeafletIonic.directives')

.directive('fullscreen', function(setup) {
  return {
    restrict: 'A',
    controller: 'FullscreenCtrl',
    require: ['^fullscreen', '^map'],
    link: function(scope, element, attrs, controllers) {
      controllers[0].init(controllers[1]);
    }
  }
});
