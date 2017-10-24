'use strict'

import { DiagramElement } from "./DiagramElement.js"

class ClassTemplate extends DiagramElement {

    constructor(svg, id, classTemplateDescription, style) {
        super(svg, id)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.classTemplateDescription = classTemplateDescription
        this.style = style
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
    
        currentDimensions.height = this.style.getTopMargin("classtemplate")

        var classTemplateNameGroup = this.textLayer.group().addClass("UMLClassName")
        var classTemplateName = classTemplateNameGroup.text(this.classTemplateDescription.name).move(borderAdjustment.left + this.style.getLeftMargin("classtemplate"), borderAdjustment.top + currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, classTemplateName.bbox().width)
        currentDimensions.height += (classTemplateName.bbox().height + this.style.getBottomMargin("classtemplate"))

        currentDimensions.width += (this.style.getLeftMargin("classtemplate") + this.style.getRightMargin("classtemplate"))
    
        let rect = classTemplateGroup.rect(currentDimensions.width, currentDimensions.height).move(borderAdjustment.left, borderAdjustment.top)
    }

}

export { ClassTemplate }
