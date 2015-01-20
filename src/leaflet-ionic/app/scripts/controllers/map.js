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
    map.leaflet = L.map(element, {
      doubleClickZoom: false
    });
    deferred.resolve(map.leaflet);
    return map;
  };

  // Search and center on given location.
  map.search = function(query) {
    var location;
    query = query.trim();
    if(location = LeafletIonic.Srs.parse(query)) {
      map.panTo(location, true);
    }
    else if(query) {
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

/* Define Utility classes
 *
 * Converted regex for verifying common coordinate systems from
 *  - https://gist.github.com/cgudea/7c558138cb48b36e785b
 * to javascript using https://www.regex101.com/
 *
 */
LeafletIonic.Srs = {
  Decimal: {
    REGEX: /^-?(180((\.0{0,})?)|([1]?[0-7]?\d(\.\d{0,})?))$/,
    is: function(data) {
      return LeafletIonic.Srs.match(this.REGEX, data, 2, function(matches) {
        return L.latLng(matches[0][0], matches[1][0]);
      });
    }
  },
  Utm: {
    REGEX: /^(\d{1,2})(\/|\:| |)([^aboiyzABOIYZ\d\[-\` -@])(\/|\:| |)(\d{2,})$/,
    is: function(data) {
      return LeafletIonic.Srs.match(this.REGEX, data, 1, function(coords) {
        return coords;
      });
    }
  },
  Mgrs: {
    REGEX: /^\d{1,2}[^ABIOYZabioyz][A-Za-z]{2}([0-9][0-9])+$/,
    is: function(data) {
      return LeafletIonic.Srs.match(this.REGEX, data);
    }
  },
  parse: function(data) {
    var location;
    if(location = this.Decimal.is(data)) {
      return location;
    }
    if(location = this.Utm.is(data)) {
      return location;
    }
    if(location = this.Mgrs.is(data)) {
      return location;
    }
    return false;
  },
  match: function(r, data, length, translate) {
    var matches = [];
    angular.forEach(data.trim().split(/\s|,/), function(str) {
      var m;
      if((m = r.exec(str)) != null) {
        matches.push(m);
      }
    });
    return (matches.length === length ? translate(matches) : false);
  }
};
