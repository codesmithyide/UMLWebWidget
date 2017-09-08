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

    let levels = [ ]
    for (let i = 0; i < self.connectionPoints.length; i++) {
        let connectionPoint = self.connectionPoints[i]
        switch (connectionPoint.type) {
            case "synchronous-start":
                addCallerOccurrence(levels, connectionPoint.point.y)
                break

            case "synchronous-end":
                addCalleeOccurrence(levels, connectionPoint.point.y)
                break

            case "return-start":
                addReturnOccurrence(levels, connectionPoint.point.y)
                break

            case "return-end":
                addReturnCalleeOccurrence(levels, connectionPoint.point.y)
                break

            case "creation-start":
                addCallerOccurrence(levels, connectionPoint.point.y)
                break

            case "destruction-end":
                if (self.adjustmentNeeded) {
                    addReturnOccurrence(levels, connectionPoint.point.y - 25)
                }
                addDestructionOccurrence(levels, connectionPoint.point.y)
                break
        }
    }

    if (levels.length == 1) {
        if (levels[0][1] == 1) {
            lifelineGroup.line(self.lineTopPosition.x, self.lineTopPosition.y, self.lineTopPosition.x, levels[0][0] - overhang)
            lifelineGroup
                .rect(8, (2 * overhang))
                .move(self.lineTopPosition.x - 4, levels[0][0] - overhang)
        } else {
             lifelineGroup.line(self.lineTopPosition.x, self.lineTopPosition.y, self.lineTopPosition.x, levels[0][0])
        }
    } else if (levels.length > 1) {
        lifelineGroup.line(self.lineTopPosition.x, self.lineTopPosition.y, self.lineTopPosition.x, levels[0][0] - overhang)
        let previousOverhang = 0
        for (let i = 1; i < levels.length; i++) {
            if (levels[i-1][1] == 1) {
                lifelineGroup
                    .rect(8, (levels[i][0] - levels[i-1][0] + (2 * overhang)))
                    .move(self.lineTopPosition.x - 4, levels[i-1][0] - overhang)
                previousOverhang  = overhang
            } else {
                lifelineGroup.line(self.lineTopPosition.x, levels[i-1][0] + previousOverhang, self.lineTopPosition.x, levels[i][0])
            }
        }
    }
}

function addCallerOccurrence(levels, y) {
    levels.push([y, 1])
    if (levels.length >= 3) {
        let length = levels.length
        levels[length - 2][0] = levels[length - 1][0]
        levels.pop()
    }
}

function addCalleeOccurrence(levels, y) {
    if (levels.length == 0) {
        levels.push([y, 1])
    } else {
        levels.push([y, levels[levels.length - 1][1] + 1])
    }
    if (levels.length >= 3) {
        let length = levels.length
        levels[length - 2][0] = levels[length - 1][0]
        levels.pop()
    }
}

function addReturnOccurrence(levels, y) {
    levels.push([y, 0])
    if (levels.length >= 3) {
        let length = levels.length
        levels[length - 2][0] = levels[length - 1][0]
        levels.pop()
    }
}

function addReturnCalleeOccurrence(levels, y) {
    if (levels.length == 0) {
        levels.push([y, 1])
    } else {
        levels.push([y, levels[levels.length - 1][1] + 1])
    }
    if (levels.length >= 3) {
        let length = levels.length
        levels[length - 2][0] = levels[length - 1][0]
        levels.pop()
    }
}

function addDestructionOccurrence(levels, y) {
    levels.push([y, 0])
}

export { Lifeline }
