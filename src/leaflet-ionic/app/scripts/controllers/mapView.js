'use strict';

angular.module('LeafletIonic.controllers')

.controller('MapViewCtrl', ['$scope', function(scope) {

  var view = this;

  // ---------------------------------------
  //  Define MapView Model API
  // ---------------------------------------

  // Search and pan to given location.
  scope.search = function() {
    view.map.search(scope.search.query);
  };
  scope.search.results = [];

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
