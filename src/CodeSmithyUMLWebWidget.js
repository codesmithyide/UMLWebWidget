'use strict'

import { Style } from "./Style.js"
import { LayoutManager } from "./LayoutManager.js"
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

var CodeSmithy = { }


CodeSmithy.UMLWebWidget = {

    /////
    // Start of the CodeSmithy.UMLWebWidget.Diagram class definition
    //
    // This class is the entry point for all the functionality provided
    // by the CodeSmithy UMLWebWidget.
    Diagram: function(settings) {

        this.Settings = function(settings) {

            this.width = 600
            this.height = 200
            this.canMove = false
            this.canResive = false

            if (settings) {
                if (settings.width) {
                    this.width = settings.width
                }
                if (settings.height) {
                    this.height = settings.height
                }
                if (settings.interactive) {
                    if (settings.interactive.canMove) {
                        this.canMove = settings.interactive.canMove
                    }
                }
            }
        }

        this.settings = new this.Settings(settings)

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

        // Create a diagram from a div element in the HTML document.
        // The div element must contain a JSON object with the UML
        // diagram information. The contents of the div will be replaced
        // by the diagram.
        // - divId: this is the id of the div element to use, it should be the id
        //   without any '#' prefix.
        this.createFromDiv = function(divId, layout) {
            this.diagramDescription = JSON.parse($('#' + divId).text())
            $('#' + divId).empty()
            var svg = SVG(divId).size(this.settings.width, this.settings.height)
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

        this.drawClassDiagram = function(svg, classDiagram, style, layout) {
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
                    let newClassBox = new CodeSmithy.UMLWebWidget.ClassBox(svg, item.class, this.settings.canMove, style)
                    this.classboxes[className] = newClassBox
                    if (layout.classboxpositions[className]) {
                        newClassBox.move(layout.classboxpositions[className].x, layout.classboxpositions[className].y)
                    }
                    newClassBox.draw()
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
                    let newConnector = createClassBoxConnector(this, svg, item.relationship.type, classbox1, classbox2, layout)
                    classbox1.connectors.push(newConnector)
                    classbox2.connectors.push(newConnector)
                    newConnector.draw()
                }
            }
        }

        this.drawComponentDiagram = function(svg, componentDiagram, style, layout) {
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

        this.drawDeploymentDiagram = function(svg, deploymentDiagram, style, layout) {
            for (var i = 0; i < deploymentDiagram.length; i++) {
                let item = deploymentDiagram[i]
                if (item.node) {
                    new Node(svg, item.node, style, layout)
                }
            }
        }

        this.drawSequenceDiagram = function(svg, sequenceDiagram, style, layout) {
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

        this.drawUseCaseDiagram = function(svg, useCaseDiagram, layout) {
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

        function createClassBoxConnector(self, svg, type, classbox1, classbox2, layout) {
            return new Connector(svg, type, classbox1, classbox2, "", layout)
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
    },
    //
    // End of the CodeSmithy.UMLWebWidget.Diagram class definition
    /////

    /////
    // Start of the CodeSmithy.UMLWebWidget.ClassBox class definition
    //
    ClassBox: function(svg, classDescription, canMove, style) {
        
        this.classDescription = classDescription
        this.def = createDef(this, svg.defs(), classDescription, canMove, style)
        this.svg = svg.use(this.def)

        // List of connectors that are connected to this class box
        this.connectors = [ ]

        this.move = function(x, y) {
            this.def.move(x, y)
        }

        this.draw = function() {
        }
        
        this.fire = function(evt) {
            if (evt == "positionchanged") {
                for (let i = 0; i < this.connectors.length; i++) {
                    this.connectors[i].draw()        
                }
            }
        }

        function createDef(self, defs, classInfo, canMove, style) {
            var classGroup = defs.group().addClass("UMLClass")
    
            let currentDimensions = { 
                width: 0,
                height: 0
            }
    
            currentDimensions.height = style.getTopMargin("classbox")

            var classNameDef = defs.text(classInfo.name).addClass("UMLClassName").move(style.getLeftMargin("classbox"), currentDimensions.height)
            currentDimensions.width = Math.max(currentDimensions.width, classNameDef.bbox().width)
            currentDimensions.height += (classNameDef.bbox().height + style.getBottomMargin("classbox"))

            var line1YPos = currentDimensions.height
            let attributeGroupDef = addCompartment(defs, currentDimensions, style, classInfo.attributes, "UMLAttribute")
 
            var line2YPos = currentDimensions.height
            let operationGroupDef = addCompartment(defs, currentDimensions, style, classInfo.operations, "UMLOperation")

            // According to the UML standard the class name must be
            // centered so center it
            if (currentDimensions.width > classNameDef.bbox().width) {
                classNameDef.dx((currentDimensions.width - classNameDef.bbox().width)/2)
            }

            currentDimensions.width += (style.getLeftMargin("classbox") + style.getRightMargin("classbox"))
    
            classGroup.rect(currentDimensions.width, currentDimensions.height).move(0,0)
            classGroup.use(classNameDef)
            classGroup.line(0, line1YPos, currentDimensions.width, line1YPos)
            classGroup.use(attributeGroupDef)
            classGroup.line(0, line2YPos, currentDimensions.width, line2YPos)
            classGroup.use(operationGroupDef)

            if (canMove) {
                classGroup.draggable(true)
                classGroup.on('dragmove.namespace', function(evt) {
                    self.fire('positionchanged')
                })
                classGroup.on('dragend.namespace', function(evt) {
                    self.fire('positionchanged')
                })
            }

            // Offset by 1 to leave some space because the border stroke width is 2
            classGroup.move(1,1)

            return classGroup
        }

        // Add an attribute or operation compartment and updates the current dimensions
        // of the class box
        function addCompartment(svg, currentDimensions, style, items, cssClass) {
            currentDimensions.height += style.getTopMargin("classbox")
            let compartmentDef = createAttributeOrOperationGroupDef(svg, currentDimensions, items, cssClass)
            compartmentDef.dmove(style.getLeftMargin("classbox"), 0)            
            currentDimensions.height += style.getBottomMargin("classbox")
            return compartmentDef
        }

        // Creates a group with all the attributes or operations
        function createAttributeOrOperationGroupDef(svg, currentDimensions, items, cssClass) {
            let itemGroupDef = svg.group()
            for (var i = 0; i < items.length; i++) {
                let itemDef = createAttributeOrOperationDef(itemGroupDef, items[i], cssClass)
                itemDef.move(0, currentDimensions.height)
                currentDimensions.width = Math.max(currentDimensions.width, itemDef.bbox().width)
                currentDimensions.height += itemDef.bbox().height
            }
            return itemGroupDef
        }

        // Creates a single attribute or operation line
        function createAttributeOrOperationDef(svg, item, cssClass) {
            let text = visibilityStringToSymbol(item.visibility) + item.name
            if (item.return) {
                text += " : " + item.return
            }
            return svg.text(text).addClass(cssClass)
        }

        // Converts the visibility from the user string provided
        // in the input to the appropriate UML symbol for
        // visibility
        function visibilityStringToSymbol(visibility) {
            let stringToSymbolMap = {
                "public": "+ ",
                "protected": "# ",
                "private": "- "
            }
            return stringToSymbolMap[visibility]
        }

    }
    //
    // End of the CodeSmithy.UMLWebWidget.ClassBox class definition
    /////

}

export {
    CodeSmithy
}
