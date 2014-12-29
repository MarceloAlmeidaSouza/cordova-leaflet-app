'use strict';

angular.module('LeafletIonic.services')

.factory('storage', ['$window', '$q', function (window, q) {

  return {

    get: function() {

      // Initialize
      var path = arguments[0], callback, params = {}, deferred = q.defer();

      // Parse arguments
      angular.forEach([].splice.call(arguments,1), function(argument) {
        if(typeof argument === 'function' )
          callback = argument;
        else
          params = argument;
      });

      if(callback)
        deferred.promise.then(callback);

      // Already available?
      if(window.localStorage['features']) {
        deferred.resolve(JSON.parse(window.localStorage['features']));
      } else {
        deferred.resolve();
      }
    },
    set: function(path, data) {

      if(typeof data === 'object' )
        data = JSON.stringify(data);
      else
        data = String(argument);

      window.localStorage['features'] = data;

    }
  }
}]);

