// Global namespace for CodeSmithy applications
var CodeSmithy = CodeSmithy || { }

// The namespace for the UMLWebWidget application
CodeSmithy.UMLWebWidget = { }

;(function(ns) {

    ns.Style = function() {

        this.getTopMargin = function(element) {
            return getValueOrDefault(this, element, "margin-top")
        }

        this.getBottomMargin = function(element) {
            return getValueOrDefault(this, element, "margin-bottom")
        }

        this.getLeftMargin = function(element) {
            return getValueOrDefault(this, element, "margin-left")
        }

        this.getRightMargin = function(element) {
            return getValueOrDefault(this, element, "margin-right")
        }

        this.style = {
            "defaults": {
                "margin-left": 12,
                "margin-right": 12,
                "margin-top": 9,
                "margin-bottom": 9
            },
            "lifeline": {
                "margin-left": 12,
                "margin-right": 12,
                "margin-top": 9,
                "margin-bottom": 9
            }
        }

        function getValueOrDefault(self, element, style) {
            if (self.style[element] && self.style[element][style]) {
                return self.style[element][style]
            } else {
                return self.style["defaults"][style]
            }
        }

    }

    /////
    // Start of the CodeSmithy.UMLWebWidget.Diagram class definition
    //
    // This class is the entry point for all the functionality provided
    // by the CodeSmithy UMLWebWidget.
    ns.Diagram = function(settings) {

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
            let style = new ns.Style()
            if (this.diagramDescription.classdiagram) {
                this.drawClassDiagram(svg, this.diagramDescription.classdiagram, style, layout)
            } else if (this.diagramDescription.componentdiagram) {
                this.drawComponentDiagram(svg, this.diagramDescription.componentdiagram)
            }else if (this.diagramDescription.sequencediagram) {
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

            for (var i = 0; i < classDiagram.length; i++) {
                let item = classDiagram[i]
                if (item.class) {
                    this.classboxes[item.class.name] = new ns.ClassBox(svg, item.class, this.settings.canMove, style, layout)
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

        this.drawComponentDiagram = function(svg, componentDiagram) {
            for (var i = 0; i < componentDiagram.length; i++) {
                let item = componentDiagram[i]
                if (item.component) {
                    new ns.Component(svg, item.component)
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
                    this.lifelines[item.lifeline.name] = new ns.Lifeline(svg, item.lifeline, style.lifeline, layout)
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
                    this.actors[item.actor.name] = new ns.Actor(svg, item.actor, layout)
                } else if (item.usecase) {
                    this.usecases[item.usecase.title] = new ns.UseCase(svg, item.usecase, layout)
                } else if (item.association) {
                    createUseCaseConnector(this, svg, this.actors[item.association.actor], this.usecases[item.association.usecase]).draw()
                }
            }
        }

        function createClassBoxConnector(self, svg, type, classbox1, classbox2, layout) {
            return new ns.Connector(svg, type, classbox1, classbox2, "", layout)
        }

        function createLifelineConnector(self, svg, type, classbox1, classbox2, name, layout) {
            return new ns.Connector(svg, type, classbox1, classbox2, name, layout)
        }

        function createUseCaseConnector(self, svg, actor, usecase) {
            return new ns.Connector(svg, "usecaseassociation", actor, usecase)
        }
    }
    //
    // End of the CodeSmithy.UMLWebWidget.Diagram class definition
    /////

    /////
    // Start of the CodeSmithy.UMLWebWidget.ClassBox class definition
    //
    ns.ClassBox = function(svg, classDescription, canMove, style, layout) {
        
        this.classDescription = classDescription
        this.def = createDef(this, svg.defs(), classDescription, canMove, style, layout)
        this.svg = svg.use(this.def)

        // List of connectors that are connected to this class box
        this.connectors = [ ]
        
        this.fire = function(evt) {
            if (evt == "positionchanged") {
                for (let i = 0; i < this.connectors.length; i++) {
                    this.connectors[i].draw()        
                }
            }
        }

        function createDef(self, defs, classInfo, canMove, style, layout) {
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

            // Offset by 1 to leave some space because the border stroke width is 2
            classGroup.move(1,1)

            if (layout.classboxpositions[classDescription.name]) {
                classGroup.move(layout.classboxpositions[classDescription.name].x, layout.classboxpositions[classDescription.name].y)
            }

            if (canMove) {
                classGroup.draggable(true)
                classGroup.on('dragmove.namespace', function(evt) {
                    self.fire('positionchanged')
                })
                classGroup.on('dragend.namespace', function(evt) {
                    self.fire('positionchanged')
                })
            }

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

    /////
    // Start of the CodeSmithy.UMLWebWidget.Component class definition
    //
    ns.Component = function(svg, componentDescription) {

        this.componentDescription = componentDescription

        var componentNameDef = svg.defs().text(componentDescription.name)
            
        svg.use(componentNameDef)

    }
    //
    // End of the CodeSmithy.UMLWebWidget.Component class definition
    /////

    /////
    // Start of the CodeSmithy.UMLWebWidget.Lifeline class definition
    //
    ns.Lifeline = function(svg, lifelineDescription, lifelineStyle, layout) {

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

    }
    //
    // End of the CodeSmithy.UMLWebWidget.Lifeline class definition
    //////

    /////
    // Start of the CodeSmithy.UMLWebWidget.Actor class definition
    //
    ns.Actor = function(svg, actorDescription, layout) {

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
    }
    //
    // End of the CodeSmithy.UMLWebWidget.Actor class definition
    /////

    /////
    // Start of the CodeSmithy.UMLWebWidget.UseCase class definition
    //
    ns.UseCase = function(svg, useCaseDescription, layout) {

        this.def = svg.group().addClass("UMLUseCase")
        let textDef = this.def.defs().text(useCaseDescription.title).move(0, 0)
        this.def.ellipse(1.2*textDef.bbox().width, 3*textDef.bbox().height)
        this.def.use(textDef).move(0.1*textDef.bbox().width, textDef.bbox().height)
        if (layout.usecasepositions[useCaseDescription.title]) {
            this.def.move(layout.usecasepositions[useCaseDescription.title].x, layout.usecasepositions[useCaseDescription.title].y)
        }
        this.svg = svg.use(this.def)

    }
    //
    // End of the CodeSmithy.UMLWebWidget.UseCase class definition
    /////


    /////
    // Start of the CodeSmithy.UMLWebWidget.Connector class definition
    //
    ns.Connector = function(svg, type, classbox1, classbox2, text, layout) {

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
        } else if (this.type == "returnmessage") {
            this.svg.addClass("UMLReturnMessage")
        } else if (this.type == "usecaseassociation") {
            this.svg.addClass("UMLUseCaseAssociation")
        }

        this.draw = function() {
            this.svg.clear()
            if (this.type == "inheritance") {
                drawInheritanceRelationship(this.svg, this.classbox1, this.classbox2, this.layout)
            } else if ((this.type == "composition") || (this.type == "aggregation")) {
                drawCompositionOrAggregationRelationship(this.svg, this.classbox1, this.classbox2, this.layout)
            } else if (this.type == "synchronousmessage") {
                drawSynchronousMessage(this.svg, this.classbox1, this.classbox2, this.text)
            } else if (this.type == "returnmessage") {
                drawReturnMessage(this.svg, this.classbox1, this.classbox2)
            } else if (this.type == "usecaseassociation") {
                drawUseCaseAssociation(this.svg, this.classbox1, this.classbox2)
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

        function drawReturnMessage(svg, caller, callee) {
            let startX = caller.svg.bbox().cx
            let endX = callee.svg.bbox().cx

            svg.line(startX, 6, startX + 10, 0)
            svg.line(startX, 6, endX, 6).attr("stroke-dasharray", "4, 4")
            svg.line(startX, 6, startX + 10, 12)
        }

        function drawUseCaseAssociation(svg, classbox1, classbox2) {
            svg.line(classbox1.svg.bbox().x + classbox1.svg.bbox().width, classbox1.svg.bbox().cy, classbox2.svg.bbox().x, classbox2.svg.bbox().cy)
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

})(CodeSmithy.UMLWebWidget)
