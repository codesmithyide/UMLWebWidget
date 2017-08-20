'use strict'

import { SVGLayerSet } from "./SVGLayerSet.js"

var position = Symbol()

/**
  An element of a diagram.

  @property {SVGLayerSet} this.layers - The various SVG layers
    to use to render this element.
  @property {boolean} this.uptodate - Whether the layers need 
    to be updated because of changes to the element.
*/
class DiagramElement {

    constructor(svg) {
        this.layers = new SVGLayerSet(svg)
        this.uptodate = false
        this[position] = { x: 0, y: 0 }
    }

    /**
      Gets the layers of the element. This checks
      if any changes were made to the element and calls
      {@link DiagramElement#update} if necessary before
      returning the layers.
      @returns {SVGLayerSet} The SVG layers to use to draw the
        element.
    */
    getLayers() {
        if (!this.uptodate) {
            this.update()
        }
        return this.layers
    }

    get x() {
        return this[position].x
    }

    get y() {
        return this[position].y
    }

    move(x, y) {
        this.uptodate = false
        this[position].x = x
        this[position].y = y
    }

    /**
      This function must be called after changes were
      made to update the contents of the SVG layers.

      @virtual
    */
    update() {
    }

}

export { DiagramElement }
