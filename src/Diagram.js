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
import { AssemblyConnector } from "./AssemblyConnector.js"
import { SynchronousMessageConnector } from "./SynchronousMessageConnector.js"
import { ReturnMessageConnector } from "./ReturnMessageConnector.js"
import { UseCaseAssociationConnector } from "./UseCaseAssociationConnector.js"
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
        this.classboxes = { }

        // The list of all UML components present on the
        // diagram
        this.components = { }

        // The list of all UML lifelines present on the
        // diagram
        this.lifelines = { }

        // The list of all UML actors present on the
        // diagram
        this.actors = { }

        // The list of all UML use cases present on the
        // diagram
        this.usecases = { }
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

        if (this.diagramDescription.classdiagram) {
            this.drawClassDiagram(svg, this.diagramDescription.classdiagram, style, layout)
        } else if (this.diagramDescription.componentdiagram) {
            this.drawComponentDiagram(svg, this.diagramDescription.componentdiagram, style, layout)
        } else if (this.diagramDescription.deploymentdiagram) {
            this.drawDeploymentDiagram(svg, this.diagramDescription.deploymentdiagram, style, layout)
        } else if (this.diagramDescription.sequencediagram) {
            this.drawSequenceDiagram(svg, this.diagramDescription.sequencediagram, style.style, layout)
        } else if (this.diagramDescription.usecasediagram) {
            this.drawUseCaseDiagram(svg, this.diagramDescription.usecasediagram, layout)
        }
    }

    drawClassDiagram(svg, classDiagram, style, layout) {
        if (layout == null) {
            layout = { }
        }
        if (layout.classboxpositions == null) {
            layout.classboxpositions = { }
        }
        if (layout.connectorpositions == null) {
            layout.connectorpositions = { }
        }

        let layoutManager = new LayoutManager(layout)

        for (var i = 0; i < classDiagram.length; i++) {
            let item = classDiagram[i]
            if (item.class) {
                let className = item.class.name
                let newClassBox = new ClassBox(svg, item.class, this.settings.canMove, style)
                this.classboxes[className] = newClassBox
                if (layout.classboxpositions[className]) {
                    newClassBox.move(layout.classboxpositions[className].x, layout.classboxpositions[className].y)
                }
                newClassBox.getLayers().getLayer("shape").write()
                newClassBox.getLayers().getLayer("text").write()
            } else if (item.relationship) {
                let classbox1
                let classbox2
                if (item.relationship.type == "inheritance") {
                    classbox1 = this.classboxes[item.relationship.baseclass]
                    classbox2 = this.classboxes[item.relationship.derivedclass] 
                } else if ((item.relationship.type == "composition") || (item.relationship.type == "aggregation")) {
                    classbox1 = this.classboxes[item.relationship.containingclass]
                    classbox2 = this.classboxes[item.relationship.containedclass]
                }
                let connectionPoint1 = classbox1.createConnectionPoint()
                let connectionPoint2 = classbox2.createConnectionPoint()
                let newConnector = createClassBoxConnector(this, svg, item.relationship.type, connectionPoint1, connectionPoint2, layout) 
                newConnector.draw()
            }
        }
    }

    drawComponentDiagram(svg, componentDiagram, style, layout) {
        for (var i = 0; i < componentDiagram.length; i++) {
            let item = componentDiagram[i]
            if (item.component) {
                this.components[item.component.name] = new Component(svg, item.component, style, layout)
            } else if (item.assemblyconnector) {
                let consumerComponent = this.components[item.assemblyconnector.consumer]
                let providerComponent = this.components[item.assemblyconnector.provider]
                let newConnector = new AssemblyConnector(svg)
                newConnector.move(consumerComponent.getSocketConnectionPoint("").x, consumerComponent.getSocketConnectionPoint("").y, providerComponent.getBallConnectionPoint("").x, providerComponent.getBallConnectionPoint("").y)
                newConnector.draw()
            }
        } 
    }

    drawDeploymentDiagram(svg, deploymentDiagram, style, layout) {
        for (var i = 0; i < deploymentDiagram.length; i++) {
            let item = deploymentDiagram[i]
            if (item.node) {
                new Node(svg, item.node, style, layout)
            }
        }
    }

    drawSequenceDiagram(svg, sequenceDiagram, style, layout) {
        if (layout == null) {
            layout = { }
        }
        if (layout.lifelinepositions == null) {
            layout.lifelinepositions = { }
        }

        let nextYPosition = 0
        for (var i = 0; i < sequenceDiagram.length; i++) {
            let item = sequenceDiagram[i]
            if (item.lifeline) {
                this.lifelines[item.lifeline.name] = new Lifeline(svg, item.lifeline, style.lifeline, layout)
                nextYPosition = Math.max(nextYPosition, this.lifelines[item.lifeline.name].svg.bbox().y + this.lifelines[item.lifeline.name].svg.bbox().height + 20)
            } else if (item.messages) {
                for (var j = 0; j < item.messages.length; j++) {
                    let message = item.messages[j]
                    let lifeline1
                    let lifeline2
                    let newConnector
                    if (message.synchronousmessage) {
                        lifeline1 = this.lifelines[message.synchronousmessage.caller]
                        lifeline2 = this.lifelines[message.synchronousmessage.callee]
                        newConnector = createLifelineConnector(this, svg, "synchronousmessage", lifeline1, lifeline2, message.synchronousmessage.name)
                    } else if (message.returnmessage) {
                        lifeline1 = this.lifelines[message.returnmessage.caller]
                        lifeline2 = this.lifelines[message.returnmessage.callee]
                        newConnector = createLifelineConnector(this, svg, "returnmessage", lifeline1, lifeline2, "")
                    }
                    lifeline1.connectors.push(newConnector)
                    lifeline2.connectors.push(newConnector)
                    newConnector.draw()
                    newConnector.move(nextYPosition)
                    nextYPosition += newConnector.svg.bbox().height
                }
            }
        }

        for (var key in this.lifelines) {
            this.lifelines[key].drawLine(svg)
        }
    }

    drawUseCaseDiagram(svg, useCaseDiagram, layout) {
        for (var i = 0; i < useCaseDiagram.length; i++) {
            let item = useCaseDiagram[i]
            if (item.actor) {
                this.actors[item.actor.name] = new Actor(svg, item.actor, layout)
            } else if (item.usecase) {
                this.usecases[item.usecase.title] = new UseCase(svg, item.usecase, layout)
            } else if (item.association) {
                createUseCaseConnector(this, svg, this.actors[item.association.actor], this.usecases[item.association.usecase]).draw()
            }
        }
    }

}

function createClassBoxConnector(self, svg, type, connectionPoint1, connectionPoint2, layout) {
    return new Connector(svg, type, connectionPoint1, connectionPoint2, "", layout)
}

function createLifelineConnector(self, svg, type, classbox1, classbox2, name, layout) {
    if (type == "returnmessage") {
        return new ReturnMessageConnector(svg, classbox1, classbox2, name, layout)
    } else {
        return new SynchronousMessageConnector(svg, classbox1, classbox2, name, layout)
    }
}

function createUseCaseConnector(self, svg, actor, usecase) {
    return new UseCaseAssociationConnector(svg, actor, usecase)
}
