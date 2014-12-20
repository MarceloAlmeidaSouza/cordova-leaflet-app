'use strict';

angular.module('LeafletIonic.services')

.factory('geocode', ['$q', function (q) {

  var g = new google.maps.Geocoder();

  return {
    search: function(query) {

      var deferred = q.defer();

      g.geocode({address: query}, function(data) {

        data = {results: data};

        if (data.results.length == 0)
          return [];

        var results = [];
        for (var i = 0; i < data.results.length; i++)
          if(data.results[i].geometry !== undefined && data.results[i].geometry.location !== undefined) {
            var location = data.results[i].geometry.location;
            results.push({
              address: data.results[i].formatted_address,
              location: L.latLng(location.lat(), location.lng())
            });
          }

          deferred.resolve(results);

        });

        return deferred.promise;
    }
  }
}]);
