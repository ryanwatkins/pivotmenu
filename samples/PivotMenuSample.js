/* PivotMenuSample.js */

enyo.kind({
  name: "PivotMenuSample",
  kind: "rwatkins.PivotMenu",

  margin: 100, // px margin

  components: [
    { name: "panel1", classes: "pivotmenu-panel",
      horizontal: "hidden",
      header: "header 1",
      title: "title 1",
      components: [
        { content: "content 1" }
      ]
    },
    { name: "panel2", classes: "pivotmenu-panel",
      horizontal: "hidden",
      header: "header 2",
      title: "title 2",
      components: [
        { content: "content 2" }
      ]
    },
    { name: "panel3", classes: "pivotmenu-panel",
      horizontal: "hidden",
      header: "header 3",
      title: "title 3",
      components: [
        { content: "content 3" }
      ]
    }
  ]

});