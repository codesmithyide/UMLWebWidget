'use strict'

import { DiagramElement } from "./DiagramElement.js"

/**
  An actor on a use case diagram.

  @extends DiagramElement
*/
class Actor extends DiagramElement {

    constructor(svg, id, actorDescription) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.id = id
        this.actorDescription = actorDescription
    }

    update() {
        let shapeGroup = this.shapeLayer.group().addClass("UMLActor")
        let textGroup = this.textLayer.group()
        let textDef = textGroup.text(this.actorDescription.name).move(0, 35)
        let width = textDef.bbox().width
        let offset = ((width - 16) / 2)
        shapeGroup.circle(12).move(2 + offset, 1)
        shapeGroup.line(8 + offset, 13, 8 + offset, 26)
        shapeGroup.line(offset, 18, 16 + offset, 18)
        shapeGroup.line(8 + offset, 26, offset, 33)
        shapeGroup.line(8 + offset, 26, 16 + offset, 33)

        //if (layout.actorpositions[actorDescription.name]) {
        //    svg.move(layout.actorpositions[actorDescription.name].x, layout.actorpositions[actorDescription.name].y)
        //}

        this.uptodate = true
    }
}

export { Actor }
