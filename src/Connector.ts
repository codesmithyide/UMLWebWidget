/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import { DiagramElement, DiagramElementType } from "./DiagramElement"
import { ConnectionPointPosition } from "./ConnectionPointPosition"
import { Label } from "./Label"
import { ConnectionPoint } from "./ConnectionPoint"
import { SVGUtils } from "./SVGUtils"
import { SVGLayer } from "./SVGLayer"
import { CSSClassName } from "./CSSClassNames"

/**
  Represents a connector between elements.

  @extends DiagramElement
*/
class Connector extends DiagramElement {
    shapeLayer: SVGLayer
    textLayer: SVGLayer
    type: string
    connectionPoint1: ConnectionPoint
    connectionPoint2: ConnectionPoint
    cssParentGroupClass: string
    label: Label | null

    constructor(svg, type, connectionPoint1: ConnectionPoint, connectionPoint2: ConnectionPoint, text) {
        super(svg, type, null)
        this.setType(type)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.connectionPoint1 = connectionPoint1
        this.connectionPoint2 = connectionPoint2
        this.label = null
        if (text != null) {
            this.label = new Label(text)
        }
        if ((this.label == null) && (type == DiagramElementType.CreationMessageConnector)) {
            this.label = new Label("new")
        }
    }

    draw(): void {
        this.update()
        switch (this.type) {
            case DiagramElementType.InheritanceConnector:
            case DiagramElementType.CompositionConnector:
            case DiagramElementType.AggregationConnector:
            case DiagramElementType.CreationMessageConnector:
            case DiagramElementType.SynchronousMessageConnector:
            case DiagramElementType.ReturnMessageConnector:
            case DiagramElementType.DestructionMessageConnector:
            case DiagramElementType.UseCaseAssociationConnector:
            case DiagramElementType.AssemblyConnector:
                let g = this.layers.svg.group().addClass(this.cssParentGroupClass)
                g.id(this.id)
                this.layers.getLayer("shape").write(g)
                this.layers.getLayer("text").write(g)
                break

            default:
                this.layers.getLayer("shape").write()
                this.layers.getLayer("text").write()
                break
        }
    }

    hasNonEmptyLabel() {
        return ((this.label != null) && !this.label.empty())
    }

    doUpdate() {
        this.layers.clearEachLayer()
        if (this.type == DiagramElementType.InheritanceConnector) {
            let lineGroup = this.shapeLayer.group().addClass(CSSClassName.ConnectorShape)
            drawInheritanceRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == DiagramElementType.CompositionConnector) {
            let lineGroup = this.shapeLayer.group().addClass(CSSClassName.ConnectorShape)
            drawCompositionOrAggregationRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == DiagramElementType.AggregationConnector) {
            let lineGroup = this.shapeLayer.group().addClass(CSSClassName.ConnectorShape)
            drawCompositionOrAggregationRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == DiagramElementType.SynchronousMessageConnector) {
            let lineGroup = this.shapeLayer.group().addClass(CSSClassName.ConnectorShape)
            let textGroup = null
            if ((this.label != null) && (this.label.text != null) && (this.label.text != "")) {
                textGroup = this.textLayer.group().addClass(CSSClassName.ConnectorLabel)
            }
            drawSynchronousMessage(lineGroup, textGroup, this.connectionPoint1, this.connectionPoint2, this.label)
        } else if (this.type == DiagramElementType.ReturnMessageConnector) {
            // If this is return message of a self call draw nothing. It will be indicated on the diagram by a reduction
            // of the depth of the execution specification (i.e. the width of the lifeline)
            if ((this.connectionPoint1.element != null) && (this.connectionPoint1.element != this.connectionPoint2.element)) {
                let lineGroup = this.shapeLayer.group().addClass(CSSClassName.ConnectorShape)
                drawReturnMessage(lineGroup, this.connectionPoint1, this.connectionPoint2)
            }
        } else if (this.type == DiagramElementType.CreationMessageConnector) {
            let lineGroup = this.shapeLayer.group().addClass(CSSClassName.ConnectorShape)
            let textGroup = this.textLayer.group().addClass(CSSClassName.ConnectorLabel)
            drawSynchronousMessage(lineGroup, textGroup, this.connectionPoint1, this.connectionPoint2, this.label)
        } else if (this.type == DiagramElementType.DestructionMessageConnector) {
            let lineGroup = this.shapeLayer.group().addClass(CSSClassName.ConnectorShape)
            drawDestructionMessage(lineGroup, this.connectionPoint2)
        } else if (this.type == DiagramElementType.UseCaseAssociationConnector) {
            let lineGroup = this.shapeLayer.group().addClass(CSSClassName.ConnectorShape)
            drawUseCaseAssociation(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == DiagramElementType.AssemblyConnector) {
            let lineGroup = this.shapeLayer.group().addClass(CSSClassName.ConnectorShape)
            drawAssemblyConnector(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == "communicationpath") {
            let lineGroup = this.shapeLayer.group().addClass("UMLCommunicationPath")
            drawCommunicationPath(lineGroup, this.connectionPoint1, this.connectionPoint2)
        }
    }

    setType(type: string) {
        switch (type) {
            case DiagramElementType.InheritanceConnector:
                this.cssParentGroupClass = CSSClassName.InheritanceConnector
                break

            case DiagramElementType.CompositionConnector:
                this.cssParentGroupClass = CSSClassName.CompositionConnector
                break

            case DiagramElementType.AggregationConnector:
                this.cssParentGroupClass = CSSClassName.AggregationConnector
                break

            case DiagramElementType.CreationMessageConnector:
                this.cssParentGroupClass = CSSClassName.CreationMessageConnector
                break

            case DiagramElementType.SynchronousMessageConnector:
                this.cssParentGroupClass = CSSClassName.SynchronousMessageConnector
                break

            case DiagramElementType.ReturnMessageConnector:
                this.cssParentGroupClass = CSSClassName.ReturnMessageConnector
                break

            case DiagramElementType.DestructionMessageConnector:
                this.cssParentGroupClass = CSSClassName.DestructionMessageConnector
                break

            case DiagramElementType.UseCaseAssociationConnector:
                this.cssParentGroupClass = CSSClassName.UseCaseAssociationConnector
                break

            case DiagramElementType.AssemblyConnector:
                this.cssParentGroupClass = CSSClassName.AssemblyConnector
                break
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
            let textElement = SVGUtils.Text(textGroup, 0, 0, label.text)
            textElement.move(connectionPoint1.x + 8, connectionPoint1.y - textElement.bbox().height - 3)
        }

        SVGUtils.Line(lineGroup, connectionPoint1.x, connectionPoint1.y, connectionPoint1.x + 30, connectionPoint1.y)
        SVGUtils.Line(lineGroup, connectionPoint1.x + 30, connectionPoint1.y, connectionPoint1.x + 30, connectionPoint2.y)
        SVGUtils.Line(lineGroup,connectionPoint1.x + 30, connectionPoint2.y, connectionPoint2.x + 12, connectionPoint2.y)
        let polygonDescription = "" + connectionPoint2.x + "," + connectionPoint2.y + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y - 6) + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y + 6)
        SVGUtils.Polygon(lineGroup, polygonDescription)
    } else if (connectionPoint1.x < connectionPoint2.x) {
        if ((textGroup != null) && (label != null) && (label.text != null) && (label.text != "")) {
            let textElement = SVGUtils.Text(textGroup, 0, 0, label.text)
            
            let width = (connectionPoint2.x - connectionPoint1.x)
            if (textElement.bbox().width < width) {
                textElement.move((connectionPoint1.x + ((width - textElement.bbox().width) / 2)), connectionPoint1.y - textElement.bbox().height - 2)
            } else {
                textElement.move(connectionPoint1.x + 2, connectionPoint1.y - 6 - textElement.bbox().height - 2)
            }
        }

        SVGUtils.Line(lineGroup, connectionPoint1.x, connectionPoint1.y, connectionPoint2.x - 12, connectionPoint2.y)
        let polygonDescription = "" + (connectionPoint2.x - 12) + "," + (connectionPoint2.y - 6) + " " +
            connectionPoint2.x + "," + connectionPoint2.y + " " +
            (connectionPoint2.x - 12) + "," + (connectionPoint2.y + 6)
        SVGUtils.Polygon(lineGroup, polygonDescription)
    } else if (connectionPoint1.x > connectionPoint2.x) {
        if ((textGroup != null) && (label != null) && (label.text != null) && (label.text != "")) {
            let textElement = SVGUtils.Text(textGroup, 0, 0, label.text)
            
            let width = (connectionPoint1.x - connectionPoint2.x)
            if (textElement.bbox().width < width) {
                textElement.move((connectionPoint2.x + ((width - textElement.bbox().width) / 2)), connectionPoint2.y - textElement.bbox().height - 2)
            } else {
                textElement.move(connectionPoint2.x + 2, connectionPoint2.y - 6 - textElement.bbox().height - 2)
            }
        }

        SVGUtils.Line(lineGroup, connectionPoint1.x, connectionPoint1.y, connectionPoint2.x + 12, connectionPoint2.y)
        let polygonDescription = "" + (connectionPoint2.x + 12) + "," + (connectionPoint2.y - 6) + " " +
            connectionPoint2.x + "," + connectionPoint2.y + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y + 6)
        SVGUtils.Polygon(lineGroup, polygonDescription)
    } else {
        if ((textGroup != null) && (label != null) && (label.text != null) && (label.text != "")) {
            let textElement = SVGUtils.Text(textGroup, 0, 0, label.text)
            textElement.move(connectionPoint1.x + 8, connectionPoint1.y - textElement.bbox().height - 3)
        }

        SVGUtils.Line(lineGroup, connectionPoint1.x, connectionPoint1.y, connectionPoint1.x + 30, connectionPoint1.y)
        SVGUtils.Line(lineGroup,connectionPoint1.x + 30, connectionPoint1.y, connectionPoint2.x + 30, connectionPoint2.y)
        SVGUtils.Line(lineGroup,connectionPoint2.x + 30, connectionPoint2.y, connectionPoint2.x + 12, connectionPoint2.y)
        let polygonDescription = "" + connectionPoint2.x + "," + connectionPoint2.y + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y - 6) + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y + 6)
        SVGUtils.Polygon(lineGroup, polygonDescription)
    }
}

function drawReturnMessage(lineGroup, connectionPoint1, connectionPoint2) {
    SVGUtils.Line(lineGroup, connectionPoint1.x, connectionPoint1.y, connectionPoint2.x, connectionPoint1.y).attr("stroke-dasharray", "4, 4")
    if (connectionPoint2.x >= connectionPoint1.x) {
        SVGUtils.Line(lineGroup, connectionPoint2.x, connectionPoint1.y, connectionPoint2.x - 10, connectionPoint2.y - 6)
        SVGUtils.Line(lineGroup, connectionPoint2.x, connectionPoint1.y, connectionPoint2.x - 10, connectionPoint2.y + 6)
    } else {
        SVGUtils.Line(lineGroup, connectionPoint2.x, connectionPoint1.y, connectionPoint2.x + 10, connectionPoint2.y - 6)
        SVGUtils.Line(lineGroup, connectionPoint2.x, connectionPoint1.y, connectionPoint2.x + 10, connectionPoint2.y + 6)
    }
}

function drawDestructionMessage(lineGroup, connectionPoint2) {
    let halfWidth = 10
    let halfHeight = 10
    SVGUtils.Line(lineGroup, connectionPoint2.x - halfWidth, connectionPoint2.y - halfHeight, connectionPoint2.x + halfWidth, connectionPoint2.y + halfHeight)
    SVGUtils.Line(lineGroup, connectionPoint2.x - halfWidth, connectionPoint2.y + halfHeight, connectionPoint2.x + halfWidth, connectionPoint2.y - halfHeight)
}

function drawUseCaseAssociation(lineGroup, connectionPoint1, connectionPoint2) {
    SVGUtils.Line(lineGroup, connectionPoint1.x, connectionPoint1.y, connectionPoint2.x, connectionPoint2.y)
}

function drawAssemblyConnector(lineGroup, connectionPoint1, connectionPoint2) {
    if (connectionPoint1.x < connectionPoint2.x) {
        SVGUtils.Line(lineGroup, connectionPoint1.x, connectionPoint1.y, connectionPoint2.x, connectionPoint2.y).attr("stroke-dasharray", "8, 4")
    } else {
        let middlePoint = (connectionPoint1.y + ((connectionPoint2.y - connectionPoint1.y) / 2))
        SVGUtils.Line(lineGroup, connectionPoint1.x, connectionPoint1.y, connectionPoint1.x + 25, connectionPoint1.y).attr("stroke-dasharray", "8, 4")
        SVGUtils.Line(lineGroup, connectionPoint1.x + 25, connectionPoint1.y, connectionPoint1.x + 25, middlePoint).attr("stroke-dasharray", "8, 4")
        SVGUtils.Line(lineGroup, connectionPoint1.x + 25, middlePoint, connectionPoint2.x - 35, middlePoint).attr("stroke-dasharray", "8, 4")
        SVGUtils.Line(lineGroup, connectionPoint2.x - 35, middlePoint, connectionPoint2.x - 35, connectionPoint2.y).attr("stroke-dasharray", "8, 4")
        SVGUtils.Line(lineGroup, connectionPoint2.x - 35, connectionPoint2.y, connectionPoint2.x, connectionPoint2.y).attr("stroke-dasharray", "8, 4")
    }
    SVGUtils.Line(lineGroup, connectionPoint2.x - 13, connectionPoint2.y + 5, connectionPoint2.x, connectionPoint2.y)
    SVGUtils.Line(lineGroup, connectionPoint2.x - 13, connectionPoint2.y - 5, connectionPoint2.x, connectionPoint2.y)
}

function drawCommunicationPath(lineGroup, connectionPoint1, connectionPoint2) {
    SVGUtils.Line(lineGroup, connectionPoint1.x, connectionPoint1.y, connectionPoint2.x, connectionPoint2.y)
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
        default:
            throw new Error("Invalid value for ConnectionPointPosition")
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
    SVGUtils.Polygon(svg, polygonDescription)
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
                    SVGUtils.Line(svg, startPoint.x, startPoint.y, endPoint.x, endPoint.y)
                    break

                case ConnectorLineShape.TopRightCorner:
                case ConnectorLineShape.TopLeftCorner:
                case ConnectorLineShape.BottomRightCorner:
                case ConnectorLineShape.BottomLeftCorner:
                    SVGUtils.Line(svg, startPoint.x, startPoint.y, endPoint.x, startPoint.y)
                    SVGUtils.Line(svg, endPoint.x, startPoint.y, endPoint.x, endPoint.y)
                    break

                case ConnectorLineShape.HorizontalStep:
                    let middleY = (endPoint.y + ((startPoint.y - endPoint.y)/2))
                    SVGUtils.Line(svg, startPoint.x, startPoint.y, startPoint.x, middleY)
                    SVGUtils.Line(svg, startPoint.x, middleY, endPoint.x, middleY)
                    SVGUtils.Line(svg, endPoint.x, middleY, endPoint.x, endPoint.y)
                    break
            }
            break

        case ConnectorHeadOrientation.Left:
        case ConnectorHeadOrientation.Right:
            let shape2 = getConnectorLineShape2(startPoint, endPoint, orientation)
            switch (shape2) {
                case ConnectorLineShape.Straight:
                    SVGUtils.Line(svg, startPoint.x, startPoint.y, endPoint.x, endPoint.y)
                    break

                case ConnectorLineShape.TopRightCorner:
                case ConnectorLineShape.TopLeftCorner:
                case ConnectorLineShape.BottomRightCorner:
                case ConnectorLineShape.BottomLeftCorner:
                    SVGUtils.Line(svg, startPoint.x, startPoint.y, startPoint.x, endPoint.y)
                    SVGUtils.Line(svg, startPoint.x, endPoint.y, endPoint.x, endPoint.y)
                    break

                case ConnectorLineShape.VerticalStep:
                    let middleX = (endPoint.x + ((startPoint.x - endPoint.x)/2))
                    SVGUtils.Line(svg, startPoint.x, startPoint.y, middleX, startPoint.y)
                    SVGUtils.Line(svg, middleX, startPoint.y, middleX, endPoint.y)
                    SVGUtils.Line(svg, middleX, endPoint.y, endPoint.x, endPoint.y)
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
