'use strict';

angular.module('LeafletIonic.services')

.value('setup', {
  layers: {
    bases: [
      {
        name: 'Mapbox',
        type: 'L.TileLayer',
        url: 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',
        options: {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
          id: 'examples.map-i875mjb7'
        },
        use: true
      },
      {
        name: 'Topo2',
        type: 'L.TileLayer',
        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}',
        options: {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="http://statkart.no" title="The National Mapping Authority of Norway">Kartverket</a>',
          id: 'statkart.no-topo2'
        },
        use: false
      },
      {
        name: 'Kartdata2',
        type: 'L.TileLayer',
        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=kartdata2&zoom={z}&x={x}&y={y}',
        options: {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="http://statkart.no" title="The National Mapping Authority of Norway">Kartverket</a>',
          id: 'statkart.no-kartdata2'
        },
        use: false
      },
      {
        name: 'Grunnkart',
        type: 'L.TileLayer',
        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
        options: {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="http://statkart.no" title="The National Mapping Authority of Norway">Kartverket</a>',
          id: 'statkart.no-norges_grunnkart'
        },
        use: false
      }
   ],
   overlays: [
   ]
  }
});
