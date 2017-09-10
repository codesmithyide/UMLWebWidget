'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { ConnectionPoint } from "./ConnectionPoint.js"
import { SVGLayer } from "./SVGLayer.js"
import { LifelineLayoutManager } from "./LifelineLayoutManager.js"

/**
  A lifeline on a sequence diagram.

  @extends DiagramElement
*/
class Lifeline extends DiagramElement {

    constructor(svg, id, lifelineDescription, style, log) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.svg = svg
        this.id = id
        this.lifelineDescription = lifelineDescription
        this.style = style
        this.log = log

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
        this.log.info("Lifeline " + this.id + ": updating")
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

    let lifelineLayout = new LifelineLayoutManager()

    let levels = [ ]
    for (let i = 0; i < self.connectionPoints.length; i++) {
        let connectionPoint = self.connectionPoints[i]
        switch (connectionPoint.type) {
            case "synchronous-start":
                lifelineLayout.addCallerOccurrence(levels, connectionPoint.point.y)
                break

            case "synchronous-end":
                lifelineLayout.addCalleeOccurrence(levels, connectionPoint.point.y)
                break

            case "return-start":
                lifelineLayout.addReturnOccurrence(levels, connectionPoint.point.y)
                break

            case "return-end":
                lifelineLayout.addReturnCalleeOccurrence(levels, connectionPoint.point.y)
                break

            case "creation-start":
                lifelineLayout.addCallerOccurrence(levels, connectionPoint.point.y)
                break

            case "destruction-end":
                if (self.adjustmentNeeded) {
                    lifelineLayout.addReturnOccurrence(levels, connectionPoint.point.y - 25)
                }
                lifelineLayout.addDestructionOccurrence(levels, connectionPoint.point.y)
                break
        }
    }

    let debugMessage = "Lifeline " + self.id + ": levels: ["
    for (let level of levels) {
         debugMessage += " " + level[1]
    }
    debugMessage += " ]"
    self.log.debug(debugMessage)

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

            // At each iteration we try to process/draw the previous changes in
            // depth: (i-1)

            // The nesting level of the segment we are currently trying to draw
            let currentNestingLevel = levels[i-1][1]
            let nextNestingLevel = levels[i][1]

            self.log.trace("Lifeline " + self.id + ": handling depth change " + i + " from " 
                + currentNestingLevel + " to " + nextNestingLevel)

            if (currentNestingLevel == 0) {
                // Segments outside any execution specification bar can always
                // be drawn immediately since there isn't any nesting possible
                // in that case
                self.log.trace("Lifeline " + self.id + ": drawing line")
                layers[currentNestingLevel].line(self.lineTopPosition.x, levels[i-1][0], self.lineTopPosition.x, levels[i][0])
            } else if (nextNestingLevel > currentNestingLevel) {
                // If the depth is increasing we need to hold off on drawing the
                // previous segment since we are going to draw a nested execution
                // specification bar, we store the start of the deferred segment
                // for later use
                self.log.trace("Lifeline " + self.id + ": deferring drawing")
                levelStart[currentNestingLevel] = levels[i-1][0]
            } else if (nextNestingLevel <= currentNestingLevel) {
                // If the depth stays the same it means we are at the end of the lifeline
                // (remember we eliminate redundant points so the end of the lifeline is
                // is the only case where we'd have two adjacent points of same depth)
                
                // If the depth is decreasing we can draw the segment since we are
                // at the end of a nested or non-nested execution specification bar

                self.log.trace("Lifeline " + self.id + ": drawing rectangle")

                let start = levels[i-1][0];
                if (levelStart[currentNestingLevel] != -1) {
                    start = levelStart[currentNestingLevel]
                }

                let offset = ((currentNestingLevel - 1) * 5)
                layers[currentNestingLevel]
                    .rect(8, (levels[i][0] - start + (2 * overhang)))
                    .move(self.lineTopPosition.x - 4 + offset, start - overhang)
                levelStart[currentNestingLevel] = -1
            }
        }

        // If the last change is an increase form 0 to 1 it means we have an
        // isolated message right at the end of the lifeline which is not a
        // destruction occurrence.
        if ((levels[levels.length - 2][1] == 0) && (levels[levels.length - 1][1] > 0)) {
            layers[levels[levels.length - 1][1]]
                .rect(8, (2 * overhang))
                .move(self.lineTopPosition.x - 4, levels[levels.length - 1][0] - overhang)
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
        for (let i = 0; i < layers.length; i++) {
            layers[i].write(lifelineGroup)
        }
    }
}

export { Lifeline }
