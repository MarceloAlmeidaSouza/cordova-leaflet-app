'use strict';

angular.module('LeafletIonic.directives')

.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      layers: '='
    },
    replace: true,
    transclude: true,
    templateUrl: 'templates/directives/map.html',
    controller: 'MapCtrl',
    link: function(scope, element, attrs, controller) {
      controller.init( element[0] );
    }
  }
});
