'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { BallConnector } from "./BallConnector.js"
import { SocketConnector } from "./SocketConnector.js"
import { ConnectionPoint } from "./ConnectionPoint.js"

class Stereotype {

    constructor(svgParentGroup) {
        this.svgParentGroup = svgParentGroup
        this.x = 0
        this.y = 0
        this.width = 15
        this.height = 20
    }

    move(x, y) {
        this.x = x
        this.y = y
    }

    draw() {
        let stereoTypeGroup = this.svgParentGroup.group().addClass("UMLComponentStereotype")
        stereoTypeGroup.rect(11, 15).move(4 + this.x, this.y)
        stereoTypeGroup.rect(8, 3).move(this.x, this.y + 3)
        stereoTypeGroup.rect(8, 3).move(this.x, this.y + 9)
    }

}

/**
  A component on a component diagram.

  @extends DiagramElement
*/
class Component extends DiagramElement {

    constructor(svg, id, componentDescription, style) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.svg = svg
        this.id = id
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
        let newPoint = new ConnectionPoint(svg, this.getSocketConnector(interfaceName))
        return newPoint
    }

    createInterfaceConnectionPoint(svg, interfaceName) {
        let newPoint = new ConnectionPoint(svg, this.getBallConnector(interfaceName))
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
        var componentNameDef = componentNameGroup.text(this.componentDescription.name).addClass("UMLComponentName").move(position.x + offset + this.style.getLeftMargin("component"), position.y + currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, componentNameDef.bbox().width)
        currentDimensions.height += (componentNameDef.bbox().height + this.style.getBottomMargin("component"))

        currentDimensions.width += (this.style.getLeftMargin("component") + this.style.getRightMargin("component"))
    
        componentGroup.rect(currentDimensions.width, currentDimensions.height).move(position.x + offset, position.y)
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
