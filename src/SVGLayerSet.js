'use strict'

import { SVGLayer } from "./SVGLayer.js"

/**
  <p>
    A set of layers.
  </p>
*/
class SVGLayerSet {

    constructor(svg) {
        this.svg = svg
        this.layers = { }
    }

    createLayer(name) {
        let newLayer = new SVGLayer(this.svg)
        this.layers[name] = newLayer
        return newLayer
    }

}

export { SVGLayerSet }
