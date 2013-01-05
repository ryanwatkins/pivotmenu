/** 
The _rwatkins.PivotMenu_ kind is designed to provide an
enyo.Panels-like control with an Arranger that simualtes the Windows
Phone 8 Pivot Menu control.

Any Enyo control may be placed inside an _rwatkins.PivotMenu_, but by
convention we refer to each of these controls as a "panel." The active
panel is the one in front, and the user can slide left or right to
bring other panels into the viewport.

For more information, see http://www.ryanwatkins.net/software/pivotmenu/
*/

/*
 *
 * Copyright © 2012 Ryan Watkins <ryan@ryanwatkins.net>
 *
 * Permission to use, copy, modify, distribute, and sell this software
 * and its documentation for any purpose is hereby granted without
 * fee, provided that the above copyright notice appear in all copies
 * and that both that copyright notice and this permission notice
 * appear in supporting documentation. No representations are made
 * about the suitability of this software for any purpose. It is
 * provided "as is" without express or implied warranty.
 */

// FIXME: have arranger directly call moveHandler

enyo.kind({
  name: "rwatkins.PivotMenu",
  kind: "Panels",
  classes: "rwatkins-pivotmenu",

  arrangerKind: "rwatkins.PivotMenuArranger",
  wrap: true,
  narrowFit: false,

  published: {
    headerOffset: 0
  },

  handlers: {
    onTransitionFinish: "panelsTransitionFinishHandler",

    onMove: "moveHandler"
  },

  chrome: [
    { name: "_title", classes: "rwatkins-pivotmenu-title", content: "", allowHtml: true },
    { name: "_header", classes: "rwatkins-pivotmenu-header" }
  ],

  //* @protected
  rendered: function() {
    this.inherited(arguments);
    this.createHeaders();
  },

  initComponents: function() {
    this.createChrome(this.chrome);
    this.inherited(arguments);
  },

  // override to ignore title and header
  getPanels: function() {
    var p = this.controlParent || this;
    var panels = [];
    enyo.forEach(p.children, function(child) {
      if ((child.name !== "_title") && (child.name !== "_header")) {
        panels.push(child);
      }
    });
    return panels;
  },

  indexChanged: function() {
    this.inherited(arguments);
    var panel = this.getActive();

    // update history as we move thru Panorama or PivotMenus
    this.bubbleUp("onNavUpdate", { action: this.name, panel: panel.name });

    // change _title to match panel
    if (panel.title && this.$._title) {
      if (panel.title !== this.$._title.getContent()) {
        this.$._title.setContent(panel.title);
      }
    }
  },

  createHeaders: function() {
    if (!this.$._header) { return; }

    var panels = this.layout.getOrderedControls();
    var active = this.getActive();
    var items = [];
    var panel = panels.slice(-1)[0];

    if (!panel || !active) { return; }
    // reorder to active panel first
    if (panels[0].name !== active.name) {
      panels.push(panels.shift());
    }

    items.push({
      kind: "rwatkins.PivotHeaderItem",
      active: (panel.name == active.name),
      panelname: panel.name,
      label: panel.header,
      ontap: "headeritemTapHandler"
    });

    enyo.forEach(panels, function(panel) {
      items.push({
        kind: "rwatkins.PivotHeaderItem",
        active: (panel.name == active.name),
        panelname: panel.name,
        label: panel.header,
        ontap: "headeritemTapHandler"
      });
    }, this);

    this.$._header.destroyClientControls();
    this.$._header.createComponents(items, { owner: this });
    this.$._header.render();

    enyo.dom.transform(this.$._header, {translateX: "0px" || null, translateY: null});

    var headers = this.$._header.getClientControls();
    var header = headers[0];
    if (header) {
      var width = header.getBounds().width * -1;
      var l = width + "px";
      enyo.dom.transform(this.$._header, {translateX: l || null, translateY: null});
    } 
  },

  headeritemTapHandler: function(inSender, inEvent) {
    this.setIndexByName(inSender.panelname);
    return;
  },

  moveHandler: function(inSender, inEvent) {
    if (this.$._header) {
      var headers = this.$._header.getClientControls();
      var header0 = headers[0];
      var header1 = headers[1];
    }

    if (header0 && header1 && inEvent) {
      var width0 = header0.getBounds().width;
      var width1 = header1.getBounds().width;
      var l = ((inEvent.panelposition * width1) - width0) + "px";
      if (inEvent.panelposition > 0) {
        l = ((inEvent.panelposition * width0) - width0) + "px";
      }
      enyo.dom.transform(this.$._header, {translateX: l || null, translateY: null});
    }
    return true;
  },

  panelsTransitionFinishHandler: function() {
    this.createHeaders();
  },

  //* @public
  //* Select a panel by name rather than index
  setIndexByName: function(name) {
    var panels = this.getPanels();

    for (var i=0; i<panels.length; i++) {
      var panel = panels[i];
      if (panel && (panel.name == name)) {
        this.setIndex(i);
        return true;
      }
    }
    return false;
  }

});


enyo.kind({
  name: "rwatkins.PivotHeaderItem",
  classes: "rwatkins-pivotmenu-header-item",

  published: {
    label: "",
    active: false
  },

  components: [
    { name: "label", classes: "rwatkins-pivotmenu-header-item-label", allowHtml: true }
  ],

  create: function() {
    this.inherited(arguments);
    this.activeChanged();
    this.labelChanged();
  },

  labelChanged: function() {
    this.$.label.setContent(this.label);
  },

  activeChanged: function() {
    this.addRemoveClass("active", this.active);
  }
});