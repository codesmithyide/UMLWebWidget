/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import { DiagramElement, DiagramElementType } from "./DiagramElement"
import { CSSClassName } from "./CSSClassNames"
import { ConnectionPoint } from "./ConnectionPoint"
import { ConnectionPointPosition } from "./ConnectionPointPosition"
import { Log } from "./Log"
import { LifelineLayout } from "./LifelineLayout"
import { SVGUtils } from "./SVGUtils"
import { SVGLayer } from "./SVGLayer"
import { IDGenerator } from "./IDGenerator"
import { Errors } from "./Errors"

/**
 * A lifeline on a sequence diagram.
 *
 * @extends DiagramElement
 */
class Lifeline extends DiagramElement {
    errors: Errors
    headShapeLayer: SVGLayer
    headTextLayer: SVGLayer
    lineShapeLayer: SVGLayer
    svg
    lifelineDescription
    style
    log: Log
    lineTopPosition
    boxHeight
    connectionPoints
    adjustmentNeeded
    lifelineLayout

    /**
     * <p>
     *   Creates a new Lifeline instance.
     * </p>
     *
     * <p>
     *   At construction time the messages related to this lifeline are not known. They will be added later by calls to
     *   {@link Lifeline#createConnectionPoint}. Layout has to be performed after all messages have been added.
     * </p>
     *
     * @param {SVG} svg - The root SVG document.
     */
    constructor(svg, idGenerator: IDGenerator, lifelineDescription, style, log, errors: Errors) {
        super(svg, DiagramElementType.Lifeline, idGenerator.createID("lifeline--" + lifelineDescription.name ))
        this.errors = errors
        this.headShapeLayer = this.layers.createLayer("head-shape")
        this.headTextLayer = this.layers.createLayer("head-text")
        this.lineShapeLayer = this.layers.createLayer("line-shape")
        this.svg = svg
        this.lifelineDescription = lifelineDescription
        this.style = style
        this.log = log

        this.lineTopPosition = { x: 0, y: 0 }
        this.boxHeight = 0

        // List of connection points that are connected to
        // this lifeline
        this.connectionPoints = [ ]
        this.adjustmentNeeded = false
        this.lifelineLayout = new LifelineLayout()
    }

    draw(): void {
        this.update()
        let g = this.layers.svg.group().addClass(CSSClassName.Lifeline)
        g.id(this.id)
        this.layers.getLayer("head-shape").write(g)
        this.layers.getLayer("line-shape").write(g)
        this.layers.getLayer("head-text").write(g)
    }

    /**
     * <p>
     *   Creates a new connection point. Connection points are used to link lifelines and messages.
     * </p>
     *
     * <p>
     *   Calls to this functions are also used to communicate to the lifeline which messages it receives or sends. The
     *   order of the calls therefore matters as the order of the messages is assumed to be the order in which this
     *   function is called.
     * </p>
     *
     * @param {SVG} svg - The root SVG document.
     * @param {string} type - The type of the message.
     * @returns {ConnectionPoint}
     */
    createConnectionPoint(svg, type) {
        let newPoint = new ConnectionPoint(svg, this, ConnectionPointPosition.BottomCenter, this.errors)
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

    getHorizontalOffset(y, side) {
        let result = 0
        if (side == "right") {
            result = (this.lifelineLayout.getDepth(y) * (this.getActiveLineWidth() / 2))
        } else if (side == "left") {
            result = -(this.lifelineLayout.getDepth(y) * (this.getActiveLineWidth() / 2))
        }
        return result
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

    doLayout() {
        this.lifelineLayout.dolayout(this.connectionPoints, this.adjustmentNeeded)
    }

    doUpdate() {
        this.log.info("Lifeline " + this.id + ": updating")
        this.layers.clearEachLayer()
        let headGroup = this.headShapeLayer.group().addClass(CSSClassName.Lifeline_Head_Shape)
        let lineGroup = this.lineShapeLayer.group().addClass(CSSClassName.Lifeline_Head_Shape)

        // The box need to be updated first because the position of the top of the line is computed as part of that
        // update
        updateBox(this, headGroup, this.lifelineDescription, this.style, this.lineTopPosition)
        updateLine(this, lineGroup, this.lifelineDescription, this.lifelineLayout.depthChanges, this.style)
    }

}

// Create the box at the top of the lifeline
function updateBox(self, headGroup, lifelineDescription, style, lineTopPosition) {
    let currentDimensions = { 
        width: 0,
        height: 0
    }

    let borderAdjustment = {
        top: self.y + 1,
        left: self.x + 1
    }

    currentDimensions.height = style.getTopMargin("lifeline")

    var instanceNameGroup = self.headTextLayer.group().addClass("UMLInstanceName")
    var instanceNameDef = instanceNameGroup.text(":" + lifelineDescription.name).move(borderAdjustment.left + style.getLeftMargin("lifeline"), borderAdjustment.top + currentDimensions.height)
    currentDimensions.width = Math.max(currentDimensions.width, instanceNameDef.bbox().width)
    currentDimensions.height += (instanceNameDef.bbox().height + style.getBottomMargin("lifeline"))

    currentDimensions.width += (style.getLeftMargin("lifeline") + style.getRightMargin("lifeline"))
    
    SVGUtils.Rectangle(headGroup, borderAdjustment.left, borderAdjustment.top, currentDimensions.width, currentDimensions.height)
    self.boxHeight = currentDimensions.height

    lineTopPosition.x = (borderAdjustment.left + (currentDimensions.width / 2))
    lineTopPosition.y = (borderAdjustment.top + currentDimensions.height)
}

function updateLine(self, lineGroup, lifelineDescription, depthChanges, style) {
    let overhang = style.getExecutionSpecificationBarOverhang()

    let debugMessage = "Lifeline " + self.id + ": depth changes: ["
    for (let depthChange of depthChanges) {
         debugMessage += " " + depthChange[1]
    }
    debugMessage += " ]"
    self.log.debug(debugMessage)

    if (depthChanges.length == 1) {
        if (depthChanges[0][1] > 0) {
            SVGUtils.Line(lineGroup, self.lineTopPosition.x, self.lineTopPosition.y, self.lineTopPosition.x, depthChanges[0][0] - overhang)
            SVGUtils.Rectangle(lineGroup, self.lineTopPosition.x - 4, depthChanges[0][0] - overhang, 8, (2 * overhang))
        } else {
            SVGUtils.Line(lineGroup, self.lineTopPosition.x, self.lineTopPosition.y, self.lineTopPosition.x, depthChanges[0][0])
        }
    } else if (depthChanges.length > 1) {
        SVGUtils.Line(lineGroup, self.lineTopPosition.x, self.lineTopPosition.y, self.lineTopPosition.x, depthChanges[0][0] - overhang)
        let maxDepth = 0
        for (let depthChange of depthChanges) {
            maxDepth = Math.max(maxDepth, depthChange[1])
        }
        let levelStart: number[] = [ ]
        let layers: SVGLayer[] = [ ]
        for (let i = 0; i <= maxDepth; i++) {
            levelStart.push(-1)
            layers.push(new SVGLayer(self.svg))
        }
        for (let i = 1; i < depthChanges.length; i++) {

            // At each iteration we try to process/draw the previous changes in
            // depth: (i-1)

            // The nesting level of the segment we are currently trying to draw
            let currentNestingLevel = depthChanges[i-1][1]
            let nextNestingLevel = depthChanges[i][1]

            self.log.trace("Lifeline " + self.id + ": handling depth change " + i + " from " 
                + currentNestingLevel + " to " + nextNestingLevel)

            if (currentNestingLevel == 0) {
                // Segments outside any execution specification bar can always
                // be drawn immediately since there isn't any nesting possible
                // in that case
                self.log.trace("Lifeline " + self.id + ": drawing line")
                layers[currentNestingLevel].line(self.lineTopPosition.x, depthChanges[i-1][0], self.lineTopPosition.x, depthChanges[i][0])
            } else if (nextNestingLevel > currentNestingLevel) {
                // If the depth is increasing we need to hold off on drawing the
                // previous segment since we are going to draw a nested execution
                // specification bar, we store the start of the deferred segment
                // for later use
                self.log.trace("Lifeline " + self.id + ": deferring drawing")
                levelStart[currentNestingLevel] = depthChanges[i-1][0]
            } else if (nextNestingLevel <= currentNestingLevel) {
                // If the depth stays the same it means we are at the end of the lifeline
                // (remember we eliminate redundant points so the end of the lifeline is
                // is the only case where we'd have two adjacent points of same depth)
                
                // If the depth is decreasing we can draw the segment since we are
                // at the end of a nested or non-nested execution specification bar

                self.log.trace("Lifeline " + self.id + ": drawing rectangle")

                let start = depthChanges[i-1][0];
                if (levelStart[currentNestingLevel] != -1) {
                    start = levelStart[currentNestingLevel]
                }

                let offset = ((currentNestingLevel - 1) * 5)
                layers[currentNestingLevel]
                    .rect(8, (depthChanges[i][0] - start + (2 * overhang)))
                    .move(self.lineTopPosition.x - 4 + offset, start - overhang)
                levelStart[currentNestingLevel] = -1
            }
        }

        // If the last change is an increase form 0 to 1 it means we have an
        // isolated message right at the end of the lifeline which is not a
        // destruction occurrence.
        if ((depthChanges[depthChanges.length - 2][1] == 0) &&
            (depthChanges[depthChanges.length - 1][1] > 0)) {
            layers[depthChanges[depthChanges.length - 1][1]]
                .rect(8, (2 * overhang))
                .move(self.lineTopPosition.x - 4, depthChanges[depthChanges.length - 1][0] - overhang)
        }
       
        // Since we are at the end of the line draw all the segments that are
        // still deferred
        let end = depthChanges[depthChanges.length - 1][0]
        for (let i = 0; i < levelStart.length; i++) {
            if (levelStart[i] != -1) {
                layers[i]
                    .rect(8, (end - levelStart[i] + (2 * overhang)))
                    .move(self.lineTopPosition.x - 4, levelStart[i] - overhang)
            }
        }
        for (let i = 0; i < layers.length; i++) {
            layers[i].write(lineGroup)
        }
    }
}

export { Lifeline }
