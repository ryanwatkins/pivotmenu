// PivotMenu.js

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
//    onTransitionStart: "panelsTransitionStartHandler",
    onTransitionFinish: "panelsTransitionFinishHandler",

    onMove: "moveHandler"
  },

  chrome: [
    { name: "_title", classes: "rwatkins-pivotmenu-title", content: "", allowHtml: true },
    { name: "_header", classes: "rwatkins-pivotmenu-header" }
  ],

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
    _.each(p.children, function(child) {
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
    var panel = _.last(panels);

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

    _.each(panels, function(panel) {
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
    } else {
      this.log("ERROR", headers);
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

  // Hook into to set active header
/*
  panelsTransitionStartHandler: function() {
  },
*/
  panelsTransitionFinishHandler: function() {
    this.createHeaders();
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