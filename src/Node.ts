/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import { DiagramElement, DiagramElementType } from "./DiagramElement"
import { Style } from "./Style"
import { CSSClassName } from "./CSSClassNames"
import { ConnectionPoint } from "./ConnectionPoint"
import { ConnectionPointPosition } from "./ConnectionPointPosition"
import { Diagram } from "./Diagram"
import { SVGLayer } from "./SVGLayer"
import { IDGenerator } from "./IDGenerator"
import { Errors } from "./Errors"

/**
 * A node on a deployment diagram.
 *
 * @extends DiagramElement
 */
class Node extends DiagramElement {
    errors: Errors
    shapeLayer: SVGLayer
    textLayer: SVGLayer
    nodeDescription
    style: Style
    connectionPointsRectangle

    constructor(svg, idGenerator: IDGenerator, nodeDescription, style: Style, errors: Errors) {
        super(svg, DiagramElementType.Node, idGenerator.createID("node--" + nodeDescription.name))
        this.errors = errors
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.nodeDescription = nodeDescription
        this.style = style
        this.connectionPointsRectangle = null
    }

    draw(): void {
        this.update()
        let g = this.layers.svg.group().addClass(CSSClassName.Node)
        g.id(this.id)
        this.layers.getLayer("shape").write(g)
        this.layers.getLayer("text").write(g)
    }

    createConnectionPoint(svg) {
        let newPoint = new ConnectionPoint(svg, this, ConnectionPointPosition.BottomCenter, this.errors)
        return newPoint
    }

    doUpdate() {
        var nodeGroup = this.shapeLayer.group().addClass("UMLNode")
    
        let currentDimensions = { 
            width: 0,
            height: 0
        }

        let borderAdjustment = {
            top: this.y + 1,
            left: this.x + 1
        }
    
        currentDimensions.height = this.style.getTopMargin("node")

        let nodeNameGroup = this.textLayer.group().addClass("UMLNodeName")
        var nodeNameDef = nodeNameGroup.text(this.nodeDescription.name).move(borderAdjustment.left + this.style.getLeftMargin("node"), borderAdjustment.top + currentDimensions.height + 10)
        currentDimensions.width = Math.max(currentDimensions.width, nodeNameDef.bbox().width)
        currentDimensions.height += (nodeNameDef.bbox().height + this.style.getBottomMargin("node"))

        if (currentDimensions.width > nodeNameDef.bbox().width) {
            nodeNameDef.dx((currentDimensions.width - nodeNameDef.bbox().width)/2)
        }

        // A node can contain a sub-diagram inside it
        if ((this.nodeDescription.elements != null) && (this.nodeDescription.elements.length > 0)) {
            let diagram = new Diagram(null)
            diagram.createFromJSON(this.layers.svg, this.id, this.nodeDescription, null)
        }

        currentDimensions.width += (this.style.getLeftMargin("node") + this.style.getRightMargin("node"))

        let pt1 = (borderAdjustment.left + 12) + "," + borderAdjustment.top
        let pt2 = (borderAdjustment.left + currentDimensions.width + 10) + "," + borderAdjustment.top
        let pt3 = (borderAdjustment.left + currentDimensions.width) + "," + (borderAdjustment.top + 10)
        let pt4 = (borderAdjustment.left) + "," + (borderAdjustment.top + 10)
        nodeGroup.polygon(pt1 + " " + pt2 + " " + pt3 + " " + pt4)

        let pt5 = (borderAdjustment.left + currentDimensions.width) + "," + (borderAdjustment.top + currentDimensions.height + 10)
        let pt6 = (borderAdjustment.left + currentDimensions.width + 10) + "," + (borderAdjustment.top + currentDimensions.height - 1)
        nodeGroup.polygon(pt2 + " " + pt3 + " " + pt5 + " " + pt6)      

        let rect = nodeGroup.rect(currentDimensions.width, currentDimensions.height).move(borderAdjustment.left, borderAdjustment.top + 10)

        this.connectionPointsRectangle = rect.bbox()
        this.connectionPointsRectangle.cy -= 5
        this.connectionPointsRectangle.width += 5
    }

    doGetConnectionPointsRectangle() {
        return this.connectionPointsRectangle 
    }

}

export { Node }
