'use strict'

class DiagramElement {

    constructor(svg) {
        this.layers = new SVGLayerSet(svg)
    }

}

export { DiagramElement }
