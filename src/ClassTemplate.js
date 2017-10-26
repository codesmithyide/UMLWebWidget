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

        var classTemplateNameGroup = this.textLayer.group().addClass("UMLClassName")
        var classTemplateName = classTemplateNameGroup.text(this.classTemplateDescription.name).move(borderAdjustment.left + this.style.getLeftMargin("classtemplate"), y2)
        
        let width = classTemplateName.bbox().width + (this.style.getLeftMargin("classtemplate") + this.style.getRightMargin("classtemplate"))
        let height = (this.style.getTopMargin("classtemplate") + classTemplateName.bbox().height + this.style.getBottomMargin("classtemplate"))
        let rect = classTemplateGroup.rect(width, height).move(borderAdjustment.left, y1)

        parametersText.dx(width - (parametersRectWidth / 2))

        let parametersRect = classTemplateGroup.rect(parametersRectWidth, parametersRectHeight).move(borderAdjustment.left + width - (parametersRectWidth / 2), borderAdjustment.top)
    }

}

export { ClassTemplate }
