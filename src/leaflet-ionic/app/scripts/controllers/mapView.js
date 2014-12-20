'use strict';

angular.module('LeafletIonic.controllers')

.controller('MapViewCtrl', ['$scope', function(scope) {

  // ---------------------------------------
  //  Define MapView Controller API
  // ---------------------------------------

  // Initialize Leaflet instance
  this.init = function(map) {

    // ---------------------------------------
    //  Define MapView Scope API
    // ---------------------------------------

    // Search and pan to given location.
    scope.search = function() {

      // Delegate to Map Scope API
      map.search(scope.search.query);

    };

    // Reset input fields
    scope.reset = function(type) {
      angular.element(document.querySelector('input[type="'+type+'"]')).val('');

      if(type === 'search')
        map.mark(false);


    };


  };

}]);
