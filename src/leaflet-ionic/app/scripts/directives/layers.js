'use strict';

angular.module('LeafletIonic.directives')

.directive('layers', function() {
  return {
    restrict: 'A',
    scope: false,
    controller: 'LayersCtrl',
    require: ['^layers', '^map'],
    link: function(scope, element, attrs, controllers) {
      // Map instance is created in parent (map) directive link function. Because this directive
      // is defined as transclude, functions in layer (child) directives are executed first.
      controllers[1].getMap().then(function(map, attrs) {
        controllers[0].init(map, attrs);
      });
    }
  }
});
