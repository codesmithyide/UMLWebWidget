'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { ConnectionPointPosition } from "./ConnectionPointPosition.js"
import { Label } from "./Label.js"

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
        this.label = null
        if (text != null) {
            this.label = new Label(text)
        }
        if ((this.label == null) && (type == "creationmessage")) {
            this.label = new Label("new")
        }
    }

    hasNonEmptyLabel() {
        return ((this.label != null) && !this.label.empty())
    }

    doUpdate() {
        this.layers.clearEachLayer()
        if (this.type == "inheritance") {
            let lineGroup = this.shapeLayer.group().addClass("UMLInheritanceRelationship")
            drawInheritanceRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == "composition") {
            let lineGroup = this.shapeLayer.group().addClass("UMLCompositionRelationship")
            drawCompositionOrAggregationRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == "aggregation") {
            let lineGroup = this.shapeLayer.group().addClass("UMLAggregationRelationship")
            drawCompositionOrAggregationRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == "synchronousmessage") {
            let lineGroup = this.shapeLayer.group().addClass("UMLSynchronousMessage")
            let textGroup = null
            if ((this.label != null) && (this.label.text != null) && (this.label.text != "")) {
                textGroup = this.textLayer.group()
            }
            drawSynchronousMessage(lineGroup, textGroup, this.connectionPoint1, this.connectionPoint2, this.label)
        } else if (this.type == "returnmessage") {
            // If this is return message of a self call draw nothing. It will be indicated on the diagram
            // by a reduction of the depth of the execution specification (i.e. the width of the lifeline)
            if ((this.connectionPoint1.element != null) && (this.connectionPoint1.element != this.connectionPoint2.element)) {
                let lineGroup = this.shapeLayer.group().addClass("UMLReturnMessage")
                drawReturnMessage(lineGroup, this.connectionPoint1, this.connectionPoint2)
            }
        } else if (this.type == "creationmessage") {
            let lineGroup = this.shapeLayer.group().addClass("UMLCreationMessage")
            let textGroup = this.textLayer.group()
            drawSynchronousMessage(lineGroup, textGroup, this.connectionPoint1, this.connectionPoint2, this.label)
        } else if (this.type == "destructionmessage") {
            let lineGroup = this.shapeLayer.group().addClass("UMLDestructionMessage")
            drawDestructionMessage(lineGroup, this.connectionPoint2)
        } else if (this.type == "usecaseassociation") {
            let lineGroup = this.shapeLayer.group().addClass("UMLUseCaseAssociation")
            drawUseCaseAssociation(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == "assemblyconnector") {
            let lineGroup = this.shapeLayer.group().addClass("UMLAssemblyConnector")
            drawAssemblyConnector(lineGroup, this.connectionPoint1, this.connectionPoint2)
        }
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

function drawSynchronousMessage(lineGroup, textGroup, connectionPoint1, connectionPoint2, label) {
    if ((connectionPoint1.element != null) && (connectionPoint1.element == connectionPoint2.element)) {
        if ((textGroup != null) && (label != null) && (label.text != null) && (label.text != "")) {
            let textElement = textGroup.text(label.text)
            textElement.move(connectionPoint1.x + 8, connectionPoint1.y - textElement.bbox().height - 3)
        }

        lineGroup.line(connectionPoint1.x, connectionPoint1.y, connectionPoint1.x + 30, connectionPoint1.y)
        lineGroup.line(connectionPoint1.x + 30, connectionPoint1.y, connectionPoint1.x + 30, connectionPoint2.y)
        lineGroup.line(connectionPoint1.x + 30, connectionPoint2.y, connectionPoint2.x + 12, connectionPoint2.y)
        let polygonDescription = "" + connectionPoint2.x + "," + connectionPoint2.y + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y - 6) + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y + 6)
        lineGroup.polygon(polygonDescription)
    } else if (connectionPoint1.x < connectionPoint2.x) {
        if ((textGroup != null) && (label != null) && (label.text != null) && (label.text != "")) {
            let textElement = textGroup.text(label.text)
            
            let width = (connectionPoint2.x - connectionPoint1.x)
            if (textElement.bbox().width < width) {
                textElement.move((connectionPoint1.x + ((width - textElement.bbox().width) / 2)), connectionPoint1.y - textElement.bbox().height - 2)
            } else {
                textElement.move(connectionPoint1.x + 2, connectionPoint1.y - 6 - textElement.bbox().height - 2)
            }
        }

        lineGroup.line(connectionPoint1.x, connectionPoint1.y, connectionPoint2.x - 12, connectionPoint2.y)
        let polygonDescription = "" + (connectionPoint2.x - 12) + "," + (connectionPoint2.y - 6) + " " +
            connectionPoint2.x + "," + connectionPoint2.y + " " +
            (connectionPoint2.x - 12) + "," + (connectionPoint2.y + 6)
        lineGroup.polygon(polygonDescription)
    } else if (connectionPoint1.x > connectionPoint2.x) {
        if ((textGroup != null) && (label != null) && (label.text != null) && (label.text != "")) {
            let textElement = textGroup.text(label.text)
            
            let width = (connectionPoint1.x - connectionPoint2.x)
            if (textElement.bbox().width < width) {
                textElement.move((connectionPoint2.x + ((width - textElement.bbox().width) / 2)), connectionPoint2.y - textElement.bbox().height - 2)
            } else {
                textElement.move(connectionPoint2.x + 2, connectionPoint2.y - 6 - textElement.bbox().height - 2)
            }
        }

        lineGroup.line(connectionPoint1.x, connectionPoint1.y, connectionPoint2.x + 12, connectionPoint2.y)
        let polygonDescription = "" + (connectionPoint2.x + 12) + "," + (connectionPoint2.y - 6) + " " +
            connectionPoint2.x + "," + connectionPoint2.y + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y + 6)
        lineGroup.polygon(polygonDescription)
    } else {
        if ((textGroup != null) && (label != null) && (label.text != null) && (label.text != "")) {
            let textElement = textGroup.text(label.text)
            textElement.move(connectionPoint1.x + 8, connectionPoint1.y - textElement.bbox().height - 3)
        }

        lineGroup.line(connectionPoint1.x, connectionPoint1.y, connectionPoint1.x + 30, connectionPoint1.y)
        lineGroup.line(connectionPoint1.x + 30, connectionPoint1.y, connectionPoint2.x + 30, connectionPoint2.y)
        lineGroup.line(connectionPoint2.x + 30, connectionPoint2.y, connectionPoint2.x + 12, connectionPoint2.y)
        let polygonDescription = "" + connectionPoint2.x + "," + connectionPoint2.y + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y - 6) + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y + 6)
        lineGroup.polygon(polygonDescription)
    }
}

function drawReturnMessage(lineGroup, connectionPoint1, connectionPoint2) {
    lineGroup.line(connectionPoint1.x, connectionPoint1.y, connectionPoint2.x, connectionPoint1.y).attr("stroke-dasharray", "4, 4")
    if (connectionPoint2.x >= connectionPoint1.x) {
        lineGroup.line(connectionPoint2.x, connectionPoint1.y, connectionPoint2.x - 10, connectionPoint2.y - 6)
        lineGroup.line(connectionPoint2.x, connectionPoint1.y, connectionPoint2.x - 10, connectionPoint2.y + 6)
    } else {
        lineGroup.line(connectionPoint2.x, connectionPoint1.y, connectionPoint2.x + 10, connectionPoint2.y - 6)
        lineGroup.line(connectionPoint2.x, connectionPoint1.y, connectionPoint2.x + 10, connectionPoint2.y + 6)
    }
}

function drawDestructionMessage(lineGroup, connectionPoint2) {
    let halfWidth = 10
    let halfHeight = 10
    lineGroup.line(
        connectionPoint2.x - halfWidth, connectionPoint2.y - halfHeight,
        connectionPoint2.x + halfWidth, connectionPoint2.y + halfHeight
    )
    lineGroup.line(
        connectionPoint2.x - halfWidth, connectionPoint2.y + halfHeight,
        connectionPoint2.x + halfWidth, connectionPoint2.y - halfHeight
    )
}

function drawUseCaseAssociation(lineGroup, connectionPoint1, connectionPoint2) {
    lineGroup.line(connectionPoint1.x, connectionPoint1.y, connectionPoint2.x, connectionPoint2.y)
}

function drawAssemblyConnector(lineGroup, connectionPoint1, connectionPoint2) {
    if (connectionPoint1.x < connectionPoint2.x) {
        lineGroup.line(connectionPoint1.x, connectionPoint1.y, connectionPoint2.x, connectionPoint2.y).attr("stroke-dasharray", "8, 4")
    } else {
        let middlePoint = (connectionPoint1.y + ((connectionPoint2.y - connectionPoint1.y) / 2))
        lineGroup.line(connectionPoint1.x, connectionPoint1.y, connectionPoint1.x + 25, connectionPoint1.y).attr("stroke-dasharray", "8, 4")
        lineGroup.line(connectionPoint1.x + 25, connectionPoint1.y, connectionPoint1.x + 25, middlePoint).attr("stroke-dasharray", "8, 4")
        lineGroup.line(connectionPoint1.x + 25, middlePoint, connectionPoint2.x - 35, middlePoint).attr("stroke-dasharray", "8, 4")
        lineGroup.line(connectionPoint2.x - 35, middlePoint, connectionPoint2.x - 35, connectionPoint2.y).attr("stroke-dasharray", "8, 4")
        lineGroup.line(connectionPoint2.x - 35, connectionPoint2.y, connectionPoint2.x, connectionPoint2.y).attr("stroke-dasharray", "8, 4")
    }
    lineGroup.line(connectionPoint2.x - 13, connectionPoint2.y + 5, connectionPoint2.x, connectionPoint2.y)
    lineGroup.line(connectionPoint2.x - 13, connectionPoint2.y - 5, connectionPoint2.x, connectionPoint2.y)
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
            let shape1 = getConnectorLineShape1(startPoint, endPoint, orientation)
            switch (shape1) {
                case ConnectorLineShape.Straight:
                    svg.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
                    break

                case ConnectorLineShape.TopRightCorner:
                case ConnectorLineShape.TopLeftCorner:
                case ConnectorLineShape.BottomRightCorner:
                case ConnectorLineShape.BottomLeftCorner:
                    svg.line(startPoint.x, startPoint.y, endPoint.x, startPoint.y)
                    svg.line(endPoint.x, startPoint.y, endPoint.x, endPoint.y)
                    break

                case ConnectorLineShape.HorizontalStep:
                    let middleY = (endPoint.y + ((startPoint.y - endPoint.y)/2))
                    svg.line(startPoint.x, startPoint.y, startPoint.x, middleY)
                    svg.line(startPoint.x, middleY, endPoint.x, middleY)
                    svg.line(endPoint.x, middleY, endPoint.x, endPoint.y)
                    break
            }
            break

        case ConnectorHeadOrientation.Left:
        case ConnectorHeadOrientation.Right:
            let shape2 = getConnectorLineShape2(startPoint, endPoint, orientation)
            switch (shape2) {
                case ConnectorLineShape.Straight:
                    svg.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
                    break

                case ConnectorLineShape.TopRightCorner:
                case ConnectorLineShape.TopLeftCorner:
                case ConnectorLineShape.BottomRightCorner:
                case ConnectorLineShape.BottomLeftCorner:
                    svg.line(startPoint.x, startPoint.y, startPoint.x, endPoint.y)
                    svg.line(startPoint.x, endPoint.y, endPoint.x, endPoint.y)
                    break

                case ConnectorLineShape.VerticalStep:
                    let middleX = (endPoint.x + ((startPoint.x - endPoint.x)/2))
                    svg.line(startPoint.x, startPoint.y, middleX, startPoint.y)
                    svg.line(middleX, startPoint.y, middleX, endPoint.y)
                    svg.line(middleX, endPoint.y, endPoint.x, endPoint.y)
                    break
            }
            break
    }
}

// Orientation of the head (e.g. arrow or diamond)
// of a connector
var ConnectorLineShape = {
    Straight: 0,
    TopRightCorner: 1,
    TopLeftCorner: 2,
    BottomRightCorner: 3,
    BottomLeftCorner: 4,
    HorizontalStep: 5,
    VerticalStep: 6
}

function getConnectorLineShape1(startPoint, endPoint, orientation) {
    let result = ConnectorLineShape.Straight
    if (endPoint.x == startPoint.x) {
        result = ConnectorLineShape.Straight
    } else if ((orientation == ConnectorHeadOrientation.Down) && (startPoint.position == ConnectionPointPosition.RightCenter)) {
        result = ConnectorLineShape.TopRightCorner
    } else if ((orientation == ConnectorHeadOrientation.Down) && (startPoint.position == ConnectionPointPosition.LeftCenter)) {
        result = ConnectorLineShape.TopLeftCorner
    } else if ((orientation == ConnectorHeadOrientation.Up) && (startPoint.position == ConnectionPointPosition.RightCenter)) {
        result = ConnectorLineShape.BottomRightCorner
    } else if ((orientation == ConnectorHeadOrientation.Up) && (startPoint.position == ConnectionPointPosition.LeftCenter)) {
        result = ConnectorLineShape.BottomLeftCorner
    } else {
        result = ConnectorLineShape.HorizontalStep
    }
    return result
}

function getConnectorLineShape2(startPoint, endPoint, orientation) {
    let result = ConnectorLineShape.Straight
    if (endPoint.y == startPoint.y) {
        result = ConnectorLineShape.Straight
    } else if ((orientation == ConnectorHeadOrientation.Right) && (startPoint.position == ConnectionPointPosition.BottomCenter)) {
        result = ConnectorLineShape.BottomLeftCorner
    } else if ((orientation == ConnectorHeadOrientation.Right) && (startPoint.position == ConnectionPointPosition.TopCenter)) {
        result = ConnectorLineShape.TopLeftCorner
    } else if ((orientation == ConnectorHeadOrientation.Left) && (startPoint.position == ConnectionPointPosition.BottomCenter)) {
        result = ConnectorLineShape.BottomRightCorner
    } else if ((orientation == ConnectorHeadOrientation.Left) && (startPoint.position == ConnectionPointPosition.TopCenter)) {
        result = ConnectorLineShape.TopRightCorner
    } else {
        result = ConnectorLineShape.VerticalStep
    }
    return result
}

export { Connector }
