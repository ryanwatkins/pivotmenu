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
 * Copyright © 2013 Ryan Watkins <ryan@ryanwatkins.net>
 *
 * Permission to use, copy, modify, distribute, and sell this software
 * and its documentation for any purpose is hereby granted without
 * fee, provided that the above copyright notice appear in all copies
 * and that both that copyright notice and this permission notice
 * appear in supporting documentation. No representations are made
 * about the suitability of this software for any purpose. It is
 * provided "as is" without express or implied warranty.
 */

// FIXME: be more intelligent when scrolling forward, move offscreen header around earlier

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
    onTransitionStart: "panelsTransitionStartHandler",
    onTransitionFinish: "panelsTransitionFinishHandler"
  },

  chrome: [
    { name: "_title", classes: "rwatkins-pivotmenu-title", content: "", allowHtml: true },
    { name: "_header", classes: "rwatkins-pivotmenu-header" }
  ],

  //* @protected
  rendered: function() {
    this.inherited(arguments);
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

    // change _title to match panel
    if (panel.title && this.$._title) {
      if (panel.title !== this.$._title.getContent()) {
        this.$._title.setContent(panel.title);
      }
    }
  },

  createHeaders: function() {

    if (!this.$._header) { return; }

    var panels = this.layout.getOrderedControls(this.index);
    var active = this.getActive();
    var items = [];

    if (!panels || (panels.length < 1)) { return; }

    panels.unshift(panels.pop());

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

    var headers = this.$._header.getClientControls();
    var header = headers[0];

    if (header) {
      var width = (header.getBounds().width) * -1;
      var l = width + "px";
      enyo.dom.transform(this.$._header, {translateX: l || null, translateY: null});
    } else {
      this.log('no header');
      enyo.dom.transform(this.$._header, {translateX: "0px" || null, translateY: null});
    }
  },

  // tapping a header item slides that panel into the active position
  headeritemTapHandler: function(inSender, inEvent) {
    var panel = this.getActive();
    if (panel.name !== inSender.panelname) {
      this.setIndexByName(inSender.panelname);
    }
    return;
  },

  // move the headers as the panels slide
  moveHandler: function(params) {
    // params.position is -1 to 1 reflecting amount of forward or backwared
    // drag since the last arrangement.
    if (this.$._header) {
      var headers = this.$._header.getClientControls();
      if (headers && headers.length > 1) {
        var header0 = headers[0];
        var header1 = headers[1];
      }
    }

    if (header0) {
      var header = header0;
      if (this.toIndex > this.fromIndex) {
        header = header1;
      }
      var width = ((header0.getBounds().width) * -1) + (params.position * header.getBounds().width);
      enyo.dom.transform(this.$._header, {translateX: (width + "px") || null, translateY: null});
    } else {
      this.log("no header0");
    }

    return true;
  },

  panelsTransitionStartHandler: function() {
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

/* individual items in the header, one per panel */
enyo.kind({
  name: "rwatkins.PivotHeaderItem",
  classes: "rwatkins-pivotmenu-header-item",

  published: {
    label: "",
    active: false /* non-active headers are partially transparent */
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