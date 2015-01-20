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
      var featuresLayer = new L.GeoJSON;

      // Add GeoJSON support
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
    button: function(container, title, icon) {
      var link = L.DomUtil.create('a', '', container);
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
    var container = L.DomUtil.create('div', 'leaflet-control ng-show');
    // Contains edit control
    var edit = L.DomUtil.create('div', 'leaflet-bar', container);
    edit.button = LeafletIonic.Editable.Dom.button(edit, 'Edit map features', 'map-icon-edit');
    editable.ui = {edit: edit};
    // Contains all feature controls
    var features = L.DomUtil.create('div', 'leaflet-bar ng-hide', container);
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
        map.editTools.featuresLayer.removeLayer(feature);
      });
      if(typeof editable.active.cancel === 'function')
        editable.active.cancel();
    });
    dispatch.on('editable:finish', function() {
      editable.hide();
      editable.changes = [];
      if(typeof editable.active.finish === 'function')
        editable.active.finish();

      // Store features
      var features = map.editTools.featuresLayer.toGeoJSON();
      editable.storage.set('features', features);

    });
    return container;
  },
  onCommit: function(feature) {
    this.changes.push(feature);
  },
  add: function(control) {
    this.controls.push(control);
    return this;
  },
  show: function() {
    LeafletIonic.Editable.Dom.Css.replace(this.ui.edit, 'ng-show', 'ng-hide');
    LeafletIonic.Editable.Dom.Css.replace(this.ui.features, 'ng-hide', 'ng-show');
  },
  hide: function() {
    LeafletIonic.Editable.Dom.Css.replace(this.ui.edit, 'ng-hide', 'ng-show');
    LeafletIonic.Editable.Dom.Css.replace(this.ui.features, 'ng-show', 'ng-hide');
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
        base.finish();
      } else {
        base.begin(editable, map);
      }
    });
    return button;
  },
  begin: function(editable, map) {
    var response;
    if(response = (editable.active !== this)) {
      this.map = map;
      this.editable = editable;
      if(typeof editable.active.finish === 'function')
        editable.active.finish();
      editable.active = this;
      if(this.options.stateless === false)
        LeafletIonic.Editable.Dom.Css.add(this.ui, 'leaflet-active');
      response = this.onBegin();
    }
    return response;
  },
  cancel: function() {
    var response;
    if(response = (this.editable.active === this)) {
      this.editable.active = {};
      if(this.options.stateless === false)
        LeafletIonic.Editable.Dom.Css.remove(this.ui, 'leaflet-active');
      response = this.onCancel();
      delete this.map;
      delete this.editable;
    }
    return response;
  },
  finish: function() {
    var response;
    if(response = (this.editable.active === this)) {
      this.editable.active = {};
      if(this.options.stateless === false)
        LeafletIonic.Editable.Dom.Css.remove(this.ui, 'leaflet-active');
      response = this.onFinish();
      delete this.map;
      delete this.editable;
    }
    return response;
  },
  onBegin: function() {
    /* Override */
  },
  onCancel: function() {
    /* Override */
  },
  onFinish: function() {
    /* Override */
  }
});

/* Feature control */
LeafletIonic.Editable.Feature = LeafletIonic.Editable.Base.extend({
  initialize: function(type, title, icon, direct) {
    this.type = type;
    this.direct =  direct || false;
    LeafletIonic.Editable.Base.prototype.initialize.call(this, title, icon);
  },
  onBegin: function() {
    this.enable();
    return this.feature;
  },
  onHook: function(e) {
    if(typeof this.feature === 'undefined') {
      this.feature = this.onStart(e.latlng);
      console.log("onHook");
      if(this.direct) {
        this.onCommit();
      }
    }
  },
  onStart: function(latlng) {
    /* Override this */
  },
  onVertex: function(e) {
    /* Override this */
  },
  onCommit: function() {
    var response;
    if(response = (typeof this.feature !== 'undefined')) {
      this.map.editTools.stopDrawing();
      this.editable.onCommit(this.feature);
      delete this.feature;
      console.log("onCommit");
    }
    return response;
  },
  onFinish: function() {
    var response = this.onCommit();
    this.disable();
    return response;
  },
  onCancel: function() {
    var response;
    if(response = (typeof this.feature !== 'undefined')) {
      this.map.editTools.stopDrawing();
      this.map.editTools.featuresLayer.removeLayer(this.feature);
      delete this.feature;
    }
    this.disable();
    return response;
  },
  enable: function() {
    var control = this;
    this.listen('click');
    this.map.on('editable:drawing:commit', this.onCommit, this);
    this.map.on('editable:vertex:mousedown', this.onVertex, this);
    this.map.editTools.featuresLayer.eachLayer(function(feature, layer) {
      if(feature.constructor === control.type)
        feature.enableEdit();
    });
  },
  disable: function() {
    var control = this;
    this.map.off(this.hook, this.onHook, this);
    this.map.off('editable:drawing:commit', this.onCommit, this);
    this.map.off('editable:vertex:mousedown', this.onVertex, this);
    this.map.editTools.featuresLayer.eachLayer(function(feature, layer) {
      if(feature.constructor === control.type)
        feature.disableEdit();
    });
    delete this.hook;
  },
  listen: function(hook) {
    if(this.hook !== hook) {
      if(this.hook)
        this.map.off(this.hook, this.onHook, this);
      this.hook = hook;
      this.map.on(hook, this.onHook, this);
    }
  }
});

/* Marker control */
LeafletIonic.Editable.Marker = LeafletIonic.Editable.Feature.extend({
  initialize: function () {
    LeafletIonic.Editable.Feature.prototype.initialize.call(
      this, L.Marker, 'Add a new marker', 'map-icon-marker', true);
  },
  onStart: function(latlng) {
    return this.map.editTools.startMarker(latlng);
  }
});

/* Polyline control */
LeafletIonic.Editable.Polyline = LeafletIonic.Editable.Feature.extend({
  initialize: function () {
    LeafletIonic.Editable.Feature.prototype.initialize.call(
      this, L.Polyline, 'Add a new line','map-icon-polyline');
  },
  onStart: function(latlng) {
    //console.log(latlng);
    return this.map.editTools.startPolyline(latlng);
  },
  onVertex: function(e) {
    if(typeof this.feature === 'undefined') {
      var index = e.vertex.getIndex();
      if (index === 0) {
        e.layer.editor.continueBackward();
        this.feature = e.layer;
        L.DomEvent.stop(e);
        console.log("continueBackward");
        // Consume default behavior
        e.layer.editor.consume = (e.layer.editor.drawing === L.Editable.FORWARD);
      }
      else if (index === e.vertex.getLastIndex()) {
        e.layer.editor.continueForward();
        this.feature = e.layer;
        L.DomEvent.stop(e);
        console.log("continueForward");
        // Consume default behavior
        e.layer.editor.consume = (e.layer.editor.drawing === L.Editable.BACKWARD);
      }
    }
  }
});

/* Polyline Editor */
LeafletIonic.Editable.Polyline.Editor = L.Editable.PolylineEditor.extend({
  consume: false,
  commitDrawing: function() {
    if(this.consume) {
      this.consume = false;
    } else {
      L.Editable.PolylineEditor.prototype.commitDrawing.call(this);
    }
  },
  vertexCanBeDeleted: function () {
      return false;
  }
});

/* Polygon control */
LeafletIonic.Editable.Polygon = LeafletIonic.Editable.Feature.extend({
  initialize: function () {
    LeafletIonic.Editable.Feature.prototype.initialize.call(this, L.Polygon, 'Add a new line','map-icon-polygon');
  },
  onStart: function(latlng) {
    //console.log(latlng);
    return this.map.editTools.startPolygon();
  }
});

/* Polygon Editor */
LeafletIonic.Editable.Polygon.Editor = L.Editable.PolygonEditor.extend({
  vertexCanBeDeleted: function () {
      return false;
  }
});

/* Delete control */
LeafletIonic.Editable.Delete = LeafletIonic.Editable.Base.extend({
  initialize: function () {
    LeafletIonic.Editable.Base.prototype.initialize.call(this, 'Delete features','map-icon-trash');
  },
  onBegin: function() {
    var control = this;
    this.map.editTools.featuresLayer.eachLayer(function(feature) {
      feature.on('click', control.onDelete, control);
    });
    return true;
  },
  onDelete: function(e) {
    this.map.editTools.featuresLayer.removeLayer(e.target);
  },
  onFinish: function() {
    var control = this;
    this.map.editTools.featuresLayer.eachLayer(function(feature) {
      feature.off('click', control.onDelete, control);
    });
    delete this.map;
  },
  onCancel: function() {
    this.onFinish();
  }

});

/* Set static properties */
L.Map.mergeOptions({
    polylineEditorClass: LeafletIonic.Editable.Polyline.Editor,
    polygonEditorClass: LeafletIonic.Editable.Polygon.Editor

});

