'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { ConnectionPoint } from "./ConnectionPoint.js"

/**
  A node on a deployment diagram.

  @extends DiagramElement
*/
class Node extends DiagramElement {

    constructor(svg, id, nodeDescription, style) {
        super(svg, "node", id)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.nodeDescription = nodeDescription
        this.style = style
    }

    createConnectionPoint(svg) {
        let newPoint = new ConnectionPoint(svg, this)
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

        currentDimensions.width += (this.style.getLeftMargin("node") + this.style.getRightMargin("node"))

        let pt1 = (borderAdjustment.left + 12) + "," + borderAdjustment.top
        let pt2 = (borderAdjustment.left + currentDimensions.width + 10) + "," + borderAdjustment.top
        let pt3 = (borderAdjustment.left + currentDimensions.width) + "," + (borderAdjustment.top + 10)
        let pt4 = (borderAdjustment.left) + "," + (borderAdjustment.top + 10)
        nodeGroup.polygon(pt1 + " " + pt2 + " " + pt3 + " " + pt4)

        let pt5 = (borderAdjustment.left + currentDimensions.width) + "," + (borderAdjustment.top + currentDimensions.height + 10)
        let pt6 = (borderAdjustment.left + currentDimensions.width + 10) + "," + (borderAdjustment.top + currentDimensions.height - 1)
        nodeGroup.polygon(pt2 + " " + pt3 + " " + pt5 + " " + pt6)      

        nodeGroup.rect(currentDimensions.width, currentDimensions.height).move(borderAdjustment.left, borderAdjustment.top + 10)
    }

}

export { Node }
