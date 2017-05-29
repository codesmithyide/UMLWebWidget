'use strict'

import { Style } from "./Style.js"
import { LayoutManager } from "./LayoutManager.js"
import { ReturnMessageConnector } from "./ReturnMessageConnector.js"
import { AssemblyConnector } from "./AssemblyConnector.js"
import { BallConnector } from "./BallConnector.js"
import { SocketConnector } from "./SocketConnector.js"
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
                    this.components[item.component.name] = new CodeSmithy.UMLWebWidget.Component(svg, item.component, style, layout)
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
                    new CodeSmithy.UMLWebWidget.Node(svg, item.node, style, layout)
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
                    this.lifelines[item.lifeline.name] = new CodeSmithy.UMLWebWidget.Lifeline(svg, item.lifeline, style.lifeline, layout)
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
                    this.actors[item.actor.name] = new CodeSmithy.UMLWebWidget.Actor(svg, item.actor, layout)
                } else if (item.usecase) {
                    this.usecases[item.usecase.title] = new CodeSmithy.UMLWebWidget.UseCase(svg, item.usecase, layout)
                } else if (item.association) {
                    createUseCaseConnector(this, svg, this.actors[item.association.actor], this.usecases[item.association.usecase]).draw()
                }
            }
        }

        function createClassBoxConnector(self, svg, type, classbox1, classbox2, layout) {
            return new CodeSmithy.UMLWebWidget.Connector(svg, type, classbox1, classbox2, "", layout)
        }

        function createLifelineConnector(self, svg, type, classbox1, classbox2, name, layout) {
            if (type == "returnmessage") {
                return new ReturnMessageConnector(svg, classbox1, classbox2, name, layout)
            } else {
                return new CodeSmithy.UMLWebWidget.Connector(svg, type, classbox1, classbox2, name, layout)
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

    },
    //
    // End of the CodeSmithy.UMLWebWidget.ClassBox class definition
    /////

    /////
    // Start of the CodeSmithy.UMLWebWidget.Component class definition
    //
    Component: function(svg, componentDescription, style, layout) {

        this.componentDescription = componentDescription
        this.ballConnectors = [ ]
        this.socketConnectors = [ ]

        this.getBallConnectionPoint = function(name) {
            for (let i = 0; i < this.ballConnectors.length; i++) {
                return this.ballConnectors[i].getAssemblyConnectionPoint()
            }
        }

        this.getSocketConnectionPoint = function(name) {
            for (let i = 0; i < this.socketConnectors.length; i++) {
                return this.socketConnectors[i].getAssemblyConnectionPoint()
            }
        }

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

        if (layout.componentpositions[componentDescription.name]) {
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

        function Stereotype(svgParentGroup) {

            this.x = 0
            this.y = 0
            this.width = 15
            this.height = 20

            this.move = function(x, y) {
                this.x = x
                this.y = y
            }

            this.draw = function() {
                let stereoTypeGroup = svgParentGroup.group().addClass("UMLComponentStereotype")
                stereoTypeGroup.rect(11, 15).move(4 + this.x, this.y)
                stereoTypeGroup.rect(8, 3).move(this.x, this.y + 3)
                stereoTypeGroup.rect(8, 3).move(this.x, this.y + 9)
            }

        }

    },
    //
    // End of the CodeSmithy.UMLWebWidget.Component class definition
    /////

    /////
    // Start of the CodeSmithy.UMLWebWidget.Lifeline class definition
    //
    Lifeline: function(svg, lifelineDescription, lifelineStyle, layout) {

        this.lifelineDescription = lifelineDescription
        this.def = createDef(svg.defs(), lifelineDescription, lifelineStyle, layout)
        this.svg = svg.use(this.def)

        // List of connectors that are connected to this lifeline
        this.connectors = [ ]

        this.drawLine = function(svg) {
            let firstConnectorY = 0
            if (this.connectors.length > 0) {
                firstConnectorY = this.connectors[0].svg.bbox().y
            }
            let lastConnectorY = 0
            if (this.connectors.length > 0) {
                lastConnectorY = this.connectors[this.connectors.length - 1].svg.bbox().y + this.connectors[this.connectors.length - 1].svg.bbox().height
            }
            let lineGroup = svg.group().addClass("UMLLifeline")
            lineGroup.line(this.svg.bbox().cx, this.svg.bbox().y + this.svg.bbox().height, this.svg.bbox().cx, firstConnectorY)
            lineGroup.rect(8, (lastConnectorY - firstConnectorY)).move(this.svg.bbox().cx - 4, firstConnectorY)
        }

        function createDef(defs, lifelineDescription, style, layout) {
            var lifelineGroup = defs.group().addClass("UMLLifeline")

            let currentDimensions = { 
                width: 0,
                height: 0
            }
    
            currentDimensions.height = style["margin-top"]

            var instanceNameDef = defs.text(":" + lifelineDescription.name).addClass("UMLInstanceName").move(style["margin-left"], currentDimensions.height)
            currentDimensions.width = Math.max(currentDimensions.width, instanceNameDef.bbox().width)
            currentDimensions.height += (instanceNameDef.bbox().height + style["margin-bottom"])

            currentDimensions.width += (style["margin-left"] + style["margin-right"])
    
            lifelineGroup.rect(currentDimensions.width, currentDimensions.height).move(0,0)
            lifelineGroup.use(instanceNameDef)

            // Offset by 1 to leave some space because the border stroke width is 2
            lifelineGroup.move(1,1)

            if (layout.lifelinepositions[lifelineDescription.name]) {
                lifelineGroup.move(layout.lifelinepositions[lifelineDescription.name].x, layout.lifelinepositions[lifelineDescription.name].y)
            }

            return lifelineGroup
        }

    },
    //
    // End of the CodeSmithy.UMLWebWidget.Lifeline class definition
    //////

    /////
    // Start of the CodeSmithy.UMLWebWidget.Node class definition
    //
    Node: function(svg, nodeDescription, style, layout) {

        this.nodeDescription = nodeDescription
        
        var nodeGroup = svg.group().addClass("UMLNode")
    
        let currentDimensions = { 
            width: 0,
            height: 0
        }
    
        currentDimensions.height = style.getTopMargin("node")

        var nodeNameDef = svg.defs().text(nodeDescription.name).addClass("UMLNodeName").move(style.getLeftMargin("node"), currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, nodeNameDef.bbox().width)
        currentDimensions.height += (nodeNameDef.bbox().height + style.getBottomMargin("node"))

        if (currentDimensions.width > nodeNameDef.bbox().width) {
            nodeNameDef.dx((currentDimensions.width - nodeNameDef.bbox().width)/2)
        }

        currentDimensions.width += (style.getLeftMargin("node") + style.getRightMargin("node"))
    
        nodeGroup.rect(currentDimensions.width, currentDimensions.height).move(0,0)
        nodeGroup.use(nodeNameDef)

        // Offset by 1 to leave some space because the border stroke width is 2
        nodeGroup.move(1,1)

        if (layout.nodes[nodeDescription.name]) {
            let position = layout.nodes[nodeDescription.name].position
            nodeGroup.move(position.x, position.y)
        }
    },
    //
    // End of the CodeSmithy.UMLWebWidget.Node class definition
    //////

    /////
    // Start of the CodeSmithy.UMLWebWidget.Actor class definition
    //
    Actor: function(svg, actorDescription, layout) {

        this.actorDescription = actorDescription
        this.def = svg.group().addClass("UMLActor")
        draw(this.def, this.actorDescription)
        this.svg = svg.use(this.def)

        function draw(svg, actorDescription) {
            let textDef = svg.text(actorDescription.name).move(0, 35)
            let width = textDef.bbox().width
            let offset = ((width - 16) / 2)
            svg.circle(12).move(2 + offset, 1)
            svg.line(8 + offset, 13, 8 + offset, 26)
            svg.line(offset, 18, 16 + offset, 18)
            svg.line(8 + offset, 26, offset, 33)
            svg.line(8 + offset, 26, 16 + offset, 33)

            if (layout.actorpositions[actorDescription.name]) {
                svg.move(layout.actorpositions[actorDescription.name].x, layout.actorpositions[actorDescription.name].y)
            }

            svg.use(textDef)     
        }
    },
    //
    // End of the CodeSmithy.UMLWebWidget.Actor class definition
    /////

    /////
    // Start of the CodeSmithy.UMLWebWidget.UseCase class definition
    //
    UseCase: function(svg, useCaseDescription, layout) {

        this.def = svg.group().addClass("UMLUseCase")
        let textDef = this.def.defs().text(useCaseDescription.title).move(0, 0)
        this.def.ellipse(1.2*textDef.bbox().width, 3*textDef.bbox().height)
        this.def.use(textDef).move(0.1*textDef.bbox().width, textDef.bbox().height)
        if (layout.usecasepositions[useCaseDescription.title]) {
            this.def.move(layout.usecasepositions[useCaseDescription.title].x, layout.usecasepositions[useCaseDescription.title].y)
        }
        this.svg = svg.use(this.def)

    },
    //
    // End of the CodeSmithy.UMLWebWidget.UseCase class definition
    /////


    /////
    // Start of the CodeSmithy.UMLWebWidget.Connector class definition
    //
    Connector: function(svg, type, classbox1, classbox2, text, layout) {

        this.type = type
        this.classbox1 = classbox1
        this.classbox2 = classbox2
        this.text = text
        this.layout = layout
        this.svg = svg.group()
        if (this.type == "inheritance") {
            this.svg.addClass("UMLInheritanceRelationship")
        } else if (this.type == "composition") {
            this.svg.addClass("UMLCompositionRelationship")
        } else if (this.type == "aggregation") {
            this.svg.addClass("UMLAggregationRelationship")
        } else if (this.type == "synchronousmessage") {
            this.svg.addClass("UMLSynchronousMessage")
        }

        this.draw = function() {
            this.svg.clear()
            if (this.type == "inheritance") {
                drawInheritanceRelationship(this.svg, this.classbox1, this.classbox2, this.layout)
            } else if ((this.type == "composition") || (this.type == "aggregation")) {
                drawCompositionOrAggregationRelationship(this.svg, this.classbox1, this.classbox2, this.layout)
            } else if (this.type == "synchronousmessage") {
                drawSynchronousMessage(this.svg, this.classbox1, this.classbox2, this.text)
            }
        }

        this.move = function(y) {
            this.svg.each(function(i, children) {
                this.dy(y)
            })
        }

        this.hide = function() {
            this.svg.hide()
        }

        // Draws an inheritance connector between two classes
        function drawInheritanceRelationship(svg, baseclassbox, derivedclassbox, layout) {
            let bbox1 = baseclassbox.svg.bbox()
            let bbox2 = derivedclassbox.svg.bbox()

            let connectionPositions = getConnectionPositions(bbox1, bbox2)
            let startPoint = getConnectionPoint(connectionPositions.start, bbox2)
            let endPoint = getConnectionPoint(connectionPositions.end, bbox1)

            let connectorOrientation = getConnectorHeadOrientationFromPosition(connectionPositions.end)
            let lineConnectionPoint = drawInheritanceArrow(svg, endPoint, connectorOrientation)
            drawConnectorLine(svg, startPoint, lineConnectionPoint, connectorOrientation)
        }

        // Draws a composition connector between two classes
        function drawCompositionOrAggregationRelationship(svg, containingclassbox, containedclassbox, layout) {
            let bbox1 = containingclassbox.svg.bbox()
            let bbox2 = containedclassbox.svg.bbox()

            let connectionPositions = getConnectionPositions(bbox1, bbox2)

            let layoutOverride = layout.connectorpositions[containedclassbox.classDescription.name + "-" + containingclassbox.classDescription.name + "-aggregation"];
            if (layoutOverride) {
                if (layoutOverride.end) {
                    if (layoutOverride.end == "RightCenter") {
                        connectionPositions.end = ConnectorPosition.RightCenter
                     }
                }
            }

            let startPoint = getConnectionPoint(connectionPositions.start, bbox2)
            let endPoint = getConnectionPoint(connectionPositions.end, bbox1)

            let connectorOrientation = getConnectorHeadOrientationFromPosition(connectionPositions.end)
            let lineConnectionPoint = drawDiamond(svg, endPoint, connectorOrientation)
            drawConnectorLine(svg, startPoint, lineConnectionPoint, connectorOrientation)  
        }

        function drawSynchronousMessage(svg, caller, callee, text) {
            if (caller != callee) {
                let startX = caller.svg.bbox().cx
                let endX = callee.svg.bbox().cx
                let width = (endX - startX)

                let textDef = svg.defs().text(text)
                if (textDef.bbox().width < width) {
                    textDef.move((startX + ((width - textDef.bbox().width) / 2)), 0)
                }

                let y = textDef.bbox().height + 2
                svg.line(startX, y, endX - 12, y)
                let polygonDescription = "" + (endX - 12) + "," + (y - 6) + " " +
                    endX + "," + y + " " +
                    (endX - 12) + "," + (y + 6)
                svg.polygon(polygonDescription)
                svg.use(textDef)
            } else {
                let startX = caller.svg.bbox().cx
                let textDef = svg.defs().text(text).move(startX + 8, 5)
                let offsetY = textDef.bbox().y + textDef.bbox().height + 3
                svg.use(textDef)
                svg.line(startX, offsetY, startX + 30, offsetY)
                svg.line(startX + 30, offsetY, startX + 30, 20 + offsetY)
                svg.line(startX + 30, 20 + offsetY, startX, 20 + offsetY)
                let polygonDescription = "" + startX + "," + (20 + offsetY) + " " +
                    (startX + 12) + "," + (20 + offsetY - 6) + " " +
                    (startX + 12) + "," + (20 + offsetY + 6)
                svg.polygon(polygonDescription)
            }
        }

        var ConnectorPosition = {
            TopCenter: 0,
            TopRight: 1,
            RightCenter: 2,
            BottomRight: 3,
            BottomCenter: 4,
            BottomLeft: 5,
            LeftCenter: 6,
            TopLeft: 7
        }

        function getConnectionPositions(boundingbox1, boundingbox2) {
            let result = { 
                start: ConnectorPosition.TopCenter,
                end: ConnectorPosition.TopCenter
            }

            if ((boundingbox1.y + boundingbox1.height) < boundingbox2.y) {
                result.start = ConnectorPosition.TopCenter
                result.end = ConnectorPosition.BottomCenter
            } else if ((boundingbox2.y + boundingbox2.height) < boundingbox1.y) {
                result.start = ConnectorPosition.BottomCenter
                result.end = ConnectorPosition.TopCenter
            } else if ((boundingbox1.x + boundingbox1.width) < boundingbox2.x) {
                result.start = ConnectorPosition.LeftCenter
                result.end = ConnectorPosition.RightCenter
            } else if ((boundingbox2.x + boundingbox2.width) < boundingbox1.x) {
                result.start = ConnectorPosition.RightCenter
                result.end = ConnectorPosition.LeftCenter
            }

            return result
        }

        // Gets one of the predefined positions for connection
        // points on a bounding box.
        function getConnectionPoint(position, boundingbox) {
            let result = { x: 0, y: 0 }
            switch (position) {
                case ConnectorPosition.TopCenter:
                    result.x = boundingbox.cx
                    result.y = boundingbox.y
                    break

                case ConnectorPosition.RightCenter:
                    result.x = (boundingbox.x + boundingbox.width)
                    result.y = boundingbox.cy
                    break

                case ConnectorPosition.BottomCenter:
                    result.x = boundingbox.cx
                    result.y = (boundingbox.y + boundingbox.height)
                    break

                case ConnectorPosition.LeftCenter:
                    result.x = boundingbox.x
                    result.y = boundingbox.cy
                    break
            }
            return result
        }

        // Orientation of the head (e.g. arrow or diamond)
        // of a connector
        var ConnectorHeadOrientation = {
            Up: 0,
            Down: 1,
            Left: 2,
            Right: 3
        }

        // Get the orientiation of the head of the connector
        // based on where the connector is connected
        function getConnectorHeadOrientationFromPosition(position) {
            switch (position) {
                case ConnectorPosition.TopCenter:
                    return ConnectorHeadOrientation.Down
                case ConnectorPosition.RightCenter:
                    return ConnectorHeadOrientation.Left
                case ConnectorPosition.BottomCenter:
                    return ConnectorHeadOrientation.Up
                case ConnectorPosition.LeftCenter:
                    return ConnectorHeadOrientation.Right
            }
        }

        // Draws an arrow for an inheritance relationship. The arrow's tip
        // is at the position gives as argument.
        // It returns the point to which the line of the connector should
        // be connected.
        function drawInheritanceArrow(svg, position, orientation) {
            let secondPoint = { x: 0, y: 0 }
            let thirdPoint = { x: 0, y: 0 }
            let lineConnectionPoint = { x: 0, y: 0 }
            switch (orientation) {
                case ConnectorHeadOrientation.Right:
                    secondPoint = { x: (position.x - 12), y: (position.y - 10) }
                    thirdPoint = { x: (position.x - 12), y: (position.y + 10) }
                    lineConnectionPoint = { x: (position.x - 12), y: position.y }
                    break

                case ConnectorHeadOrientation.Left:
                    secondPoint.x = (position.x + 12)
                    secondPoint.y = (position.y - 10)
                    thirdPoint.x = (position.x + 12)
                    thirdPoint.y = (position.y + 10)    
                    lineConnectionPoint = { x: (position.x + 12), y: position.y }
                    break
            
                case ConnectorHeadOrientation.Up:
                    secondPoint.x = (position.x - 10)
                    secondPoint.y = (position.y + 12)
                    thirdPoint.x = (position.x + 10)
                    thirdPoint.y = (position.y + 12)
                    lineConnectionPoint = { x: position.x, y: (position.y + 12) }
                    break

                case ConnectorHeadOrientation.Down:
                    secondPoint.x = (position.x - 10)
                    secondPoint.y = (position.y - 12)
                    thirdPoint.x = (position.x + 10)
                    thirdPoint.y = (position.y - 12)
                    lineConnectionPoint = { x: position.x, y: (position.y - 12) }
                    break
            }
            
            let polygonDescription = "" + position.x + "," + position.y + " " +
                secondPoint.x + "," + secondPoint.y + " " +
                thirdPoint.x + "," + thirdPoint.y                
            svg.polygon(polygonDescription)

            return lineConnectionPoint
        }

        // Draws a diamond for an inheritance relationship. The arrow's tip
        // is at the position gives as argument.
        // It returns the point to which the line of the connector should
        // be connected.
        function drawDiamond(svg, position, orientation) {
            let secondPoint = { x: 0, y: 0 }
            let thirdPoint = { x: 0, y: 0 }
            let fourthPoint = { x: 0, y: 0 }
            switch (orientation) {
                case ConnectorHeadOrientation.Right:
                    secondPoint = { x: (position.x - 10), y: (position.y - 8) }
                    thirdPoint = { x: (position.x - 20), y: position.y }
                    fourthPoint = { x: (position.x - 10), y: (position.y + 8) }
                    break

                case ConnectorHeadOrientation.Left:
                    secondPoint = { x: (position.x + 10), y: (position.y - 8) }
                    thirdPoint = { x: (position.x + 20), y: position.y }
                    fourthPoint = { x: (position.x + 10), y: (position.y + 8) }
                    break

                case ConnectorHeadOrientation.Up:
                    secondPoint = { x: (position.x + 8), y: (position.y + 10) }
                    thirdPoint = { x: position.x, y: (position.y + 20) }
                    fourthPoint = { x: (position.x - 8), y: (position.y + 10) }
                    break

                case ConnectorHeadOrientation.Down:
                    secondPoint = { x: (position.x + 8), y: (position.y - 10) }
                    thirdPoint = { x: position.x, y: (position.y - 20) }
                    fourthPoint = { x: (position.x - 8), y: (position.y - 10) }
                    break
            }

            let polygonDescription = "" + position.x + "," + position.y + " " +
                secondPoint.x + "," + secondPoint.y + " " +
                thirdPoint.x + "," + thirdPoint.y + " " +
                fourthPoint.x + "," + fourthPoint.y
            svg.polygon(polygonDescription)

            return thirdPoint
        }

        function drawConnectorLine(svg, startPoint, endPoint, orientation) {
            switch (orientation) {
                case ConnectorHeadOrientation.Up:
                case ConnectorHeadOrientation.Down:
                    if (endPoint.x == startPoint.x) {
                        svg.line(endPoint.x, endPoint.y, startPoint.x, startPoint.y)
                    } else {
                        let middleY = (endPoint.y + ((startPoint.y - endPoint.y)/2))
                        svg.line(endPoint.x, endPoint.y, endPoint.x, middleY)
                        svg.line(endPoint.x, middleY, startPoint.x, middleY)
                        svg.line(startPoint.x, middleY, startPoint.x, startPoint.y)
                    }
                    break

                case ConnectorHeadOrientation.Left:
                case ConnectorHeadOrientation.Right:
                    if (endPoint.y == startPoint.y) {
                        svg.line(endPoint.x, endPoint.y, startPoint.x, startPoint.y)
                    } else {
                        let middleX = (endPoint.x + ((startPoint.x - endPoint.x)/2))
                        svg.line(endPoint.x, endPoint.y, middleX, endPoint.y)
                        svg.line(middleX, endPoint.y, middleX, startPoint.y)
                        svg.line(middleX, startPoint.y, startPoint.x, startPoint.y)
                    }
                    break
            }
        }
    }
    //
    // End of the CodeSmithy.UMLWebWidget.Connector class definition
    /////

}

export {
    CodeSmithy
}
