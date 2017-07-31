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

    /**
      Merge another set into this one. Layers
      with the same name will be merged together
      with the elements of the set given as argument
      being appended.
    */
    merge(layerSet) {
    }

}

export { SVGLayerSet }
