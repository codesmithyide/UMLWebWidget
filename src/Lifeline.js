'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { ConnectionPoint } from "./ConnectionPoint.js"

/**
  A lifeline on a sequence diagram.

  @extends DiagramElement
*/
class Lifeline extends DiagramElement {

    constructor(svg, id, lifelineDescription, style) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.id = id
        this.lifelineDescription = lifelineDescription
        this.style = style

        this.lineTopPosition = { x: 0, y: 0 }
        
        // List of connection points that are connected to
        // this lifeline
        this.connectionPoints = [ ]
    }

    createConnectionPoint(svg) {
        let newPoint = new ConnectionPoint(svg, this)
        this.connectionPoints.push(newPoint)
        return newPoint
    }

    getLineTopPosition() {
        if (!this.uptodate) {
            this.update()
        }
        return this.lineTopPosition
    }

    getActiveLineWidth() {
        return 8
    }

    update() {
        this.layers.clearEachLayer()
        createDef(this, this.lifelineDescription, this.style)
        this.uptodate = true
    }

}

function createDef(self, lifelineDescription, style) {
    var lifelineGroup = self.shapeLayer.group().addClass("UMLLifeline")

    let currentDimensions = { 
        width: 0,
        height: 0
    }

    let borderAdjustment = {
        top: self.y + 1,
        left: self.x + 1
    }
    
    currentDimensions.height = style.getTopMargin("lifeline")

    var instanceNameGroup = self.textLayer.group().addClass("UMLInstanceName")
    var instanceNameDef = instanceNameGroup.text(":" + lifelineDescription.name).move(borderAdjustment.left + style.getLeftMargin("lifeline"), borderAdjustment.top + currentDimensions.height)
    currentDimensions.width = Math.max(currentDimensions.width, instanceNameDef.bbox().width)
    currentDimensions.height += (instanceNameDef.bbox().height + style.getBottomMargin("lifeline"))

    currentDimensions.width += (style.getLeftMargin("lifeline") + style.getRightMargin("lifeline"))
    
    lifelineGroup.rect(currentDimensions.width, currentDimensions.height).move(borderAdjustment.left, borderAdjustment.top)

    self.lineTopPosition.x = (borderAdjustment.left + (currentDimensions.width / 2))
    self.lineTopPosition.y = (borderAdjustment.top + currentDimensions.height)

    if (self.connectionPoints.length > 0) {
        lifelineGroup.line(self.lineTopPosition.x, self.lineTopPosition.y, self.lineTopPosition.x, self.connectionPoints[0].y)
        if (self.connectionPoints.length > 1) {
            lifelineGroup
                .rect(8, (self.connectionPoints[self.connectionPoints.length - 1].y - self.connectionPoints[0].y))
                .move(self.lineTopPosition.x - 4, self.connectionPoints[0].y)
        }
    }
}

export { Lifeline }
