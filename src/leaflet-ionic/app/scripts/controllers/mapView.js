'use strict';

angular.module('LeafletIonic.controllers')

.controller('MapViewCtrl', ['$scope', 'dispatch', function(scope, dispatch) {

  var view = this;

  // ---------------------------------------
  //  Define MapView Model API
  // ---------------------------------------

  // Search and pan to given location.
  scope.search = function() {
    view.map.search(scope.search.query);
  };
  scope.search.results = [];

  // Editable map model
  scope.map = {
    editable: false,
    finish: function() {
      scope.map.editable = false;
      dispatch.broadcast('editable:finish');
    },
    cancel: function(e) {
      scope.map.editable = false;
      dispatch.broadcast('editable:cancel');
      e.stopImmediatePropagation();
    }
  };
  scope.$on('editable:begin', function() {
    scope.map.editable = true;
  });

  // Pan to location in search result at given index
  scope.panTo = function(index) {
    scope.search.query = scope.search.results[index].address;
    scope.search();
  };

  // Reset elements of given type
  scope.reset = function(type) {
    angular.element(document.querySelector('input[type="'+type+'"]')).val('');

    if(type === 'search') {
      view.map.mark(false);
      scope.search.results = [];
    }
  };

  // ---------------------------------------
  //  Define MapView Controller API
  // ---------------------------------------

  // Initialize Leaflet instance
  this.init = function(map) {
    view.map = map;
  };

}]);
