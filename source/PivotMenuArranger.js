/* PivotMenuArranger.js */
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

// FIXME: handle scrolling backgwards in 2 panel Pivots
// TODO: set class on activation to animate content in

enyo.kind({
  name: "rwatkins.PivotMenuArranger",
  kind: "enyo.Arranger",

  axisSize: "width",
  offAxisSize: "height",
  axisPosition: "left",
  constructor: function() {
    this.inherited(arguments);
    this.margin = this.container.margin != null ? this.container.margin : this.margin;
  },

  // no margin adjust
  size: function() {
    var c$ = this.container.getPanels();
    var port = this.containerBounds[this.axisSize];
    var box = port;

    this.box = box;

    for (var i=0, b, c; (c=c$[i]); i++) {
      b = {};
      b[this.axisSize] = box;
      c.setBounds(b);
    }
  },

  arrange: function(inC, inIndex) {
    var i,c,v,b;

    if (this.container.getPanels().length == 1) {
      b = {};
      b[this.axisPosition] = 0; // no margin
      this.arrangeControl(this.container.getPanels()[0], b);
      return;
    }

    var o = 1; // only offset one when rotating panels, dont center
    var c$ = this.getOrderedControls(Math.floor(inIndex)-o);
    var box = this.containerBounds[this.axisSize];

    var e = 0 - box * o; // no margin
    for (i=0; (c=c$[i]); i++) {
      b = {};
      b[this.axisPosition] = e;
      // position to allow header to be clickable, but still draggable
      if (this.container.headerOffset) {
        b['top'] = this.container.headerOffset;
      }
      this.arrangeControl(c, b);
      e += box;
    }
  },

  // HACK HACK: hide rather than set z-index
  start: function() {
    this.inherited(arguments);

    var panels = this.container.getPanels();
    if (panels.length == 1) {
      return;
    }

    var s = this.container.fromIndex;
    var f = this.container.toIndex;
    var c$ = this.getOrderedControls(f);
    var o = 1;

//    var active = (f % c$.length);
//    if (active < 0) { active = c$.length - active; }

   for (var i=0, c; (c=c$[i]); i++) {

//     if (i == active) {
//       enyo.log('shift', panel.name, i, active);
//       c.addClass('shift');
//     }

      if (s > f){
        if (i == (c$.length - o)){
          c.hide();
        }
      } else {
        if (i == (c$.length - 1 - o)){
          c.hide();
        }
      }
    }

  },

  finish: function() {
    // hide incoming panels till finish
    enyo.forEach(this.container.getPanels(), function(panel) {
      panel.hide();
    });
    var panel = this.container.getActive();
    if (panel) {
      panel.show();
//      enyo.log('unshift', panel.name);
//      panel.removeClass('shift');
    }
  },

  flowArrangement: function() {
    this.inherited(arguments);

    if (this.container.getPanels().length == 1) {
      return;
    }

    var box = this.box;
    var arrangement = this.container.arrangement;

    var index = (this.container.fromIndex % this.c$.length);
    if (index < 0) { index = this.c$.length + index; }

    if (arrangement[index] !== undefined) {
      var position = (arrangement[index].left) / box;
      this.container.moveHandler({ position: position });
    }
  },

  calcArrangementDifference: function(inI0, inA0, inI1, inA1) {
    if (this.container.getPanels().length == 1) {
      return 0;
    }
    var i = Math.abs(inI0 % this.c$.length);
    return inA0[i][this.axisPosition] - inA1[i][this.axisPosition];
  },

  destroy: function() {
    var c$ = this.container.getPanels();
    for (var i=0, c; (c=c$[i]); i++) {
      enyo.Arranger.positionControl(c, {left: null, top: null});
      enyo.Arranger.opacifyControl(c, 1);
      c.applyStyle("left", null);
      c.applyStyle("top", null);
      c.applyStyle("height", null);
      c.applyStyle("width", null);
      c.show();
    }
    this.inherited(arguments);
  }


});
