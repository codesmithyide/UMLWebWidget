'use strict'

/**
  <p>
    The SVG specification has no concept of layers. The 
    order in which elements are added to the image 
    dictate which ones will be shown over the others.
    This is impractical so this class attempts to 
    provide a workaround.
  </p>

  <p>
    Drawing will be first done on several layers. The
    elements in each of the layers will then be added
    to the SVG document layer per layer.
  </p>   
*/
class SVGLayer {

    constructor(svg) {
        this.svg = svg
        this.defs = [ ]
    }

    text(str) { 
        let textDef = this.svg.defs().text(str)
        this.defs.push(textDef)
        return textDef
    }

    write() {
        let self = this
        this.defs.forEach(function(def) {
            self.svg.add(def.clone())
            def.remove()
        })
    }

    merge(layer) {
    }

}

export { SVGLayer }
