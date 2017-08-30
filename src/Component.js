'use strict'

import { BallConnector } from "./BallConnector.js"
import { SocketConnector } from "./SocketConnector.js"

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

export class Component {

    constructor(svg, componentDescription, style, layout) {
        this.componentDescription = componentDescription
        this.ballConnectors = [ ]
        this.socketConnectors = [ ]

        var componentWithConnectorsGroup = svg.group().addClass("UMLComponent")

        let offset = 0
        if (componentDescription.interfaces) {
            for (let i = 0; i < componentDescription.interfaces.length; i++) {
                let ballConnector = new BallConnector(svg.defs(), componentWithConnectorsGroup, componentDescription.interfaces[i].name)
                this.ballConnectors.push(ballConnector)
                offset = Math.max(offset, ballConnector.width)
            }
        }
        if (componentDescription.dependencies) {
            for (let i = 0; i < componentDescription.dependencies.length; i++) {
                let socketConnector = new SocketConnector(svg.defs(), componentWithConnectorsGroup, componentDescription.dependencies[i].name)
                this.socketConnectors.push(socketConnector)
            }
        }

        var componentGroup = componentWithConnectorsGroup.group()

        let position = {
            x: 0,
            y: 0
        }

        if ((layout != null) && layout.componentpositions[componentDescription.name]) {
            position = layout.componentpositions[componentDescription.name]
        }

        let currentDimensions = {
            width: 0,
            height: 0
        }

        currentDimensions.height = style.getTopMargin("component")

        let stereotype = new Stereotype(componentGroup)
        currentDimensions.height += stereotype.height

        var componentNameDef = componentGroup.defs().text(componentDescription.name).addClass("UMLComponentName").move(position.x + offset + style.getLeftMargin("component"), position.y + currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, componentNameDef.bbox().width)
        currentDimensions.height += (componentNameDef.bbox().height + style.getBottomMargin("component"))

        currentDimensions.width += (style.getLeftMargin("component") + style.getRightMargin("component"))
    
        componentGroup.rect(currentDimensions.width, currentDimensions.height).move(position.x + offset, position.y)
        stereotype.move(position.x + offset + (currentDimensions.width - style.getRightMargin("component") - stereotype.width), position.y + style.getTopMargin("component"))
        stereotype.draw()
        componentGroup.use(componentNameDef)

        // Offset by 1 to leave some space because the border stroke width is 2
        componentGroup.move(1, 1)

        for (let i = 0; i < this.ballConnectors.length; i++) {
            this.ballConnectors[i].moveConnectionPoint(position.x, position.y + currentDimensions.height/2)
            this.ballConnectors[i].draw()
        }

        for (let i = 0; i < this.socketConnectors.length; i++) {
            this.socketConnectors[i].moveConnectionPoint(position.x + currentDimensions.width + offset, position.y + currentDimensions.height/2)
            this.socketConnectors[i].draw()
        }
    }

    getBallConnectionPoint(name) {
        for (let i = 0; i < this.ballConnectors.length; i++) {
            return this.ballConnectors[i].getAssemblyConnectionPoint()
        }
    }

    getSocketConnectionPoint(name) {
        for (let i = 0; i < this.socketConnectors.length; i++) {
            return this.socketConnectors[i].getAssemblyConnectionPoint()
        }
    }

}
