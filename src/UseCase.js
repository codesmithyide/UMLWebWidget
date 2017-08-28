'use strict'

import { DiagramElement } from "./DiagramElement.js"

/**
  A use case on a use case diagram.

  @extends DiagramElement
*/
class UseCase extends DiagramElement {

    constructor(svg, id, useCaseDescription) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.id = id
        this.useCaseDescription = useCaseDescription
    }

    update() {
        let borderAdjustment = {
            top: this.y,
            left: this.x
        }

        let shapeGroup = this.shapeLayer.group().addClass("UMLUseCase")
        let textDef = this.textLayer.text(this.useCaseDescription.title)
        shapeGroup.ellipse(1.2*textDef.bbox().width, 3*textDef.bbox().height).move(borderAdjustment.left + 1, borderAdjustment.top + 1)
        textDef.move(borderAdjustment.left + 1 + 0.1*textDef.bbox().width, borderAdjustment.top + 1 + textDef.bbox().height)
    }

}

export { UseCase }
