'use strict';

angular.module('LeafletIonic.controllers')

.controller('EditableCtrl', ['$rootScope', function(dispatch) {

  var editable = this;

  // ---------------------------------------
  //  Define Editable Controller API
  // ---------------------------------------

  this.init = function(map) {

    map.leaflet.whenReady(function () {
      this.editTools = new L.Editable(this, this.options.editOptions);
    });

    LeafletIonic.Editable.edit(dispatch)
      .add(LeafletIonic.Editable.Marker)
      .add(LeafletIonic.Editable.Polyline)
      .add(LeafletIonic.Editable.Polygon)
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
  },
  /* Edit control */
  Edit: L.Control.extend({
    options: {
      position: 'topright'
    },
    controls: [],
    editable: this,
    initialize: function(dispatch, options) {
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
      editable.edit = edit;
      // Contains all feature controls
      var features = L.DomUtil.create('div', 'leaflet-bar', container);
      angular.forEach(editable.controls, function(control) {
          control.ui = control.onAdd(features, map);
      });
      // Show feature controls on click
      L.DomEvent.on(edit.button, 'click', L.DomEvent.stop).on(edit.button, 'click', function () {
        editable.show();
        dispatch.$broadcast('editable:begin');
        dispatch.$apply();
      });
      // Listen for editable events
      dispatch.$on('editable:cancel', function() {
        editable.hide();
      });
      dispatch.$on('editable:finish', function() {
        editable.hide();
      });
      return container;
    },
    add: function(control) {
      this.controls.push(control);
      return this;
    },
    show: function() {
      LeafletIonic.Editable.Dom.Css.replace(this.edit.button, 'ng-show', 'ng-hide');
      angular.forEach(this.controls, function(control) {
        LeafletIonic.Editable.Dom.Css.replace(control.ui, 'ng-hide', 'ng-show');
      });
    },
    hide: function() {
      LeafletIonic.Editable.Dom.Css.replace(this.edit.button, 'ng-hide', 'ng-show');
      angular.forEach(this.controls, function(control) {
        LeafletIonic.Editable.Dom.Css.replace(control.ui, 'ng-show', 'ng-hide');
      });
    }
  }),
  edit: function (dispatch, options) {
    options = options || {};
    return new LeafletIonic.Editable.Edit(dispatch, options);
  },
  /* Marker control */
  Marker: {
    onAdd: function (container, map) {
      var button = LeafletIonic.Editable.Dom.button(container, 'Add a new marker', 'map-icon-marker');
      L.DomEvent.on(button, 'click', L.DomEvent.stop).on(button, 'click', function () {
        map.editTools.startMarker();
      });
      return button;
    }
  },
  /* Polyline control */
  Polyline: {
    onAdd: function (container, map) {
      var button = LeafletIonic.Editable.Dom.button(container, 'Add a new line','map-icon-polyline');
      L.DomEvent.on(button, 'click', L.DomEvent.stop).on(button, 'click', function () {
        map.editTools.startPolyline();
      });
      return button;
    }
  },
  /* Polygon control */
  Polygon: {
    onAdd: function (container, map) {
      var button = LeafletIonic.Editable.Dom.button(container, 'Add a new area','map-icon-polygon');
      L.DomEvent.on(button, 'click', L.DomEvent.stop).on(button, 'click', function () {
        map.editTools.startPolygon();
      });
      return button;
    }
  },
  /* Delete control */
  Delete: {
    onAdd: function (container, map) {
      var button = LeafletIonic.Editable.Dom.button(container, 'Delete features on click','map-icon-trash');
      L.DomEvent.on(link, 'click', L.DomEvent.stop).on(link, 'click', function () {
        console.log('Delete');
      });
      return button;
    }
  }
};
