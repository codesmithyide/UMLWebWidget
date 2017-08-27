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

    /**
      Creates a new SVGLayer instance.

      @param {SVG} svg - The root SVG document.
    */
    constructor(svg) {
        this.svg = svg
        this.defs = [ ]
    }

    /**
      Adds a group to the layer.

      @returns {SVG.G} An SVG.G element as decribed in {@link http://svgjs.com/parents/#svg-g}
    */
    group() {
        let groupDef = this.svg.defs().group()
        this.defs.push(groupDef)
        return groupDef
    }

    /**
      Adds a line to the layer.

      @returns {SVG.Line} An SVG.Line element as decribed in {@link http://svgjs.com/elements/#svg-line}
    */
    line(x1, y1, x2, y2) {
        let lineDef = this.svg.defs().line(x1, y1, x2, y2)
        this.defs.push(lineDef)
        return lineDef
    }

    /**
      Adds a rectangle to the layer.

      @returns {SVG.Rect} An SVG.Rect element as decribed in {@link http://svgjs.com/elements/#svg-rect}
    */
    rect(width, height) {
        let rectDef = this.svg.defs().rect(width, height)
        this.defs.push(rectDef)
        return rectDef
    }

    /**
      Adds a text element to the layer.

      @returns {SVG.Text} An SVG.Text element as decribed in {@link http://svgjs.com/elements/#svg-text}
    */
    text(str) { 
        let textDef = this.svg.defs().text(str)
        this.defs.push(textDef)
        return textDef
    }

    /**
      Writes the layer to the SVG document. This should be the final
      action performed on the layer. In the current implementation there
      is no way to undo the write.
    */
    write() {
        let self = this
        self.defs.forEach(function(def) {
            def.clone(self.svg)
            def.remove()
        })
    }

    /**
      Merges the contents of another layer into this layer.
      The other layer should not be used afterwards.

      @param {SVGLayer} layer - The contents of this layer will be merged
        into this one.
    */
    merge(layer) {
        this.defs = this.defs.concat(layer.defs)
    }

    /**
      Remove all contents of the layer. Note that this doesn't
      remove elements that have been written to the SVG document
      already.
    */
    clear() {
        let self = this
        self.defs.forEach(function(def) {
            def.remove()
        })
        self.defs.length = 0
    }
}

export { SVGLayer }
