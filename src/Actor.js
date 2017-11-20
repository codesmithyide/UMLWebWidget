'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { ConnectionPoint } from "./ConnectionPoint.js"

/**
  An actor on a use case diagram.

  @extends DiagramElement
*/
class Actor extends DiagramElement {

    constructor(svg, id, actorDescription) {
        super(svg, "actor", id)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.actorDescription = actorDescription
        this.connectionPointsRectangle = null
    }

    createConnectionPoint(svg) {
        let newPoint = new ConnectionPoint(svg, this)
        return newPoint
    }

    doUpdate() {
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

        this.connectionPointsRectangle = {
            "x": borderAdjustment.left,
            "y": borderAdjustment.top,
            "w": width,
            "width": width,
            "height": (35 + textDef.bbox().height),
            "h": (35 + textDef.bbox().height),
            "x2": (borderAdjustment.left + width),
            "y2": (borderAdjustment.top + 35 + textDef.bbox().height),
            "cx": (borderAdjustment.left + (width / 2)),
            "cy": (borderAdjustment.top + ((35 + textDef.bbox().height) / 2))
        }
    }

    doGetConnectionPointsRectangle() {
        return this.connectionPointsRectangle 
    }

}

export { Actor }
