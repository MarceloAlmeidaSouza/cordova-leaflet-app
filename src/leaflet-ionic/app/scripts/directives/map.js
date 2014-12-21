'use strict';

angular.module('LeafletIonic.directives')

.directive('map', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/directives/map.html',
    controller: 'MapCtrl',
    require: ['^mapView', '^map'],
    link: function(scope, element, attrs, controllers) {
      controllers[0].init( controllers[1].init(element[0]) );
    }
  }
});
