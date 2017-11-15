'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { SVGLayerSet } from "./SVGLayerSet.js"
import { ConnectionPoint } from "./ConnectionPoint.js"
import { DrawingUtilities } from "./DrawingUtilities.js"

/** 
  A class box. 

  @extends DiagramElement
  @property {ConnectionPoint[]} this.connectionPoints - The class
    keeps a list of connection points where other elements are 
    connected so they can be notified of relevant changes to the
    class box.
*/
class ClassBox extends DiagramElement {

    constructor(svg, id, classDescription, canMove, style) {
        super(svg, id)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.classDescription = classDescription
        this.canMove = canMove
        this.style = style
        this.connectionPointsRectangle = null

        // List of connection points that are connected to
        // this class box
        this.connectionPoints = [ ]
    }

    /**
      Returns a connection point that can be used to connect
      a connector to this class box. The new connection
      point is added to this.connectionPoints.
    */
    createConnectionPoint(svg) {
        let newPoint = new ConnectionPoint(svg, this)
        this.connectionPoints.push(newPoint)
        return newPoint
    }

    doUpdate() {
        createDef(this, this.classDescription, this.canMove, this.style)
    }

    doGetConnectionPointsRectangle() {
        return this.connectionPointsRectangle 
    }
        
    fire(evt) {
        if (evt == "positionchanged") {
            for (let i = 0; i < this.connectionPoints.length; i++) {
                this.connectionPoints[i].draw()        
            }
        }
    }

}

function createDef(self, classInfo, canMove, style) {
    var classGroup = self.shapeLayer.group().addClass("UMLClassBox")

    let currentDimensions = { 
        width: 0,
        height: 0
    }

    let borderAdjustment = {
        top: self.y + 1,
        left: self.x + 1
    }
    
    currentDimensions.height = style.getTopMargin("classbox")

    var classNameGroup = self.textLayer.group().addClass("UMLClassName")
    var className = classNameGroup.text(classInfo.name).move(borderAdjustment.left + style.getLeftMargin("classbox"), borderAdjustment.top + currentDimensions.height)
    currentDimensions.width = Math.max(currentDimensions.width, className.bbox().width)
    currentDimensions.height += (className.bbox().height + style.getBottomMargin("classbox"))

    var line1YPos = (borderAdjustment.top + currentDimensions.height)

    let attributesCompartmentDimensions = DrawingUtilities.addClassCompartmentText(borderAdjustment.left, line1YPos, self.textLayer, style, classInfo.attributes, "UMLClassAttributes")
    currentDimensions.width = Math.max(currentDimensions.width, attributesCompartmentDimensions.width)
    currentDimensions.height += attributesCompartmentDimensions.height

    var line2YPos = (borderAdjustment.top + currentDimensions.height)

    let operationsCompartmentDimensions = DrawingUtilities.addClassCompartmentText(borderAdjustment.left, line2YPos, self.textLayer, style, classInfo.operations, "UMLClassOperations")
    currentDimensions.width = Math.max(currentDimensions.width, operationsCompartmentDimensions.width)
    currentDimensions.height += operationsCompartmentDimensions.height

    // According to the UML standard the class name must be
    // centered so center it
    if (currentDimensions.width > className.bbox().width) {
        className.dx((currentDimensions.width - className.bbox().width)/2)
    }

    currentDimensions.width += (style.getLeftMargin("classbox") + style.getRightMargin("classbox"))
    
    let rect = classGroup.rect(currentDimensions.width, currentDimensions.height).move(borderAdjustment.left, borderAdjustment.top)
    classGroup.line(borderAdjustment.left, line1YPos, borderAdjustment.left + currentDimensions.width, line1YPos)
    classGroup.line(borderAdjustment.left, line2YPos, borderAdjustment.left + currentDimensions.width, line2YPos)

    self.connectionPointsRectangle = rect.bbox()

    if (canMove) {
        classGroup.draggable(true)
        classGroup.on('dragmove.namespace', function(evt) {
            self.fire('positionchanged')
        })
        classGroup.on('dragend.namespace', function(evt) {
            self.fire('positionchanged')
        })
    }

    return classGroup
}

export { ClassBox }
