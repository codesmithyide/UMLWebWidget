'use strict'

import { DiagramElement } from "./DiagramElement.ts"
import { ConnectionPoint } from "./ConnectionPoint.js"
import { DrawingUtilities } from "./DrawingUtilities.js"

class ClassTemplate extends DiagramElement {
    shapeLayer
    textLayer
    classTemplateDescription
    style
    connectionPointsRectangle
    connectionPoints

    constructor(svg, id, classTemplateDescription, style) {
        super(svg, "classtemplate", id)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.classTemplateDescription = classTemplateDescription
        this.style = style
        this.connectionPointsRectangle = null

        // List of connection points that are connected to
        // this class template
        this.connectionPoints = [ ]
    }

    /**
      Returns a connection point that can be used to connect
      a connector to this class template. The new connection
      point is added to this.connectionPoints.
    */
    createConnectionPoint(svg) {
        let newPoint = new ConnectionPoint(svg, this)
        this.connectionPoints.push(newPoint)
        return newPoint
    }

    doUpdate() {
        var classTemplateGroup = this.shapeLayer.group().addClass("UMLClassTemplate")

        let currentDimensions = { 
            width: 0,
            height: 0
        }

        let borderAdjustment = {
            top: this.y + 1,
            left: this.x + 1
        }
    
        var parametersTextGroup = this.textLayer.group().addClass("UMLClassTemplateParameters")
        var parametersText = parametersTextGroup.text(this.classTemplateDescription.parameters[0]).move(borderAdjustment.left + this.style.getLeftMargin("classtemplateparameters"), borderAdjustment.top + this.style.getTopMargin("classtemplateparameters"))
        let parametersRectWidth = (this.style.getLeftMargin("classtemplateparameters") + this.style.getRightMargin("classtemplateparameters") + parametersText.bbox().width)
        let parametersRectHeight = (this.style.getTopMargin("classtemplateparameters") + this.style.getBottomMargin("classtemplateparameters") + parametersText.bbox().height)

        let y1 = (borderAdjustment.top + this.style.getTopMargin("classtemplateparameters") + (parametersText.bbox().height / 2))
        let y2 = (y1 + this.style.getTopMargin("classtemplate"))

        let classTemplateNameGroup = this.textLayer.group().addClass("UMLClassName")
        let classTemplateName = classTemplateNameGroup.text(this.classTemplateDescription.name).move(borderAdjustment.left + this.style.getLeftMargin("classtemplate"), y2)
        currentDimensions.width = Math.max(currentDimensions.width, classTemplateName.bbox().width)
        currentDimensions.height = (this.style.getTopMargin("classtemplate") + classTemplateName.bbox().height + this.style.getBottomMargin("classtemplate"))

        let line1YPos = (borderAdjustment.top + currentDimensions.height + (parametersText.bbox().height / 2))

        let attributesCompartmentDimensions = DrawingUtilities.addClassCompartmentText(borderAdjustment.left, line1YPos, this.textLayer, this.style, this.classTemplateDescription.attributes, "UMLClassAttributes")
        currentDimensions.width = Math.max(currentDimensions.width, attributesCompartmentDimensions.width)
        currentDimensions.height += attributesCompartmentDimensions.height

        let line2YPos = (borderAdjustment.top + currentDimensions.height + (parametersText.bbox().height / 2))

        let operationsCompartmentDimensions = DrawingUtilities.addClassCompartmentText(borderAdjustment.left, line2YPos, this.textLayer, this.style, this.classTemplateDescription.operations, "UMLClassOperations")
        currentDimensions.width = Math.max(currentDimensions.width, operationsCompartmentDimensions.width)
        currentDimensions.height += operationsCompartmentDimensions.height

        // According to the UML standard the class name must be
        // centered so center it
        if (currentDimensions.width > classTemplateName.bbox().width) {
            classTemplateName.dx((currentDimensions.width - classTemplateName.bbox().width)/2)
        }

        currentDimensions.width += (this.style.getLeftMargin("classtemplate") + this.style.getRightMargin("classtemplate"))
        let rect = classTemplateGroup.rect(currentDimensions.width, currentDimensions.height).move(borderAdjustment.left, y1)
        classTemplateGroup.line(borderAdjustment.left, line1YPos, borderAdjustment.left + currentDimensions.width, line1YPos)
        classTemplateGroup.line(borderAdjustment.left, line2YPos, borderAdjustment.left + currentDimensions.width, line2YPos)

        parametersText.dx(currentDimensions.width - (parametersRectWidth / 2))

        let parametersRect = classTemplateGroup.rect(parametersRectWidth, parametersRectHeight).move(borderAdjustment.left + currentDimensions.width - (parametersRectWidth / 2), borderAdjustment.top).attr("stroke-dasharray", "4, 4")

        this.connectionPointsRectangle = rect.bbox()
    }

    doGetConnectionPointsRectangle() {
        return this.connectionPointsRectangle 
    }

}

export { ClassTemplate }
