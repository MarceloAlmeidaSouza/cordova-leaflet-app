'use strict';

angular.module('LeafletIonic.controllers')

.controller('LocateCtrl', function() {
  this.init = function(map) {
    var control = L.control.locate({
      follow: true,
      icon: 'ion-android-locate',
      locateOptions: {
        enableHighAccuracy: true
      }
    }).addTo(map.leaflet);
    map.leaflet.on('startfollowing', function() {
        map.leaflet.on('dragstart', control._stopFollowing, control);
    }).on('stopfollowing', function() {
        map.leaflet.off('dragstart', control._stopFollowing, control);
    });
  };
});
