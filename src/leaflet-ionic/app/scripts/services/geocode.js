'use strict';

angular.module('LeafletIonic.services')

.factory('geocode', ['$q', function (q) {

  var g = new google.maps.Geocoder();

  return {
    search: function(query) {

      var deferred = q.defer();

      g.geocode({address: query}, function(data) {

        if (!data || data.length == 0)
          return [];

        var results = [];
        for (var i = 0; i < data.length; i++)
          if(data[i].geometry !== undefined && data[i].geometry.location !== undefined) {
            var location = data[i].geometry.location;
            results.push({
              address: data[i].formatted_address,
              location: L.latLng(location.lat(), location.lng())
            });
          }

          deferred.resolve(results);

        });

        return deferred.promise;
    }
  }
}]);
