'use strict';

angular.module('LeafletIonic.controllers')

.controller('MapCtrl', ['$scope', '$q', 'geocode', function(scope, q, geocode) {

  var map = this;
  var deferred = q.defer();

  // Initialize
  map.markers = {};

  // ---------------------------------------
  //  Define Map Controller API
  // ---------------------------------------

  // Initialize Leaflet instance
  map.init = function(element) {
    map.leaflet = L.map(element);
    deferred.resolve(map.leaflet);
    return map;
  };

  // Search and center on given location.
  map.search = function(query) {
    if(query) {
      geocode.search(query).then(function(results) {
        scope.search.results = results;
        if(results.length === 1) {
          map.panTo(results[0].location, true);
        }
        else
          map.mark(false);
      });
    } else {
      map.mark(false);
      scope.search.results = [];
    }
  };

  // Pan map to given location.
  map.panTo = function(location, mark) {
    map.mark(mark ? location : false);
    map.leaflet.setView(location, 14, false);
    return map;
   };

  // Show, move or hide location marker
  map.mark = function(location) {
    if(typeof map.markers.location !== 'undefined')
      map.leaflet.removeLayer(map.markers.location);
    if (location) {
      if(typeof map.markers.location === 'undefined')
        map.markers.location = L.marker(location).addTo(map.leaflet);
      else {
        map.markers.location.setLatLng(location);
        map.markers.location.addTo(map.leaflet);
      }
    }
  };

  // ---------------------------------------
  //  Define watches
  // ---------------------------------------

  scope.$watch('deviceready', function() {

    // TODO: Init use of Cordova plugins here.

    deferred.promise.then(function(leaflet) {
      map.leaflet.locate({setView : true, maxZoom: 18});
    });

  });



}]);
