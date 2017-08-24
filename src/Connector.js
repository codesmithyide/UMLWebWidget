'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { ConnectionPointPosition } from "./ConnectionPointPosition.js"

/**
  Represents a connector between elements.

  @extends DiagramElement
*/
class Connector extends DiagramElement {

    constructor(svg, type, connectionPoint1, connectionPoint2, text) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.type = type
        this.connectionPoint1 = connectionPoint1
        this.connectionPoint2 = connectionPoint2
        this.text = text
    }

    update() {
        if (this.type == "inheritance") {
            let lineGroup = this.shapeLayer.group().addClass("UMLInheritanceRelationship")
            drawInheritanceRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == "composition") {
            let lineGroup = this.shapeLayer.group().addClass("UMLCompositionRelationship")
            drawCompositionOrAggregationRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == "aggregation") {
            let lineGroup = this.shapeLayer.group().addClass("UMLAggregationRelationship")
            drawCompositionOrAggregationRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        }
        this.uptodate = true
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
function drawInheritanceRelationship(lineGroup, connectionPoint1, connectionPoint2) {
    let connectorOrientation = getConnectorHeadOrientationFromPosition(connectionPoint2.position)
    let lineConnectionPoint = getInheritanceArrowLineConnectionPoint(connectionPoint2, connectorOrientation)
    drawConnectorLine(lineGroup, connectionPoint1, lineConnectionPoint, connectorOrientation)
    drawInheritanceArrow(lineGroup, connectionPoint2, connectorOrientation)
}

// Draws a composition connector between two classes
function drawCompositionOrAggregationRelationship(lineGroup, connectionPoint1, connectionPoint2) {
    let connectorOrientation = getConnectorHeadOrientationFromPosition(connectionPoint2.position)
    let lineConnectionPoint = getDiamondLineConnectionPoint(connectionPoint2, connectorOrientation)
    drawConnectorLine(lineGroup, connectionPoint1, lineConnectionPoint, connectorOrientation)
    drawDiamond(lineGroup, connectionPoint2, connectorOrientation)
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
        case ConnectionPointPosition.TopCenter:
            return ConnectorHeadOrientation.Down
        case ConnectionPointPosition.RightCenter:
            return ConnectorHeadOrientation.Left
        case ConnectionPointPosition.BottomCenter:
            return ConnectorHeadOrientation.Up
        case ConnectionPointPosition.LeftCenter:
            return ConnectorHeadOrientation.Right
    }
}

function getInheritanceArrowLineConnectionPoint(position, orientation) {
    let lineConnectionPoint = { x: 0, y: 0 }
    switch (orientation) {
        case ConnectorHeadOrientation.Right:
            lineConnectionPoint = { x: (position.x - 12), y: position.y }
            break

        case ConnectorHeadOrientation.Left:
            lineConnectionPoint = { x: (position.x + 12), y: position.y }
            break
            
        case ConnectorHeadOrientation.Up:
            lineConnectionPoint = { x: position.x, y: (position.y + 12) }
            break

        case ConnectorHeadOrientation.Down:
            lineConnectionPoint = { x: position.x, y: (position.y - 12) }
            break
    }
            
    return lineConnectionPoint
}

// Draws an arrow for an inheritance relationship. The arrow's tip
// is at the position gives as argument.
// It returns the point to which the line of the connector should
// be connected.
function drawInheritanceArrow(svg, position, orientation) {
    let secondPoint = { x: 0, y: 0 }
    let thirdPoint = { x: 0, y: 0 }
    switch (orientation) {
        case ConnectorHeadOrientation.Right:
            secondPoint = { x: (position.x - 12), y: (position.y - 10) }
            thirdPoint = { x: (position.x - 12), y: (position.y + 10) }
            break

        case ConnectorHeadOrientation.Left:
            secondPoint.x = (position.x + 12)
            secondPoint.y = (position.y - 10)
            thirdPoint.x = (position.x + 12)
            thirdPoint.y = (position.y + 10)    
            break
            
        case ConnectorHeadOrientation.Up:
            secondPoint.x = (position.x - 10)
            secondPoint.y = (position.y + 12)
            thirdPoint.x = (position.x + 10)
            thirdPoint.y = (position.y + 12)
            break

        case ConnectorHeadOrientation.Down:
            secondPoint.x = (position.x - 10)
            secondPoint.y = (position.y - 12)
            thirdPoint.x = (position.x + 10)
            thirdPoint.y = (position.y - 12)
            break
    }
            
    let polygonDescription = "" + position.x + "," + position.y + " " +
        secondPoint.x + "," + secondPoint.y + " " +
        thirdPoint.x + "," + thirdPoint.y                
    svg.polygon(polygonDescription)
}

function getDiamondLineConnectionPoint(position, orientation) {
    let thirdPoint = { x: 0, y: 0 }
    switch (orientation) {
        case ConnectorHeadOrientation.Right:
            thirdPoint = { x: (position.x - 20), y: position.y }
            break

        case ConnectorHeadOrientation.Left:
            thirdPoint = { x: (position.x + 20), y: position.y }
            break

        case ConnectorHeadOrientation.Up:
            thirdPoint = { x: position.x, y: (position.y + 20) }
            break

        case ConnectorHeadOrientation.Down:
            thirdPoint = { x: position.x, y: (position.y - 20) }
            break
    }

    return thirdPoint
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
}

function drawConnectorLine(svg, startPoint, endPoint, orientation) {
    switch (orientation) {
        case ConnectorHeadOrientation.Up:
        case ConnectorHeadOrientation.Down:
            if (endPoint.x == startPoint.x) {
                svg.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
            } else {
                let middleY = (endPoint.y + ((startPoint.y - endPoint.y)/2))
                svg.line(startPoint.x, startPoint.y, startPoint.x, middleY)
                svg.line(startPoint.x, middleY, endPoint.x, middleY)
                svg.line(endPoint.x, middleY, endPoint.x, endPoint.y)                 
            }
            break

        case ConnectorHeadOrientation.Left:
        case ConnectorHeadOrientation.Right:
            if (endPoint.y == startPoint.y) {
                svg.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
            } else {
                let middleX = (endPoint.x + ((startPoint.x - endPoint.x)/2))
                svg.line(startPoint.x, startPoint.y, middleX, startPoint.y)
                svg.line(middleX, startPoint.y, middleX, endPoint.y)
                svg.line(middleX, endPoint.y, endPoint.x, endPoint.y)
            }
            break
    }
}

export { Connector }
