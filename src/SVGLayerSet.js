'use strict'

import { SVGLayer } from "./SVGLayer.js"

/**
  <p>
    A set of layers.
  </p>
*/
class SVGLayerSet {

    /**
      Creates a new SVGLayerSet instance.

      @param {SVG} svg - The root SVG document.
    */
    constructor(svg) {
        this.svg = svg
        this.layers = { }
    }

    /**
      Gets a layer.

      @param {string} name - The name of the layer.
      @returns {SVGLayer|null} The layer or null if no layer
        with such name exists.
    */
    getLayer(name) {
        return this.layers[name]
    }

    /**
      Creates a new layer.

      @param {string} name - The name of the layer.
      @returns {SVGLayer} The new layer.
    */
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

      @param {SVGLayerSet} layerSet - The other layer set.
    */
    merge(layerSet) {
        let self = this
        let keys = Object.keys(self.layers)
        keys.forEach(function(key) {
            self.layers[key].merge(layerSet.layers[key])
        })
    }

    /**
      Calls {@link SVGLayer#clear} on each layer in the set.
    */
    clearEachLayer() {
        let self = this
        let keys = Object.keys(self.layers)
        keys.forEach(function(key) {
            self.layers[key].clear()
        })
    }
}

export { SVGLayerSet }
