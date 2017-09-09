'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { ConnectionPoint } from "./ConnectionPoint.js"
import { SVGLayer } from "./SVGLayer.js"

/**
  A lifeline on a sequence diagram.

  @extends DiagramElement
*/
class Lifeline extends DiagramElement {

    constructor(svg, id, lifelineDescription, style) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.svg = svg
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
        if (levels[0][1] > 0) {
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
        let maxDepth = 0
        for (let i = 0; i < levels.length; i++) {
            maxDepth = Math.max(maxDepth, levels[i][1])
        }
        let levelStart = [ ]
        let layers = [ ]
        for (let i = 0; i <= maxDepth; i++) {
            levelStart.push(-1)
            layers.push(new SVGLayer(self.svg))
        }
        for (let i = 1; i < levels.length; i++) {
            // The nesting level of the segment we are currently trying to draw
            let currentNestingLevel = levels[i-1][1]
            let nextNestingLevel = levels[i][1]
            if (currentNestingLevel == 0) {
                // Segments outside any execution specification bar can always
                // be drawn immediately since there isn't any nesting possible
                // in that case
                layers[currentNestingLevel].line(self.lineTopPosition.x, levels[i-1][0] + previousOverhang, self.lineTopPosition.x, levels[i][0])
            } else if (nextNestingLevel > currentNestingLevel) {
                // If the depth is increasing we need to hold off on drawing the
                // previous segment since we are going to draw a nested execution
                // specification bar, we store the start of the deferred segment
                // for later use
                levelStart[currentNestingLevel] = levels[i-1][0]
            } else if (nextNestingLevel <= currentNestingLevel) {
                // If the depth stays the same it means we are at the end of the lifeline
                // (remember we eliminate redundant points so the end of the lifeline is
                // is the only case where we'd have two adjacent points of same depth)
                
                // If the depth is decreasing we can draw the segment since we are
                // at the end of a nested or non-nested execution specification bar

                let offset = ((currentNestingLevel - 1) * 5)
                layers[currentNestingLevel]
                    .rect(8, (levels[i][0] - levels[i-1][0] + (2 * overhang)))
                    .move(self.lineTopPosition.x - 4 + offset, levels[i-1][0] - overhang)
                previousOverhang = overhang
            }
        }
        // Since we are at the end of the line draw all the segments that are
        // still deferred
        let end = levels[levels.length - 1][0]
        for (let i = 0; i < levelStart.length; i++) {
            if (levelStart[i] != -1) {
                layers[i]
                    .rect(8, (end - levelStart[i] + (2 * overhang)))
                    .move(self.lineTopPosition.x - 4, levelStart[i] - overhang)
            }
        }
        for (let i = 1; i < layers.length; i++) {
            layers[i].write(lifelineGroup)
        }
    }
}

function addCallerOccurrence(levels, y) {
    levels.push([y, 1])
    concatenateLevels(levels)
}

function addCalleeOccurrence(levels, y) {
    if (levels.length == 0) {
        levels.push([y, 1])
    } else {
        levels.push([y, levels[levels.length - 1][1] + 1])
    }
    concatenateLevels(levels)
}

function addReturnOccurrence(levels, y) {
    let newLevel = 0
    let length = levels.length
    if (length > 0) {
        newLevel = Math.max(0, (levels[length - 1][1] - 1))
    }
    levels.push([y, newLevel])
    concatenateLevels(levels)
}

function addReturnCalleeOccurrence(levels, y) {
    let length = levels.length
    if (length == 0) {
        levels.push([y, 1])
    } else {
        levels.push([y, levels[length - 1][1]])
    }
    concatenateLevels(levels)
}

function addDestructionOccurrence(levels, y) {
    levels.push([y, 0])
}

function concatenateLevels(levels) {
    let length = levels.length
    if (length >= 3) {
        if (levels[length - 3][1] == levels[length - 2][1]) {
            levels[length - 2][0] = levels[length - 1][0]
            levels[length - 2][1] = levels[length - 1][1]
            levels.pop()
        }
    }
}

export { Lifeline }
