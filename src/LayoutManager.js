'use strict'

import { ConnectionPointPosition } from "./ConnectionPointPosition.js"

/** Sets the position of the elements on the diagram. */
export class LayoutManager {

    constructor(layout) {
        this.layout = layout
        if (this.layout == null) {
            this.layout = { }
        }
        if (this.layout.elements == null) {
            this.layout.elements = { }
        }
        if (this.layout.lifelinepositions == null) {
            this.layout.lifelinepositions = { }
        }
        if (this.layout.connectorpositions == null) {
            this.layout.connectorpositions = { }
        }
    }

    setElementPosition(element) {
        if (this.layout.elements[element.id]) {
            element.move(this.layout.elements[element.id].x, this.layout.elements[element.id].y)
        } else if (this.layout.lifelinepositions[element.id]) {
            element.move(this.layout.lifelinepositions[element.id].x, this.layout.lifelinepositions[element.id].y)
        }
    }

    layoutConnectors(connectors) {
        for (var i = 0; i < connectors.length; i++) {
            let connectionPoint1 = connectors[i].connectionPoint1
            let connectionPoint2 = connectors[i].connectionPoint2
            let bbox1 = connectionPoint1.element.getConnectionPointsRectangle()
            let bbox2 = connectionPoint2.element.getConnectionPointsRectangle()
            let connectionPositions = this.getConnectionPositions(bbox1, bbox2)

            let layoutOverride = this.layout.elements[connectionPoint1.element.classDescription.name + "-" + connectionPoint2.element.classDescription.name + "-aggregation"];
            if (layoutOverride) {
                if (layoutOverride.end) {
                    if (layoutOverride.end == "right-center") {
                        connectionPositions.end = ConnectionPointPosition.RightCenter
                    }
                }
            }

            connectionPoint1.setPosition(connectionPositions.start)
            connectionPoint2.setPosition(connectionPositions.end)
        }
    }

    layoutMessages(lifelines, connectors) {
        let nextYPosition = 0
        for (var i = 0; i < lifelines.length; i++) {
            nextYPosition = Math.max(nextYPosition, lifelines[i].getLineTopPosition().y + 20)
        }
        for (var i = 0; i < connectors.length; i++) {
            let connector = connectors[i]
            let lifeline1 = connector.connectionPoint1.element
            let lifeline2 = connector.connectionPoint2.element
            if (lifeline1 != lifeline2) {
                if (lifeline2.x >= lifeline1.x) {
                    connector.connectionPoint1.move(lifeline1.getLineTopPosition().x + (lifeline1.getActiveLineWidth() / 2), nextYPosition)
                    connector.connectionPoint2.move(lifeline2.getLineTopPosition().x - (lifeline2.getActiveLineWidth() / 2), nextYPosition)
                } else {
                    connector.connectionPoint1.move(lifeline1.getLineTopPosition().x - (lifeline1.getActiveLineWidth() / 2), nextYPosition)
                    connector.connectionPoint2.move(lifeline2.getLineTopPosition().x + (lifeline2.getActiveLineWidth() / 2), nextYPosition)
                }
                nextYPosition += connector.getHeight()
            } else {
                connector.connectionPoint1.move(lifeline1.getLineTopPosition().x + (lifeline1.getActiveLineWidth() / 2), nextYPosition)
                connector.connectionPoint2.move(lifeline2.getLineTopPosition().x + (lifeline2.getActiveLineWidth() / 2), nextYPosition + 20)
                nextYPosition += connector.getHeight()
            }
        }
        if (connectors.length > 0) {
            for (var i = 0; i < lifelines.length; i++) {
                lifelines[i].uptodate = false
            }
        }
    }

    getConnectionPositions(boundingbox1, boundingbox2) {
        let result = { 
            start: ConnectionPointPosition.TopCenter,
            end: ConnectionPointPosition.TopCenter
        }

        if ((boundingbox2.y + boundingbox2.height) < boundingbox1.y) {
            result.start = ConnectionPointPosition.TopCenter
            result.end = ConnectionPointPosition.BottomCenter
        } else if ((boundingbox1.y + boundingbox1.height) < boundingbox2.y) {
            result.start = ConnectionPointPosition.BottomCenter
            result.end = ConnectionPointPosition.TopCenter
        } else if ((boundingbox2.x + boundingbox2.width) < boundingbox1.x) {
            result.start = ConnectionPointPosition.LeftCenter
            result.end = ConnectionPointPosition.RightCenter
        } else if ((boundingbox1.x + boundingbox1.width) < boundingbox2.x) {
            result.start = ConnectionPointPosition.RightCenter
            result.end = ConnectionPointPosition.LeftCenter
        }

        return result
    }
}
