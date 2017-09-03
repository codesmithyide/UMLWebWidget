'use strict'

import { UMLWebWidgetError } from "./UMLWebWidgetError.js"
import { Settings } from "./Settings.js"
import { Style } from "./Style.js"
import { LayoutManager } from "./LayoutManager.js"
import { ClassBox } from "./ClassBox.js"
import { Component } from "./Component.js"
import { Lifeline } from "./Lifeline.js"
import { Node } from "./Node.js"
import { Actor } from "./Actor.js"
import { UseCase } from "./UseCase.js"
import { Connector } from "./Connector.js"
import { SVGLayer } from "./SVGLayer.js"

/**
  This class is the entry point for all the functionality provided
  by the CodeSmithy UMLWebWidget.
*/
export class Diagram {

    constructor(settings) {
        this.settings = new Settings(settings)

        // The description of the UML diagram in JSON
        // format. This will then be parsed to create
        // the graphical form.
        this.diagramDescription = { }

        // The list of all UML class boxes present on the
        // diagram
        this.classboxes = new Map()

        // The list of all UML components present on the
        // diagram
        this.components = new Map()

        // The list of all UML lifelines present on the
        // diagram
        this.lifelines = new Map()

        // The list of all UML actors present on the
        // diagram
        this.actors = new Map()

        // The list of all UML use cases present on the
        // diagram
        this.usecases = new Map()
    }

    // Create a diagram from a div element in the HTML document.
    // The div element must contain a JSON object with the UML
    // diagram information. The contents of the div will be replaced
    // by the diagram.
    // - divId: this is the id of the div element to use, it should be the id
    //   without any '#' prefix.
    createFromDiv(divId, layout) {
        let jsonDiagramDescription = JSON.parse($('#' + divId).text())
        $('#' + divId).empty()
        var svg = SVG(divId).size(this.settings.width, this.settings.height)
        this.createFromJSON(svg, jsonDiagramDescription, layout)
    }

    createFromJSON(svg, jsonDiagramDescription, layout) {
        if (jsonDiagramDescription == null) {
            jsonDiagramDescription = { }
        }
        this.diagramDescription = jsonDiagramDescription
        let style = new Style()

        if (this.diagramDescription.elements) {
            this.drawDiagram(svg, this.diagramDescription.elements, style, layout)
        }
    }

    drawDiagram(svg, description, style, layout) {
        let layoutManager = new LayoutManager(layout)

        let lifelines = []
        let components = []
        let nodes = []
        let actors = []
        let usecases = []
        let connectors = []
        let messages = []
        let assemblyconnectors = []

        // Construct the elements
        for (var i = 0; i < description.length; i++) {
            let item = description[i]
            if (item.class) {
                let className = item.class.name
                let newClassBox = new ClassBox(svg, className, item.class, this.settings.canMove, style)
                this.classboxes.set(className, newClassBox)
            } else if (item.lifeline) {
                let newLifeline = new Lifeline(svg, item.lifeline.name, item.lifeline, style)
                this.lifelines[item.lifeline.name] = newLifeline
                lifelines.push(newLifeline)
            } else if (item.component) {
                let newComponent = new Component(svg, item.component.name, item.component, style)
                this.components[item.component.name] = newComponent
                components.push(newComponent)
            } else if (item.node) {
                let newNode = new Node(svg, item.node.name, item.node, style)
                nodes.push(newNode)
            } else if (item.actor) {
                let newActor = new Actor(svg, item.actor.name, item.actor)
                this.actors[item.actor.name] = newActor
                actors.push(newActor)
            } else if (item.usecase) {
                let newUseCase = new UseCase(svg, item.usecase.title, item.usecase)
                this.usecases[item.usecase.title] = newUseCase
                usecases.push(newUseCase)
            } else if (item.relationship) {
                let classbox1
                let classbox2
                if (item.relationship.type == "inheritance") {
                    classbox1 = this.classboxes.get(item.relationship.derivedclass)
                    classbox2 = this.classboxes.get(item.relationship.baseclass)
                } else if ((item.relationship.type == "composition") || (item.relationship.type == "aggregation")) {
                    classbox1 = this.classboxes.get(item.relationship.containedclass)
                    classbox2 = this.classboxes.get(item.relationship.containingclass)
                }
                let connectionPoint1 = classbox1.createConnectionPoint(svg)
                let connectionPoint2 = classbox2.createConnectionPoint(svg)
                let newConnector = new Connector(svg, item.relationship.type, connectionPoint1, connectionPoint2)
                connectors.push(newConnector)
            } else if (item.messages) {
                for (var j = 0; j < item.messages.length; j++) {
                    let message = item.messages[j]
                    let newConnector
                    if (message.synchronousmessage) {
                        let lifeline1 = this.lifelines[message.synchronousmessage.caller]
                        let lifeline2 = this.lifelines[message.synchronousmessage.callee]
                        let connectionPoint1 = lifeline1.createConnectionPoint(svg)
                        let connectionPoint2 = lifeline2.createConnectionPoint(svg)
                        newConnector = new Connector(svg, "synchronousmessage", connectionPoint1, connectionPoint2, message.synchronousmessage.name)
                    } else if (message.returnmessage) {
                        let lifeline1 = this.lifelines[message.returnmessage.callee]
                        let lifeline2 = this.lifelines[message.returnmessage.caller]
                        let connectionPoint1 = lifeline1.createConnectionPoint(svg)
                        let connectionPoint2 = lifeline2.createConnectionPoint(svg)
                        newConnector = new Connector(svg, "returnmessage", connectionPoint1, connectionPoint2, "")
                    }
                    messages.push(newConnector)
                }
            } else if (item.assemblyconnector) {
                let consumerComponent = this.components[item.assemblyconnector.consumer]
                let providerComponent = this.components[item.assemblyconnector.provider]
                let connectionPoint1 = consumerComponent.createDependencyConnectionPoint(svg, item.assemblyconnector.interface)
                let connectionPoint2 = providerComponent.createInterfaceConnectionPoint(svg, item.assemblyconnector.interface)
                let newConnector = new Connector(svg, "assemblyconnector", connectionPoint1, connectionPoint2)
                assemblyconnectors.push(newConnector)
            } else if (item.association) {
                let connectionPoint1 = this.actors[item.association.actor].createConnectionPoint(svg)
                let connectionPoint2 = this.usecases[item.association.usecase].createConnectionPoint(svg)
                let newConnector = new Connector(svg, "usecaseassociation", connectionPoint1, connectionPoint2)
                newConnector.getLayers().getLayer("shape").write()
                newConnector.getLayers().getLayer("text").write()
            }
        }

        layoutManager.doLayout(this)
        dolayout(layoutManager, lifelines, components, nodes, actors, usecases, connectors, messages, assemblyconnectors)

        draw(this.classboxes.values(), lifelines, components, nodes, actors, usecases, connectors, messages, assemblyconnectors)
    }

}

function dolayout(layoutManager, lifelines, components, nodes, actors, usecases, connectors, messages, assemblyconnectors) {
    if (lifelines != null) {
        for (var i = 0; i < lifelines.length; i++) {
            layoutManager.setElementPosition(lifelines[i])
        }
    }
    if (components != null) {
        for (var i = 0; i < components.length; i++) {
            layoutManager.setElementPosition(components[i])
        }
    }
    if (nodes != null) {
        for (var i = 0; i < nodes.length; i++) {
            layoutManager.setElementPosition(nodes[i])
        }
    }
    if (actors != null) {
        for (var i = 0; i < actors.length; i++) {
        layoutManager.setElementPosition(actors[i])
        }
    }
    if (usecases != null) {
        for (var i = 0; i < usecases.length; i++) {
            layoutManager.setElementPosition(usecases[i])
        }
    }
    if (connectors != null) {
        layoutManager.layoutConnectors(connectors)
    }
    if (messages != null) {
        layoutManager.layoutMessages(lifelines, messages)
    }
    if (assemblyconnectors != null) {
        for (var i = 0; i < assemblyconnectors.length; i++) {
            let connector = assemblyconnectors[i]
            connector.connectionPoint1.move(connector.connectionPoint1.element.component.getSocketConnectionPoint("").x, connector.connectionPoint1.element.component.getSocketConnectionPoint("").y)
            connector.connectionPoint2.move(connector.connectionPoint2.element.component.getBallConnectionPoint("").x, connector.connectionPoint2.element.component.getBallConnectionPoint("").y)
        }
    }
}

function draw(classboxes, lifelines, components, nodes, actors, usecases, connectors, messages, assemblyconnectors) {
    if (classboxes != null) {
        for (let classbox of classboxes) {
            classbox.getLayers().getLayer("shape").write()
            classbox.getLayers().getLayer("text").write()
        }
    }
    if (lifelines != null) {
        for (var i = 0; i < lifelines.length; i++) {
            let lifeline = lifelines[i]
            lifeline.getLayers().getLayer("shape").write()
            lifeline.getLayers().getLayer("text").write()
        }
    }
    if (components != null) {
        for (var i = 0; i < components.length; i++) {
            let component = components[i]
            component.getLayers().getLayer("shape").write()
            component.getLayers().getLayer("text").write()
        }
    }
    if (nodes != null) {
        for (var i = 0; i < nodes.length; i++) {
            let node = nodes[i]
            node.getLayers().getLayer("shape").write()
            node.getLayers().getLayer("text").write()
        }
    }
    if (actors != null) {
        for (var i = 0; i < actors.length; i++) {
            let actor = actors[i]
            actor.getLayers().getLayer("shape").write()
            actor.getLayers().getLayer("text").write()
        }
    }
    if (usecases != null) {
        for (var i = 0; i < usecases.length; i++) {
            let usecase = usecases[i]
            usecase.getLayers().getLayer("shape").write()
            usecase.getLayers().getLayer("text").write()
        }
    }
    for (var i = 0; i < connectors.length; i++) {
        let connector = connectors[i]
        connector.getLayers().getLayer("shape").write()
        connector.getLayers().getLayer("text").write()
    }
    for (var i = 0; i < messages.length; i++) {
        let connector = messages[i]
        connector.getLayers().getLayer("shape").write()
        connector.getLayers().getLayer("text").write()
    }
    if (assemblyconnectors != null) {
        for (var i = 0; i < assemblyconnectors.length; i++) {
            let connector = assemblyconnectors[i]
            connector.getLayers().getLayer("shape").write()
            connector.getLayers().getLayer("text").write()
        }
    }
}
