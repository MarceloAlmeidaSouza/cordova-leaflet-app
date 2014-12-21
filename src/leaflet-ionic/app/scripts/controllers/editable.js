'use strict';

angular.module('LeafletIonic.controllers')

.controller('EditableCtrl', function() {

  // ---------------------------------------
  //  Define Editable Controller API
  // ---------------------------------------

  this.init = function(map) {

    map.leaflet.whenReady(function () {
      this.editTools = new L.Editable(this);
    });

    L.control.marker().addTo(map.leaflet);
    L.control.polyline().addTo(map.leaflet);
    L.control.polygon().addTo(map.leaflet);
  };

  // ---------------------------------------
  //  Define Leaflet controls
  // ---------------------------------------

  L.MarkerControl = L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
          link = L.DomUtil.create('a', '', container);
      link.href = '#';
      link.title = 'Add a new marker';
      link.innerHTML = '⚫';
      L.DomEvent.on(link, 'click', L.DomEvent.stop).on(link, 'click', function () {
        map.editTools.startMarker();
      });
      return container;
    }
  });
  L.control.marker = function (options) {
    return new L.MarkerControl(options);
  };

  L.PolylineControl = L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
          link = L.DomUtil.create('a', '', container);
      link.href = '#';
      link.title = 'Create a new line';
      link.innerHTML = '/\\/';
      L.DomEvent.on(link, 'click', L.DomEvent.stop)
      .on(link, 'click', function () {
        map.editTools.startPolyline();
      });
      return container;
    }
  });
  L.control.polyline = function (options) {
    return new L.PolylineControl(options);
  };

  L.PolygonControl = L.Control.extend({
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
          link = L.DomUtil.create('a', '', container);
      link.href = '#';
      link.title = 'Create a new polygon';
      link.innerHTML = '▱';
      L.DomEvent.on(link, 'click', L.DomEvent.stop)
      .on(link, 'click', function () {
        map.editTools.startPolygon();
      });
      return container;
    }
  });
  L.control.polygon = function (options) {
    return new L.PolygonControl(options);
  };

});
