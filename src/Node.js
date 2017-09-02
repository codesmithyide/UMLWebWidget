'use strict'

import { DiagramElement } from "./DiagramElement.js"

/**
  A node on a deployment diagram.

  @extends DiagramElement
*/
class Node extends DiagramElement {

    constructor(svg, id, nodeDescription, style) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.id = id
        this.nodeDescription = nodeDescription
        this.style = style
    }

    update() {
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

        var nodeNameDef = this.textLayer.text(this.nodeDescription.name).addClass("UMLNodeName").move(borderAdjustment.left + this.style.getLeftMargin("node"), borderAdjustment.top + currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, nodeNameDef.bbox().width)
        currentDimensions.height += (nodeNameDef.bbox().height + this.style.getBottomMargin("node"))

        if (currentDimensions.width > nodeNameDef.bbox().width) {
            nodeNameDef.dx((currentDimensions.width - nodeNameDef.bbox().width)/2)
        }

        currentDimensions.width += (this.style.getLeftMargin("node") + this.style.getRightMargin("node"))
    
        nodeGroup.rect(currentDimensions.width, currentDimensions.height).move(borderAdjustment.left, borderAdjustment.top)

        this.uptodate = true
    }

}

export { Node }
