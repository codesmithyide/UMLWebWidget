// Global namespace for CodeSmithy applications
var CodeSmithy = CodeSmithy || { }

// The namespace for the UMLWebWidget application
CodeSmithy.UMLWebWidget = { }

;(function(ns) {

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
            var style = { 
                "classbox": {
                    "margin-left": 12,
                    "margin-right": 12,
                    "margin-top": 9,
                    "margin-bottom": 9
                }
            }
            if (this.diagramDescription.classdiagram) {
                this.drawClassDiagram(svg, this.diagramDescription.classdiagram, style, layout)
            }
        }

        this.drawClassDiagram = function(svg, classDiagram, style, layout) {
            if (layout == null) {
                layout = { }
            }
            if (layout.positions == null) {
                layout.positions = { }
            }

            for (var i = 0; i < classDiagram.length; i++) {
                let item = classDiagram[i]
                if (item.class) {
                    this.classboxes[item.class.name] = new ns.ClassBox(svg, item.class, this.settings.canMove, style.classbox, layout)
                } else if (item.relationship) {
                    let classbox1
                    let classbox2
                    if (item.relationship.type == "inheritance") {
                        classbox1 = this.classboxes[item.relationship.baseclass]
                        classbox2 = this.classboxes[item.relationship.derivedclass] 
                    } else if (item.relationship.type == "composition") {
                        classbox1 = this.classboxes[item.relationship.containingclass]
                        classbox2 = this.classboxes[item.relationship.containedclass]
                    }
                    let newConnector = new ns.Connector(svg, item.relationship.type, classbox1, classbox2)
                    classbox1.connectors.push(newConnector)
                    classbox2.connectors.push(newConnector)
                    newConnector.draw()
                }
            }
        }

    }
    //
    // End of the CodeSmithy.UMLWebWidget.Diagram class definition
    /////

    /////
    // Start of the CodeSmithy.UMLWebWidget.ClassBox class definition
    //
    ns.ClassBox = function(svg, classDescription, canMove, classboxStyle, layout) {
        
        this.def = createDef(this, svg.defs(), classDescription, canMove, classboxStyle, layout)
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
    
            currentDimensions.height = style["margin-top"]

            var classNameDef = defs.text(classInfo.name).addClass("UMLClassName").move(style["margin-left"], currentDimensions.height)
            currentDimensions.width = Math.max(currentDimensions.width, classNameDef.bbox().width)
            currentDimensions.height += (classNameDef.bbox().height + style["margin-bottom"])

            var line1YPos = currentDimensions.height
            let attributeGroupDef = addCompartment(defs, currentDimensions, style, classInfo.attributes, "UMLAttribute")
 
            var line2YPos = currentDimensions.height
            let operationGroupDef = addCompartment(defs, currentDimensions, style, classInfo.operations, "UMLOperation")

            // According to the UML standard the class name must be
            // centered so center it
            if (currentDimensions.width > classNameDef.bbox().width) {
                classNameDef.dx((currentDimensions.width - classNameDef.bbox().width)/2)
            }

            currentDimensions.width += (style["margin-left"] + style["margin-right"])
    
            classGroup.rect(currentDimensions.width, currentDimensions.height).move(0,0)
            classGroup.use(classNameDef)
            classGroup.line(0, line1YPos, currentDimensions.width, line1YPos)
            classGroup.use(attributeGroupDef)
            classGroup.line(0, line2YPos, currentDimensions.width, line2YPos)
            classGroup.use(operationGroupDef)

            // Offset by 1 to leave some space because the border stroke width is 2
            classGroup.move(1,1)

            if (layout.positions[classDescription.name]) {
                classGroup.move(layout.positions[classDescription.name].x, layout.positions[classDescription.name].y)
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
            currentDimensions.height += style["margin-top"]
            let compartmentDef = createAttributeOrOperationGroupDef(svg, items, cssClass)
            compartmentDef.dmove(style["margin-left"], currentDimensions.height)
            currentDimensions.width = Math.max(currentDimensions.width, compartmentDef.bbox().width)
            currentDimensions.height += compartmentDef.bbox().height
            currentDimensions.height += style["margin-bottom"]
            return compartmentDef
        }

        // Creates a group with all the attributes or operations
        function createAttributeOrOperationGroupDef(svg, items, cssClass) {
            let itemGroupDef = svg.group()
            let currentHeight = 0
            for (var i = 0; i < items.length; i++) {
                let itemDef = createAttributeOrOperationDef(itemGroupDef, items[i], cssClass)
                itemDef.move(0, currentHeight)
                currentHeight += itemDef.bbox().height
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
    // Start of the CodeSmithy.UMLWebWidget.Connector class definition
    //
    ns.Connector = function(svg, type, classbox1, classbox2) {

        this.type = type
        this.classbox1 = classbox1
        this.classbox2 = classbox2
        this.svg = svg.group()
        if (this.type == "inheritance") {
            this.svg.addClass("UMLInheritanceRelationship")
        } else if (this.type == "composition") {
            this.svg.addClass("UMLCompositionRelationship")
        }

        this.draw = function() {
            this.svg.clear()
            if (this.type == "inheritance") {
                drawInheritanceRelationship(this.svg, this.classbox1, this.classbox2)
            } else if (this.type == "composition") {
                drawCompositionRelationship(this.svg, this.classbox1, this.classbox2)
            }
        }

        this.hide = function() {
            this.svg.hide()
        }

        // Draws an inheritance connector between two classes
        function drawInheritanceRelationship(svg, baseclassbox, derivedclassbox) {
            let bbox1 = baseclassbox.svg.bbox()
            let bbox2 = derivedclassbox.svg.bbox()

            let connectionPositions = getConnectionPositions(bbox1, bbox2)
            let startPoint = getConnectionPoint(connectionPositions.start, bbox2)
            let endPoint = getConnectionPoint(connectionPositions.end, bbox1)

            let polygonDescription
            switch (connectionPositions.end) {
                case ConnectorPosition.TopCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x - 10) + "," + (endPoint.y - 12) + " " +
                        (endPoint.x + 10) + "," + (endPoint.y - 12)                
                    svg.polygon(polygonDescription)
                    svg.line(endPoint.x, endPoint.y - 12, startPoint.x, startPoint.y)
                    break

                case ConnectorPosition.RightCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x + 12) + "," + (endPoint.y - 10) + " " +
                        (endPoint.x + 12) + "," + (endPoint.y + 10)                
                    svg.polygon(polygonDescription)
                    svg.line(endPoint.x + 12, endPoint.y, startPoint.x, startPoint.y)
                    break

                case ConnectorPosition.BottomCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x - 10) + "," + (endPoint.y + 12) + " " +
                        (endPoint.x + 10) + "," + (endPoint.y + 12)                
                    svg.polygon(polygonDescription)
                    svg.line(endPoint.x, endPoint.y + 12, startPoint.x, startPoint.y)
                    break

                case ConnectorPosition.LeftCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x - 12) + "," + (endPoint.y - 10) + " " +
                        (endPoint.x - 12) + "," + (endPoint.y + 10)                
                    svg.polygon(polygonDescription)
                    svg.line(endPoint.x - 12, endPoint.y, startPoint.x, startPoint.y)
                    break
            }
        }

        // Draws a composition connector between two classes
        function drawCompositionRelationship(svg, containingclassbox, containedclassbox) {
            let bbox1 = containingclassbox.svg.bbox()
            let bbox2 = containedclassbox.svg.bbox()

            let connectionPositions = getConnectionPositions(bbox1, bbox2)
            let startPoint = getConnectionPoint(connectionPositions.start, bbox2)
            let endPoint = getConnectionPoint(connectionPositions.end, bbox1)

            let polygonDescription
            let middleX = 0
            let middleY = 0
            switch (connectionPositions.end) {
                case ConnectorPosition.TopCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x - 8) + "," + (endPoint.y - 10) + " " +
                        endPoint.x + "," + (endPoint.y - 20) + " " +
                        (endPoint.x + 8) + "," + (endPoint.y - 10)
                    svg.polygon(polygonDescription)
                    if (endPoint.x == startPoint.x) {
                        svg.line(endPoint.x, endPoint.y - 20, startPoint.x, startPoint.y)
                    } else {
                        middleY = (endPoint.y - 20 + ((startPoint.y - endPoint.y + 20)/2))
                        svg.line(endPoint.x, endPoint.y - 20, endPoint.x, middleY)
                        svg.line(endPoint.x, middleY, startPoint.x, middleY)
                        svg.line(startPoint.x, middleY, startPoint.x, startPoint.y)
                    }
                    break

                case ConnectorPosition.RightCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x + 10) + "," + (endPoint.y - 8) + " " +
                        (endPoint.x + 20) + "," + endPoint.y + " " +
                        (endPoint.x + 10) + "," + (endPoint.y + 8)
                    svg.polygon(polygonDescription)
                    if (endPoint.y == startPoint.y) {
                        svg.line(endPoint.x + 20, endPoint.y, startPoint.x, startPoint.y)
                    } else {
                        middleX = (endPoint.x + 20 + ((startPoint.x - endPoint.x - 20)/2))
                        svg.line(endPoint.x + 20, endPoint.y, middleX, endPoint.y)
                        svg.line(middleX, endPoint.y, middleX, startPoint.y)
                        svg.line(middleX, startPoint.y, startPoint.x, startPoint.y)
                    }
                    break

                case ConnectorPosition.BottomCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x - 8) + "," + (endPoint.y + 10) + " " +
                        endPoint.x + "," + (endPoint.y + 20) + " " +
                        (endPoint.x + 8) + "," + (endPoint.y + 10)
                    svg.polygon(polygonDescription)
                    if (endPoint.x == startPoint.x) {
                        svg.line(endPoint.x, endPoint.y + 20, startPoint.x, startPoint.y)
                    } else {
                        middleY = (endPoint.y + 20 + ((startPoint.y - endPoint.y - 20)/2))
                        svg.line(endPoint.x, endPoint.y + 20, endPoint.x, middleY)
                        svg.line(endPoint.x, middleY, startPoint.x, middleY)
                        svg.line(startPoint.x, middleY, startPoint.x, startPoint.y)
                    }
                    break

                case ConnectorPosition.LeftCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x - 10) + "," + (endPoint.y - 8) + " " +
                        (endPoint.x - 20) + "," + endPoint.y + " " +
                        (endPoint.x - 10) + "," + (endPoint.y + 8)
                    svg.polygon(polygonDescription)
                    if (endPoint.y == startPoint.y) {
                        svg.line(endPoint.x - 20, endPoint.y, startPoint.x, startPoint.y)
                    } else {
                        middleX = (endPoint.x - 20 - ((endPoint.x - 20 - startPoint.x)/2))
                        svg.line(endPoint.x - 20, endPoint.y, middleX, endPoint.y)
                        svg.line(middleX, endPoint.y, middleX, startPoint.y)
                        svg.line(middleX, startPoint.y, startPoint.x, startPoint.y)
                    }
                    break
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

    }
    //
    // End of the CodeSmithy.UMLWebWidget.Connector class definition
    /////

})(CodeSmithy.UMLWebWidget)
