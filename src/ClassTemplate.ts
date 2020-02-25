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
import { DrawingUtilities } from "./DrawingUtilities"
import { SVGUtils } from "./SVGUtils"
import { Errors } from "./Errors"

class ClassTemplate extends DiagramElement {
    errors: Errors
    shapeLayer
    textLayer
    classTemplateDescription
    style
    connectionPointsRectangle
    connectionPoints

    constructor(svg, id, classTemplateDescription, style, errors: Errors) {
        super(svg, DiagramElementType.ClassTemplate, id)
        this.errors = errors
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.classTemplateDescription = classTemplateDescription
        this.style = style
        this.connectionPointsRectangle = null

        // List of connection points that are connected to
        // this class template
        this.connectionPoints = [ ]
    }

    write(): void {
        this.update()
        let g = this.layers.svg.group().addClass(CSSClassName.ClassTemplate)
        g.id(this.id)
        this.layers.getLayer("shape").write(g)
        this.layers.getLayer("text").write(g)
    }

    /**
     * Returns a connection point that can be used to connect a connector to this class template. The new connection
     * point is added to this.connectionPoints.
     */
    createConnectionPoint(svg) {
        let newPoint = new ConnectionPoint(svg, this, ConnectionPointPosition.BottomCenter, this.errors)
        this.connectionPoints.push(newPoint)
        return newPoint
    }

    doUpdate() {
        var classTemplateGroup = this.shapeLayer.group().addClass(CSSClassName.ClassTemplate)

        let currentDimensions = { 
            width: 0,
            height: 0
        }

        let borderAdjustment = {
            top: this.y + 1,
            left: this.x + 1
        }
    
        var parametersTextGroup = this.textLayer.group().addClass("UMLClassTemplateParameters")
        var parametersText = SVGUtils.Text(parametersTextGroup, borderAdjustment.left + this.style.getLeftMargin("classtemplateparameters"), borderAdjustment.top + this.style.getTopMargin("classtemplateparameters"), this.classTemplateDescription.parameters[0])
        let parametersRectWidth = (this.style.getLeftMargin("classtemplateparameters") + this.style.getRightMargin("classtemplateparameters") + parametersText.bbox().width)
        let parametersRectHeight = (this.style.getTopMargin("classtemplateparameters") + this.style.getBottomMargin("classtemplateparameters") + parametersText.bbox().height)

        let y1 = (borderAdjustment.top + this.style.getTopMargin("classtemplateparameters") + (parametersText.bbox().height / 2))
        let y2 = (y1 + this.style.getTopMargin(CSSClassName.ClassTemplate))

        let classTemplateNameGroup = this.textLayer.group().addClass("UMLClassName")
        let classTemplateName = SVGUtils.Text(classTemplateNameGroup, borderAdjustment.left + this.style.getLeftMargin(CSSClassName.ClassTemplate), y2, this.classTemplateDescription.name)
        currentDimensions.width = Math.max(currentDimensions.width, classTemplateName.bbox().width)
        currentDimensions.height = (this.style.getTopMargin(CSSClassName.ClassTemplate) + classTemplateName.bbox().height + this.style.getBottomMargin(CSSClassName.ClassTemplate))

        let line1YPos = (borderAdjustment.top + currentDimensions.height + (parametersText.bbox().height / 2))

        let attributesCompartmentDimensions = DrawingUtilities.addClassCompartmentText(borderAdjustment.left, line1YPos, this.textLayer, this.style, this.classTemplateDescription.attributes, "UMLClassAttributes")
        currentDimensions.width = Math.max(currentDimensions.width, attributesCompartmentDimensions.width)
        currentDimensions.height += attributesCompartmentDimensions.height

        let line2YPos = (borderAdjustment.top + currentDimensions.height + (parametersText.bbox().height / 2))

        let operationsCompartmentDimensions = DrawingUtilities.addClassCompartmentText(borderAdjustment.left, line2YPos, this.textLayer, this.style, this.classTemplateDescription.operations, "UMLClassOperations")
        currentDimensions.width = Math.max(currentDimensions.width, operationsCompartmentDimensions.width)
        currentDimensions.height += operationsCompartmentDimensions.height

        // According to the UML standard the class name must be centered so center it
        if (currentDimensions.width > classTemplateName.bbox().width) {
            classTemplateName.dx((currentDimensions.width - classTemplateName.bbox().width)/2)
        }

        currentDimensions.width += (this.style.getLeftMargin(CSSClassName.ClassTemplate) + this.style.getRightMargin(CSSClassName.ClassTemplate))
        let rect = SVGUtils.Rectangle(classTemplateGroup, borderAdjustment.left, y1, currentDimensions.width, currentDimensions.height)
        SVGUtils.Line(classTemplateGroup, borderAdjustment.left, line1YPos, borderAdjustment.left + currentDimensions.width, line1YPos)
        SVGUtils.Line(classTemplateGroup, borderAdjustment.left, line2YPos, borderAdjustment.left + currentDimensions.width, line2YPos)

        parametersText.dx(currentDimensions.width - (parametersRectWidth / 2))

        let parametersRect = SVGUtils.Rectangle(classTemplateGroup, borderAdjustment.left + currentDimensions.width - (parametersRectWidth / 2), borderAdjustment.top, parametersRectWidth, parametersRectHeight).attr("stroke-dasharray", "4, 4")

        this.connectionPointsRectangle = rect.bbox()
    }

    doGetConnectionPointsRectangle() {
        return this.connectionPointsRectangle 
    }

}

export { ClassTemplate }
