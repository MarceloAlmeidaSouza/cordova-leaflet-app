'use strict';

angular.module('LeafletIonic.controllers')

.controller('EditableCtrl', ['dispatch', 'storage', function(dispatch, storage) {

  var editable = this;

  // ---------------------------------------
  //  Define Editable Controller API
  // ---------------------------------------

  this.init = function(map) {

    var features;

    map.leaflet.whenReady(function () {
      /*
      // TODO: Get features from service
      var features = JSON.parse(
      '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[10.164413452148438,59.7302733236073]}}]}');
      var featuresLayer = new L.geoJson(features);
      var featuresLayer = new L.geoJson(features);
      */
      var featuresLayer = new L.GeoJSON;

      // Add for GeoJSON support
      var options = this.options.editOptions || {};
      options.featuresLayer = featuresLayer;
      options.featuresLayer.addTo(this);
      this.editTools = new L.Editable(this, options);

      storage.get('features', function(features) {

        if(features)
          options.featuresLayer.addData(features);

      });


    });


    LeafletIonic.Editable.edit(dispatch, storage)
      .add(new LeafletIonic.Editable.Marker)
      .add(new LeafletIonic.Editable.Polyline)
      .add(new LeafletIonic.Editable.Polygon)
      .add(new LeafletIonic.Editable.Delete)
      .addTo(map.leaflet);
  };


}]);

// Define Editable classes
LeafletIonic.Editable = {
  Dom: {
    /* Add control button to container */
    button: function(container, title, icon, visible) {
      var link = L.DomUtil.create('a', (visible ? 'ng-show' : 'ng-hide'), container);
      link.href = '#';
      link.title = title;
      link.innerHTML = '<i class="map-icon ' + icon + '"></i>';
      return link;
    },
    Css: {
      /* Test if given element has given css class */
      has: function(element, name) {
        return element.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'));
      },
      /* Add given css class to given element */
      add: function(element, name) {
        if (!this.has(element, name))
          element.className += " " + name;
      },
      /* Remove given css class from given element */
      remove: function(element, name) {
        if (this.has(element, name))
          element.className = element.className.replace(new RegExp('(\\s|^)' + name + '(\\s|$)'), ' ');
      },
      /* Replace given css class in given element */
      replace: function(element, from, to) {
        if (this.has(element, from))
          this.remove(element, from);
        if (!this.has(element, from))
          this.add(element, to);
      }
    }
  }
};

/* Edit control */
LeafletIonic.Editable.Edit = L.Control.extend({
  options: {
    position: 'topright'
  },
  initialize: function(dispatch, storage, options) {
    this.active = {};
    this.changes = [];
    this.controls = [];
    this.storage = storage;
    this.dispatch = dispatch;
  },
  onAdd: function (map) {
    var editable = this;
    var dispatch = this.dispatch;
    // Contains all controls
    var container = L.DomUtil.create('div', 'leaflet-control');
    // Contains edit control
    var edit = L.DomUtil.create('div', 'leaflet-bar', container);
    edit.button = LeafletIonic.Editable.Dom.button(edit, 'Edit map features', 'map-icon-edit', true);
    editable.ui = {edit: edit};
    // Contains all feature controls
    var features = L.DomUtil.create('div', 'leaflet-bar', container);
    editable.ui.features = features;
    angular.forEach(editable.controls, function(control) {
        control.ui = control.onAdd(editable, map, dispatch);
    });
    // Show feature controls on click
    L.DomEvent.on(edit.button, 'click', L.DomEvent.stop).on(edit.button, 'click', function () {
      editable.show();
      editable.changes = [];
      dispatch.broadcast('editable:begin');
      dispatch.apply();
    });
    // Listen for editable events
    dispatch.on('editable:cancel', function(e) {
      editable.hide();
      angular.forEach(editable.changes, function(feature) {
        map.removeLayer(feature);
      });
      if(typeof editable.active.cancel === 'function')
        editable.active.cancel(editable);
    });
    dispatch.on('editable:finish', function() {
      editable.hide();
      editable.changes = [];
      if(typeof editable.active.finish === 'function')
        editable.active.finish(editable);

      // Store features
      var features = map.editTools.featuresLayer.toGeoJSON();
      editable.storage.set('features', features);

    });
    return container;
  },
  onFinish: function(feature) {
    this.changes.push(feature);
  },
  add: function(control) {
    this.controls.push(control);
    return this;
  },
  show: function() {
    LeafletIonic.Editable.Dom.Css.replace(this.ui.edit.button, 'ng-show', 'ng-hide');
    angular.forEach(this.controls, function(control) {
      LeafletIonic.Editable.Dom.Css.replace(control.ui, 'ng-hide', 'ng-show');
    });
  },
  hide: function() {
    LeafletIonic.Editable.Dom.Css.replace(this.ui.edit.button, 'ng-hide', 'ng-show');
    angular.forEach(this.controls, function(control) {
      LeafletIonic.Editable.Dom.Css.replace(control.ui, 'ng-show', 'ng-hide');
    });
  }
}),
LeafletIonic.Editable.edit = function (dispatch, storage, options) {
  options = options || {};
  return new LeafletIonic.Editable.Edit(dispatch, storage, options);
};

/* Base control */
LeafletIonic.Editable.Base = L.Class.extend({
  options: {
    stateless: false
  },
  initialize: function(title, icon) {
    this.title = title;
    this.icon = icon;
  },
  onAdd: function (editable, map, dispatch) {
    var base = this;
    var button = LeafletIonic.Editable.Dom.button(editable.ui.features, this.title, this.icon);
    this.ui = button;
    this.dispatch = dispatch;
    L.DomEvent.on(button, 'click', L.DomEvent.stop).on(button, 'click', function (e) {
      if(editable.active === base) {
        base.finish(editable);
      } else {
        base.begin(editable, map);
      }
    });
    return button;
  },
  begin: function(editable, map) {
    var response;
    if(response = (editable.active !== this)) {
      if(typeof editable.active.cancel === 'function')
        editable.active.finish(editable);
      editable.active = this;
      if(this.options.stateless === false)
        LeafletIonic.Editable.Dom.Css.add(this.ui, 'leaflet-active');
      response = this.onBegin(map);
    }
    return response;
  },
  cancel: function(editable) {
    var response;
    if(response = (editable.active === this)) {
      editable.active = {};
      if(this.options.stateless === false)
        LeafletIonic.Editable.Dom.Css.remove(this.ui, 'leaflet-active');
      response = this.onCancel(editable);
    }
    return response;
  },
  finish: function(editable) {
    var response;
    if(response = (editable.active === this)) {
      editable.active = {};
      if(this.options.stateless === false)
        LeafletIonic.Editable.Dom.Css.remove(this.ui, 'leaflet-active');
      response = this.onFinish(editable);
    }
    return response;
  },
  onBegin: function(map) {
    /* Override */
  },
  onCancel: function(editable) {
    /* Override */
  },
  onFinish: function(editable) {
    /* Override */
  }
});

/* Feature control */
LeafletIonic.Editable.Feature = LeafletIonic.Editable.Base.extend({
  initialize: function(title, icon) {
    LeafletIonic.Editable.Base.prototype.initialize.call(this, title, icon);
  },
  onBegin: function(map) {
    return (this.feature = this.onStart(map));
  },
  onCancel: function(editable) {
    var response;
    if(response = (typeof this.feature !== 'undefined')) {
      this.feature.editor.tools.stopDrawing();
      this.feature.editor.map.removeLayer(this.feature);
    }
    return response;
  },
  onFinish: function(editable) {
    var response;
    if(response = (typeof this.feature !== 'undefined')) {
      this.feature.editor.tools.stopDrawing();
      editable.onFinish(this.feature);
    }
    return response;
  }
});

/* Marker control */
LeafletIonic.Editable.Marker = LeafletIonic.Editable.Feature.extend({
  initialize: function () {
    LeafletIonic.Editable.Feature.prototype.initialize.call(this, 'Add a new marker', 'map-icon-marker');
  },
  onStart: function(map) {
    return map.editTools.startMarker();
  }
});

/* Polyline control */
LeafletIonic.Editable.Polyline = LeafletIonic.Editable.Feature.extend({
  initialize: function () {
    LeafletIonic.Editable.Feature.prototype.initialize.call(this, 'Add a new line','map-icon-polyline');
  },
  onStart: function(map) {
    return map.editTools.startPolyline();
  }
});

/* Polygon control */
LeafletIonic.Editable.Polygon = LeafletIonic.Editable.Feature.extend({
  initialize: function () {
    LeafletIonic.Editable.Feature.prototype.initialize.call(this, 'Add a new line','map-icon-polygon');
  },
  onStart: function(map) {
    return map.editTools.startPolygon();
  }
});

/* Delete control */
LeafletIonic.Editable.Delete = LeafletIonic.Editable.Base.extend({
  initialize: function () {
    LeafletIonic.Editable.Base.prototype.initialize.call(this, 'Delete features','map-icon-trash');
  },
  onBegin: function(editable, map) {
    return true;
  }
});

