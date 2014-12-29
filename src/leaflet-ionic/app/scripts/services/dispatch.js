'use strict';

angular.module('LeafletIonic.services')

.factory('dispatch', ['$rootScope', function (rootScope) {

  return {
    broadcast: function(name, data) {
      data = data || {}
      rootScope.$broadcast(name, data);
    },
    on: function(name, listener, scope) {
      var unbind = rootScope.$on(name, listener);
      if(scope)
        scope.$on('$destroy', unbind);
    },
    apply: function() {
      rootScope.$apply();
    }
  }
}]);

