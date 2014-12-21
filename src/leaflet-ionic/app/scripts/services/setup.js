'use strict';

angular.module('LeafletIonic.services')

.value('setup', {
  layers: {
    mapbox: {
      url: 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',
      options: {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-i875mjb7'
      }
    }
  }
});
