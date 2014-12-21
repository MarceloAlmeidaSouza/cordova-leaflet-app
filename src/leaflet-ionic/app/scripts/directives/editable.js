'use strict';

angular.module('LeafletIonic.directives')

.directive('editable', function(setup) {
  return {
    restrict: 'A',
    controller: 'EditableCtrl',
    require: ['^editable', '^map'],
    link: function(scope, element, attrs, controllers) {
      controllers[0].init(controllers[1]);
    }
  }
});
