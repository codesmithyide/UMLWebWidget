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
        let borderAdjustment = {
            top: this.y,
            left: this.x
        }
        
        let shapeGroup = this.shapeLayer.group().addClass("UMLActor")
        let textGroup = this.textLayer.group()
        let textDef = textGroup.text(this.actorDescription.name).move(borderAdjustment.left, borderAdjustment.top + 35)
        let width = textDef.bbox().width
        let offset = ((width - 16) / 2)
        shapeGroup.circle(12).move(borderAdjustment.left + 2 + offset, borderAdjustment.top + 1)
        shapeGroup.line(borderAdjustment.left + 8 + offset, borderAdjustment.top + 13, borderAdjustment.left + 8 + offset, borderAdjustment.top + 26)
        shapeGroup.line(borderAdjustment.left + offset, borderAdjustment.top + 18, borderAdjustment.left + 16 + offset, borderAdjustment.top + 18)
        shapeGroup.line(borderAdjustment.left + 8 + offset, borderAdjustment.top + 26, borderAdjustment.left + offset, borderAdjustment.top + 33)
        shapeGroup.line(borderAdjustment.left + 8 + offset, borderAdjustment.top + 26, borderAdjustment.left + 16 + offset, borderAdjustment.top + 33)

        this.uptodate = true
    }
}

export { Actor }
