'use strict'

import { SVGLayerSet } from "./SVGLayerSet.js"


/**
  An element of a diagram.
*/
class DiagramElement {

    constructor(svg) {
        this.layers = new SVGLayerSet(svg)
    }

}

export { DiagramElement }
