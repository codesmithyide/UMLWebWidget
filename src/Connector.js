'use strict'

export class Connector {

    constructor(svg, type, classbox1, classbox2, text, layout) {
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
        }
    }

    draw() {
        this.svg.clear()
        if (this.type == "inheritance") {
            drawInheritanceRelationship(this.svg, this.classbox1, this.classbox2, this.layout)
        } else if ((this.type == "composition") || (this.type == "aggregation")) {
            drawCompositionOrAggregationRelationship(this.svg, this.classbox1, this.classbox2, this.layout)
        }
    }

    move(y) {
        this.svg.each(function(i, children) {
            this.dy(y)
        })
    }

    hide() {
        this.svg.hide()
    }

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
