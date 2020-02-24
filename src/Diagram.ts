/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import { Settings } from "./Settings"
import { Style } from "./Style"
import { LayoutManager } from "./LayoutManager"
import { ClassBox } from "./ClassBox"
import { ClassTemplate } from "./ClassTemplate"
import { Component } from "./Component"
import { Lifeline } from "./Lifeline"
import { Node } from "./Node"
import { Actor } from "./Actor"
import { UseCase } from "./UseCase"
import { Connector } from "./Connector"
import { SVGLayer } from "./SVGLayer"
import { Metrics } from "./Metrics"
import { Log } from "./Log"
import { Errors } from "./Errors"

/**
  This class is the entry point for all the functionality provided
  by the CodeSmithy UMLWebWidget.
*/
class Diagram {
    settings: Settings
    errors: Errors
    log: Log
    metrics
    diagramDescription
    classboxes: Map<string, ClassBox>
    classtemplates: Map<string, ClassTemplate>
    lifelines: Map<string, Lifeline>
    components: Map<string, Component>
    nodes: Map<string, Node>
    actors: Map<string, Actor>
    usecases: Map<string, UseCase>
    messages: Connector[]

    constructor(settings) {
        this.settings = new Settings(settings)
        this.errors = new Errors(this.settings.buildType)
        this.log = new Log(this.settings.logLevel)
        this.metrics = new Metrics()
        
        // The description of the UML diagram in JSON
        // format. This will then be parsed to create
        // the graphical form.
        this.diagramDescription = { }

        // The list of all UML class boxes present on the
        // diagram
        this.classboxes = new Map()

        // The list of all UML class templates present on the
        // diagram
        this.classtemplates = new Map()

        // The list of all UML lifelines present on the
        // diagram
        this.lifelines = new Map()

        // The list of all UML components present on the
        // diagram
        this.components = new Map()

        this.nodes = new Map()

        // The list of all UML actors present on the
        // diagram
        this.actors = new Map()

        // The list of all UML use cases present on the
        // diagram
        this.usecases = new Map()

        this.messages = [ ]
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
            this.drawDiagram(svg, this.diagramDescription.elements, style, layout, this.errors)
        }
    }

    drawDiagram(svg, description, style, layout, errors: Errors) {
        let layoutManager = new LayoutManager(layout)

        let connectors: Connector[] = []
        let assemblyconnectors: Connector[] = []

        // Construct the elements
        for (var i = 0; i < description.length; i++) {
            let item = description[i]
            if (item.class) {
                this.classboxes.set(
                    item.class.name,
                    new ClassBox(svg, item.class.name, item.class, this.settings.canMove, style, errors)
                )
            } else if (item.classtemplate) {
                this.classtemplates.set(
                    item.classtemplate.name,
                    new ClassTemplate(svg, item.classtemplate.name, item.classtemplate, style, errors)
                )
            } else if (item.lifeline) {
                this.lifelines.set(
                    item.lifeline.name,
                    new Lifeline(svg, item.lifeline.name, item.lifeline, style, this.log, errors)
                )
            } else if (item.component) {
                this.components.set(
                     item.component.name,
                     new Component(svg, item.component.name, item.component, style, errors)
                )
            } else if (item.node) {
                this.nodes.set(
                    item.node.name,
                    new Node(svg, item.node.name, item.node, style, errors)
                )
            } else if (item.actor) {
                this.actors.set(
                    item.actor.name,
                    new Actor(svg, item.actor.name, item.actor, errors)
                )
            } else if (item.usecase) {
                this.usecases.set(
                    item.usecase.title,
                    new UseCase(svg, item.usecase.title, item.usecase, errors)
                )
            } else if (item.relationship) {
                let classbox1: ClassBox | ClassTemplate
                let classbox2: ClassBox | ClassTemplate
                if (item.relationship.type == "inheritance") {
                    classbox1 = this.classboxes.get(item.relationship.derivedclass)
                    if (classbox1 == null) {
                        classbox1 = this.classtemplates.get(item.relationship.derivedclass)
                    }
                    classbox2 = this.classboxes.get(item.relationship.baseclass)
                    if (classbox2 == null) {
                        classbox2 = this.classtemplates.get(item.relationship.baseclass)
                    }
                } else if ((item.relationship.type == "composition") || (item.relationship.type == "aggregation")) {
                    classbox1 = this.classboxes.get(item.relationship.containedclass)
                    classbox2 = this.classboxes.get(item.relationship.containingclass)
                }
                let connectionPoint1 = classbox1.createConnectionPoint(svg)
                let connectionPoint2 = classbox2.createConnectionPoint(svg)
                let newConnector = new Connector(svg, item.relationship.type, connectionPoint1, connectionPoint2, null)
                connectors.push(newConnector)
            } else if (item.messages) {
                for (let j = 0; j < item.messages.length; j++) {
                    let message = item.messages[j]
                    let newConnector
                    if (message.synchronousmessage) {
                        let lifeline1 = this.lifelines.get(message.synchronousmessage.caller)
                        let lifeline2 = this.lifelines.get(message.synchronousmessage.callee)
                        let connectionPoint1 = lifeline1.createConnectionPoint(svg, "synchronous-start")
                        let connectionPoint2 = lifeline2.createConnectionPoint(svg, "synchronous-end")
                        newConnector = new Connector(svg, "synchronousmessage", connectionPoint1, connectionPoint2, message.synchronousmessage.name)
                    } else if (message.returnmessage) {
                        let lifeline1 = this.lifelines.get(message.returnmessage.callee)
                        let lifeline2 = this.lifelines.get(message.returnmessage.caller)
                        let connectionPoint1 = lifeline1.createConnectionPoint(svg, "return-start")
                        let connectionPoint2 = lifeline2.createConnectionPoint(svg, "return-end")
                        newConnector = new Connector(svg, "returnmessage", connectionPoint1, connectionPoint2, null)
                    } else if (message.creationmessage) {
                        let lifeline1 = this.lifelines.get(message.creationmessage.caller)
                        let lifeline2 = this.lifelines.get(message.creationmessage.callee)
                        let connectionPoint1 = lifeline1.createConnectionPoint(svg, "creation-start")
                        let connectionPoint2 = lifeline2.createConnectionPoint(svg, "creation-end")
                        newConnector = new Connector(svg, "creationmessage", connectionPoint1, connectionPoint2, null)
                    } else if (message.destructionmessage) {
                        let lifeline2 = this.lifelines.get(message.destructionmessage.callee)
                        let connectionPoint2 = lifeline2.createConnectionPoint(svg, "destruction-end")
                        newConnector = new Connector(svg, "destructionmessage", connectionPoint2, connectionPoint2, "")
                    }
                    this.messages.push(newConnector)
                }
            } else if (item.assemblyconnector) {
                let consumerComponent = this.components.get(item.assemblyconnector.consumer)
                let providerComponent = this.components.get(item.assemblyconnector.provider)
                let connectionPoint1 = consumerComponent.createDependencyConnectionPoint(svg, item.assemblyconnector.interface)
                let connectionPoint2 = providerComponent.createInterfaceConnectionPoint(svg, item.assemblyconnector.interface)
                let newConnector = new Connector(svg, "assemblyconnector", connectionPoint1, connectionPoint2, null)
                assemblyconnectors.push(newConnector)
            } else if (item.association) {
                let connectionPoint1 = this.actors.get(item.association.actor).createConnectionPoint(svg)
                let connectionPoint2 = this.usecases.get(item.association.usecase).createConnectionPoint(svg)
                let newConnector = new Connector(svg, "usecaseassociation", connectionPoint1, connectionPoint2, null)
                connectors.push(newConnector)
            } else if (item.communicationpath) {
                let connectionPoint1 = this.nodes.get(item.communicationpath.firstnode).createConnectionPoint(svg)
                let connectionPoint2 = this.nodes.get(item.communicationpath.secondnode).createConnectionPoint(svg)
                let newConnector = new Connector(svg, "communicationpath", connectionPoint1, connectionPoint2, null)
                connectors.push(newConnector)
            }
        }

        layoutManager.doLayout(this)
        dolayout(layoutManager, connectors, assemblyconnectors)

        draw(this.classboxes.values(), this.classtemplates.values(), this.lifelines.values(), this.components.values(), this.nodes.values(), 
            this.actors.values(), this.usecases.values(), connectors, this.messages, assemblyconnectors)
    }

}

function dolayout(layoutManager, connectors, assemblyconnectors) {
    if (connectors != null) {
        layoutManager.layoutConnectors(connectors)
    }
    if (assemblyconnectors != null) {
        for (var i = 0; i < assemblyconnectors.length; i++) {
            let connector = assemblyconnectors[i]
            connector.connectionPoint1.move(connector.connectionPoint1.element.component.getSocketConnectionPoint("").x, connector.connectionPoint1.element.component.getSocketConnectionPoint("").y)
            connector.connectionPoint2.move(connector.connectionPoint2.element.component.getBallConnectionPoint("").x, connector.connectionPoint2.element.component.getBallConnectionPoint("").y)
        }
    }
}

function draw(classboxes, classtemplates, lifelines, components, nodes, actors, usecases, connectors, messages, assemblyconnectors) {
    if (classboxes != null) {
        for (let classbox of classboxes) {
            let g = classbox.getLayers().svg.group();
            classbox.getLayers().getLayer("shape").write(g)
            classbox.getLayers().getLayer("text").write(g)
        }
    }
    if (classtemplates != null) {
        for (let classtemplate of classtemplates) {
            classtemplate.getLayers().getLayer("shape").write()
            classtemplate.getLayers().getLayer("text").write()
        }
    }
    if (lifelines != null) {
        for (let lifeline of lifelines) {
            lifeline.getLayers().getLayer("shape").write()
            lifeline.getLayers().getLayer("text").write()
        }
    }
    if (components != null) {
        for (let component of components) {
            component.getLayers().getLayer("shape").write()
            component.getLayers().getLayer("text").write()
        }
    }
    if (nodes != null) {
        for (let node of nodes) {
            node.getLayers().getLayer("shape").write()
            node.getLayers().getLayer("text").write()
        }
    }
    if (actors != null) {
        for (let actor of actors) {
            actor.getLayers().getLayer("shape").write()
            actor.getLayers().getLayer("text").write()
        }
    }
    if (usecases != null) {
        for (let usecase of usecases) {
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

export { Diagram }
