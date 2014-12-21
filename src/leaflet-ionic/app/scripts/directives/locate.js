'use strict';

angular.module('LeafletIonic.directives')

.directive('locate', function(setup) {
  return {
    restrict: 'A',
    controller: 'LocateCtrl',
    require: ['^locate', '^map'],
    link: function(scope, element, attrs, controllers) {
      controllers[0].init(controllers[1]);
    }
  }
});
