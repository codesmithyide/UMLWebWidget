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
        
        var nodeGroup = svg.group().addClass("UMLNode")
    
        let currentDimensions = { 
            width: 0,
            height: 0
        }
    
        currentDimensions.height = style.getTopMargin("node")

        var nodeNameDef = svg.defs().text(nodeDescription.name).addClass("UMLNodeName").move(style.getLeftMargin("node"), currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, nodeNameDef.bbox().width)
        currentDimensions.height += (nodeNameDef.bbox().height + style.getBottomMargin("node"))

        if (currentDimensions.width > nodeNameDef.bbox().width) {
            nodeNameDef.dx((currentDimensions.width - nodeNameDef.bbox().width)/2)
        }

        currentDimensions.width += (style.getLeftMargin("node") + style.getRightMargin("node"))
    
        nodeGroup.rect(currentDimensions.width, currentDimensions.height).move(0,0)
        nodeGroup.use(nodeNameDef)

        // Offset by 1 to leave some space because the border stroke width is 2
        nodeGroup.move(1,1)

        /*if (layout.nodes[nodeDescription.name]) {
            let position = layout.nodes[nodeDescription.name].position
            nodeGroup.move(position.x, position.y)
        }*/
    }

}

export { Node }
