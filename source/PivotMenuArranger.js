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

// FIXME: inherit from Arranger, not LeftRightArranger
// FIXME: handle 1 panel Pivots
// FIXME: handle 2 panel Pivots
// TODO: set class on activation to animate content in

enyo.kind({
  name: "rwatkins.PivotMenuArranger",
  kind: "enyo.LeftRightArranger",

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

    var s = this.container.fromIndex;
    var f = this.container.toIndex;
    var c$ = this.getOrderedControls(f);
    var o = 1;

    for (var i=0, c; (c=c$[i]); i++) {
// slide in contents of recently activated panel
/*
      if (i == f) {
        c.addClass('shift');
      }
*/
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
    this.inherited(arguments);

    // hide incoming panels till finish
    enyo.forEach(this.container.getPanels(), function(panel) {
      panel.hide();
    });
    var panel = this.container.getActive();
    if (panel) {
      panel.show();
//      panel.removeClass('shift');
    }
  },

  flowArrangement: function() {
    this.inherited(arguments);

    var box = this.box;
    var arrangement = this.container.arrangement;

    var index = (this.container.fromIndex % this.c$.length);
    if (index < 0) { index = this.c$.length + index; }

    if (arrangement[index] !== undefined) {
      var position = (arrangement[index].left) / box;
      this.container.moveHandler({ position: position });
    }
  }

});
