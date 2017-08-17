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

    group() {
        let groupDef = this.svg.defs().group()
        this.defs.push(groupDef)
        return groupDef
    }

    line(x1, y1, x2, y2) {
        let lineDef = this.svg.defs().line(x1, y1, x2, y2)
        this.defs.push(lineDef)
        return lineDef
    }

    rect(width, height) {
        let rectDef = this.svg.defs().rect(width, height)
        this.defs.push(rectDef)
        return rectDef
    }

    text(str) { 
        let textDef = this.svg.defs().text(str)
        this.defs.push(textDef)
        return textDef
    }

    write() {
        let self = this
        self.defs.forEach(function(def) {
            def.clone(self.svg)
            def.remove()
        })
    }

    merge(layer) {
        this.defs = this.defs.concat(layer.defs)
    }

}

export { SVGLayer }
