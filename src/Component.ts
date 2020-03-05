/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import { DiagramElement, DiagramElementType } from "./DiagramElement"
import { CSSClassName } from "./CSSClassNames"
import { BallConnector } from "./BallConnector"
import { SocketConnector } from "./SocketConnector"
import { ConnectionPoint } from "./ConnectionPoint"
import { ConnectionPointPosition } from "./ConnectionPointPosition"
import { SVGUtils } from "./SVGUtils"
import { SVGLayer} from "./SVGLayer"
import { IDGenerator } from "./IDGenerator"
import { Errors } from "./Errors"

class Stereotype {
    svgParentGroup
    x: number
    y: number
    width: number
    height: number

    constructor(svgParentGroup) {
        this.svgParentGroup = svgParentGroup
        this.x = 0
        this.y = 0
        this.width = 15
        this.height = 20
    }

    move(x: number, y: number) {
        this.x = x
        this.y = y
    }

    draw() {
        let stereoTypeGroup = SVGUtils.Group(this.svgParentGroup).addClass(CSSClassName.Component_Stereotype)
        SVGUtils.Rectangle(stereoTypeGroup, 4 + this.x, this.y, 11, 15)
        SVGUtils.Rectangle(stereoTypeGroup, this.x, this.y + 3, 8, 3)
        SVGUtils.Rectangle(stereoTypeGroup, this.x, this.y + 9, 8, 3)
    }
}

/**
 * A component on a component diagram.
 *
 * @extends DiagramElement
 */
class Component extends DiagramElement {
    errors: Errors
    shapeLayer: SVGLayer
    textLayer: SVGLayer
    svg
    componentDescription
    style
    ballConnectors
    socketConnectors

    constructor(svg, idGenerator: IDGenerator, componentDescription, style, errors: Errors) {
        super(svg, DiagramElementType.Component, idGenerator.createID("component--" + componentDescription.name))
        this.errors = errors
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.svg = svg
        this.componentDescription = componentDescription
        this.style = style
        this.ballConnectors = [ ]
        this.socketConnectors = [ ]

        if (this.componentDescription.interfaces) {
            for (let i = 0; i < this.componentDescription.interfaces.length; i++) {
                let ballConnector = new BallConnector(this.svg, this, this.componentDescription.interfaces[i].name)
                this.ballConnectors.push(ballConnector)
            }
        }
        if (this.componentDescription.dependencies) {
            for (let i = 0; i < this.componentDescription.dependencies.length; i++) {
                let socketConnector = new SocketConnector(this.svg, this, this.componentDescription.dependencies[i].name)
                this.socketConnectors.push(socketConnector)
            }
        }
    }

    draw(): void {
        this.update()
        let g = this.layers.svg.group().addClass(CSSClassName.Component)
        g.id(this.id)
        this.layers.getLayer("shape").write(g)
        this.layers.getLayer("text").write(g)
    }

    getSocketConnector(name) {
        for (var i = 0; i < this.socketConnectors.length; i++) {
            if (this.socketConnectors[i].name == name) {
                return this.socketConnectors[i]
            }
        }
        return null
    }

    getBallConnector(name) {
        for (var i = 0; i < this.ballConnectors.length; i++) {
            if (this.ballConnectors[i].name == name) {
                return this.ballConnectors[i]
            }
        }
        return null
    }

    createDependencyConnectionPoint(svg, interfaceName) {
        let newPoint = new ConnectionPoint(svg, this.getSocketConnector(interfaceName),
            ConnectionPointPosition.BottomCenter, this.errors)
        return newPoint
    }

    createInterfaceConnectionPoint(svg, interfaceName) {
        let newPoint = new ConnectionPoint(svg, this.getBallConnector(interfaceName),
            ConnectionPointPosition.BottomCenter, this.errors)
        return newPoint
    }

    doUpdate() {
        this.layers.clearEachLayer()

        var componentGroup = this.shapeLayer.group().addClass("UMLComponent")

        let offset = 0
        for (let i = 0; i < this.ballConnectors.length; i++) {
            offset = Math.max(offset, this.ballConnectors[i].width)
        }

        let position = {
            x: this.x + 1,
            y: this.y + 1
        }

        let currentDimensions = {
            width: 0,
            height: 0
        }

        currentDimensions.height = this.style.getTopMargin("component")

        let stereotype = new Stereotype(componentGroup)
        currentDimensions.height += stereotype.height

        var componentNameGroup = this.textLayer.group().addClass("UMLComponentName")
        var componentNameDef = SVGUtils.Text(componentNameGroup, position.x + offset + this.style.getLeftMargin("component"), position.y + currentDimensions.height, this.componentDescription.name).addClass("UMLComponentName")
        currentDimensions.width = Math.max(currentDimensions.width, componentNameDef.bbox().width)
        currentDimensions.height += (componentNameDef.bbox().height + this.style.getBottomMargin("component"))

        currentDimensions.width += (this.style.getLeftMargin("component") + this.style.getRightMargin("component"))
    
        SVGUtils.Rectangle(componentGroup, position.x + offset, position.y, currentDimensions.width, currentDimensions.height)
        stereotype.move(position.x + offset + (currentDimensions.width - this.style.getRightMargin("component") - stereotype.width), position.y + this.style.getTopMargin("component"))
        stereotype.draw()
        
        for (let i = 0; i < this.ballConnectors.length; i++) {
            this.ballConnectors[i].moveConnectionPoint(position.x, position.y + currentDimensions.height/2)
            this.layers.merge(this.ballConnectors[i].getLayers())
        }

        for (let i = 0; i < this.socketConnectors.length; i++) {
            this.socketConnectors[i].moveConnectionPoint(position.x + currentDimensions.width + offset, position.y + currentDimensions.height/2)
            this.layers.merge(this.socketConnectors[i].getLayers())
        }
    }

    getBallConnectionPoint(name) {
        if (!this.uptodate) {
            this.update()
        }
        for (let i = 0; i < this.ballConnectors.length; i++) {
            return this.ballConnectors[i].getAssemblyConnectionPoint()
        }
    }

    getSocketConnectionPoint(name) {
        if (!this.uptodate) {
            this.update()
        }
        for (let i = 0; i < this.socketConnectors.length; i++) {
            return this.socketConnectors[i].getAssemblyConnectionPoint()
        }
    }

}

export { Component }
