/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import { DiagramElement } from "./DiagramElement"
import { ConnectionPoint } from "./ConnectionPoint"
import { ConnectionPointPosition } from "./ConnectionPointPosition"
import { Errors } from "./Errors"

/**
  A use case on a use case diagram.

  @extends DiagramElement
*/
class UseCase extends DiagramElement {
    errors: Errors
    shapeLayer
    textLayer
    useCaseDescription
    connectionPointsRectangle

    constructor(svg, id: string, useCaseDescription, errors: Errors) {
        super(svg, "usecase", id)
        this.errors = errors
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.useCaseDescription = useCaseDescription
        this.connectionPointsRectangle = null
    }

    createConnectionPoint(svg) {
        let newPoint = new ConnectionPoint(svg, this, ConnectionPointPosition.BottomCenter, this.errors)
        return newPoint
    }

    doUpdate() {
        let borderAdjustment = {
            top: this.y,
            left: this.x
        }

        let shapeGroup = this.shapeLayer.group().addClass("UMLUseCase")
        let textGroup = this.textLayer.group()
        let textDef = textGroup.text(this.useCaseDescription.title)
        let ellipse = shapeGroup.ellipse(1.2*textDef.bbox().width, 3*textDef.bbox().height).move(borderAdjustment.left + 1, borderAdjustment.top + 1)
        textDef.move(borderAdjustment.left + 1 + 0.1*textDef.bbox().width, borderAdjustment.top + 1 + textDef.bbox().height)

        this.connectionPointsRectangle = ellipse.bbox()
    }

    doGetConnectionPointsRectangle() {
        return this.connectionPointsRectangle 
    }

}

export { UseCase }
