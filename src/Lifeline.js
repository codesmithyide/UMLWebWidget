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
        this.boxHeight = 0

        this.levels = [ ]
        
        // List of connection points that are connected to
        // this lifeline
        this.connectionPoints = [ ]
        this.adjustmentNeeded = false
    }

    createConnectionPoint(svg, type) {
        let newPoint = new ConnectionPoint(svg, this)
        this.connectionPoints.push({ point: newPoint, type: type })
        return newPoint
    }

    getLineTopPosition() {
        if (!this.uptodate) {
            this.update()
        }
        return this.lineTopPosition
    }

    getFirstConnectionPointPosition() {
        let position = this.getLineTopPosition()
        position.y += (this.style.getExecutionSpecificationBarMargin() + this.style.getExecutionSpecificationBarOverhang())
        return position
    }

    getCreationConnectionPointPosition() {
        if (!this.uptodate) {
            this.update()
        }
        return { x: this.x, y: (this.y + (this.boxHeight / 2)) }
    }

    getActiveLineWidth() {
        return this.style.getExecutionSpecificationBarWidth()
    }

    addCallerOccurrence(y) {
        this.levels.push([y, 1])
        if (this.levels.length >= 3) {
            let length = this.levels.length
            this.levels[length - 2][0] = this.levels[length - 1][0]
            this.levels.pop()
        }
    }

    addCalleeOccurrence(y) {
        if (this.levels.length == 0) {
            this.levels.push([y, 1])
        } else {
            this.levels.push([y, this.levels[this.levels.length - 1][1] + 1])
        }
        if (this.levels.length >= 3) {
            let length = this.levels.length
            this.levels[length - 2][0] = this.levels[length - 1][0]
            this.levels.pop()
        }
    }

    addReturnOccurrence(y) {
        this.levels.push([y, 0])
        if (this.levels.length >= 3) {
            let length = this.levels.length
            this.levels[length - 2][0] = this.levels[length - 1][0]
            this.levels.pop()
        }
    }

    addReturnCalleeOccurrence(y) {
        if (this.levels.length == 0) {
            this.levels.push([y, 1])
        } else {
            this.levels.push([y, this.levels[this.levels.length - 1][1] + 1])
        }
        if (this.levels.length >= 3) {
            let length = this.levels.length
            this.levels[length - 2][0] = this.levels[length - 1][0]
            this.levels.pop()
        }
    }

    addDestructionOccurrence(y, connectionPoint) {
        this.levels.push([y, 0])
    }

    needToAdjustDestructionPosition() {
        if (this.connectionPoints.length > 1) {
            if ((this.connectionPoints[this.connectionPoints.length - 1].type != "return-start") &&
                (this.connectionPoints[this.connectionPoints.length - 1].type != "creation-end")) {
                this.adjustmentNeeded = true
            }
        }
        return this.adjustmentNeeded
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
    self.boxHeight = currentDimensions.height

    self.lineTopPosition.x = (borderAdjustment.left + (currentDimensions.width / 2))
    self.lineTopPosition.y = (borderAdjustment.top + currentDimensions.height)

    let overhang = style.getExecutionSpecificationBarOverhang()

    self.levels = [ ]
    for (let i = 0; i < self.connectionPoints.length; i++) {
        let connectionPoint = self.connectionPoints[i]
        switch (connectionPoint.type) {
            case "synchronous-start":
                self.addCallerOccurrence(connectionPoint.point.y)
                break

            case "synchronous-end":
                self.addCalleeOccurrence(connectionPoint.point.y)
                break

            case "return-start":
                self.addReturnOccurrence(connectionPoint.point.y)
                break

            case "return-end":
                self.addReturnCalleeOccurrence(connectionPoint.point.y)
                break

            case "creation-start":
                self.addCallerOccurrence(connectionPoint.point.y)
                break

            case "destruction-end":
                if (self.adjustmentNeeded) {
                    self.addReturnOccurrence(connectionPoint.point.y - 25)
                }
                self.addDestructionOccurrence(connectionPoint.point.y)
                break
        }
    }

    if (self.levels.length == 1) {
        if (self.levels[0][1] == 1) {
            lifelineGroup.line(self.lineTopPosition.x, self.lineTopPosition.y, self.lineTopPosition.x, self.levels[0][0] - overhang)
            lifelineGroup
                .rect(8, (2 * overhang))
                .move(self.lineTopPosition.x - 4, self.levels[0][0] - overhang)
        } else {
             lifelineGroup.line(self.lineTopPosition.x, self.lineTopPosition.y, self.lineTopPosition.x, self.levels[0][0])
        }
    } else if (self.levels.length > 1) {
        lifelineGroup.line(self.lineTopPosition.x, self.lineTopPosition.y, self.lineTopPosition.x, self.levels[0][0] - overhang)
        let previousOverhang = 0
        for (let i = 1; i < self.levels.length; i++) {
            if (self.levels[i-1][1] == 1) {
                lifelineGroup
                    .rect(8, (self.levels[i][0] - self.levels[i-1][0] + (2 * overhang)))
                    .move(self.lineTopPosition.x - 4, self.levels[i-1][0] - overhang)
                previousOverhang  = overhang
            } else {
                lifelineGroup.line(self.lineTopPosition.x, self.levels[i-1][0] + previousOverhang, self.lineTopPosition.x, self.levels[i][0])
            }
        }
    }
}

export { Lifeline }
