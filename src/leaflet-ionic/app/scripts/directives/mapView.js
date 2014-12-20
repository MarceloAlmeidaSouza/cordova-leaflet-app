'use strict';

angular.module('LeafletIonic.directives')

.directive('mapView', function() {
  return {
    restrict: 'E',
    scope: {},
    replace: true,
    templateUrl: 'templates/directives/mapView.html',
    controller: 'MapViewCtrl'
  }
});
