'use strict'

import { ConnectionPointPosition } from "./ConnectionPointPosition.js"

/** Sets the position of the elements on the diagram. */
class LayoutManager {

    constructor(layout) {
        this.layout = layout
        if (this.layout == null) {
            this.layout = { }
        }
        if (this.layout.elements == null) {
            this.layout.elements = { }
        }
        if (this.layout.connectorpositions == null) {
            this.layout.connectorpositions = { }
        }
    }

    doLayout(diagram) {
        for (let classbox of diagram.classboxes.values()) {
            this.setElementPosition(classbox)
        }
        for (let lifeline of diagram.lifelines.values()) {
            this.setElementPosition(lifeline)
        }
        for (let component of diagram.components.values()) {
            this.setElementPosition(component)
        }
        for (let node of diagram.nodes.values()) {
            this.setElementPosition(node)
        }
        for (let actor of diagram.actors.values()) {
            this.setElementPosition(actor)
        }
        for (let usecase of diagram.usecases.values()) {
            this.setElementPosition(usecase)
        }
        this.layoutMessages(diagram.lifelines, diagram.messages)
    }

    setElementPosition(element) {
        let elementLayout = this.layout.elements[element.id]
        if (elementLayout) {
            if (elementLayout.position) {
                element.move(elementLayout.position.x, elementLayout.position.y)
            }
        }
    }

    layoutConnectors(connectors) {
        for (var i = 0; i < connectors.length; i++) {
            let connector = connectors[i]
            let connectionPoint1 = connector.connectionPoint1
            let connectionPoint2 = connector.connectionPoint2
            let bbox1 = connectionPoint1.element.getConnectionPointsRectangle()
            let bbox2 = connectionPoint2.element.getConnectionPointsRectangle()
            let connectionPositions = this.getConnectionPositions(bbox1, bbox2, connector.type)

            let connectorId = connectionPoint1.element.id + "-" + connectionPoint2.element.id + "-" + connector.type
            let layoutOverride = this.layout.elements[connectorId]
            if (layoutOverride) {
                if (layoutOverride.end) {
                    switch (layoutOverride.end) {
                        case "top-center":
                            connectionPositions.end = ConnectionPointPosition.TopCenter
                            break

                        case "right-center":
                            connectionPositions.end = ConnectionPointPosition.RightCenter
                            break

                       case "bottom-center":
                            connectionPositions.end = ConnectionPointPosition.BottomCenter
                            break

                        case "left-center":
                            connectionPositions.end = ConnectionPointPosition.LeftCenter
                            break
                    }
                }
            }

            connectionPoint1.setPosition(connectionPositions.start)
            connectionPoint2.setPosition(connectionPositions.end)
        }
    }

    layoutMessages(lifelines, connectors) {
        let nextYPosition = 0
        for (let lifeline of lifelines.values()) {
            nextYPosition = Math.max(nextYPosition, lifeline.getFirstConnectionPointPosition().y)
        }
        for (let connector of connectors) {
            let connectionPoint1 = connector.connectionPoint1
            let connectionPoint2 = connector.connectionPoint2
            let lifeline1 = connectionPoint1.element
            let lifeline2 = connectionPoint2.element
            if ((connector.type != "creationmessage") && (connector.type != "destructionmessage")) {
                if (lifeline1 != lifeline2) {
                    connectionPoint1.move(lifeline1.getLineTopPosition().x, nextYPosition)
                    connectionPoint2.move(lifeline2.getLineTopPosition().x, nextYPosition)
                    nextYPosition += 30
                } else {
                    connectionPoint1.move(lifeline1.getLineTopPosition().x, nextYPosition)
                    connectionPoint2.move(lifeline2.getLineTopPosition().x, nextYPosition + 20)
                    nextYPosition += 50
                }
            } else if (connector.type == "creationmessage") {
                lifeline2.move(lifeline2.x, nextYPosition)
                let y = lifeline2.getCreationConnectionPointPosition().y
                connectionPoint1.move(lifeline1.getLineTopPosition().x, y)
                connectionPoint2.move(lifeline2.getCreationConnectionPointPosition().x, y)
                nextYPosition += 50
            } else if (connector.type == "destructionmessage") {
                if (lifeline2.needToAdjustDestructionPosition()) {
                    connectionPoint2.move(lifeline2.getLineTopPosition().x, nextYPosition + 25)
                } else {
                    connectionPoint2.move(lifeline2.getLineTopPosition().x, nextYPosition)
                }
                nextYPosition += 30
            }
        }
        if (connectors.length > 0) {
            for (let lifeline of lifelines.values()) {
                lifeline.doLayout()
                lifeline.uptodate = false
            }
        }

        // Do a second pass to adjust the x position based on the width of the 
        // line which varies because of execution specifications
        for (let connector of connectors) {
            let connectionPoint1 = connector.connectionPoint1
            let connectionPoint2 = connector.connectionPoint2
            let lifeline1 = connectionPoint1.element
            let lifeline2 = connectionPoint2.element
            if (lifeline1 == lifeline2) {
                let y1 = connectionPoint1.y
                let x1 = connectionPoint1.x + lifeline1.getHorizontalOffset(y1, "right")
                connectionPoint1.move(x1, y1)
                let y2 = connectionPoint2.y
                let x2 = connectionPoint2.x + lifeline2.getHorizontalOffset(y2, "right")
                connectionPoint2.move(x2, y2)
            } else if (lifeline2.x >= lifeline1.x) {
                let y1 = connectionPoint1.y
                let x1 = connectionPoint1.x + lifeline1.getHorizontalOffset(y1, "right")
                connectionPoint1.move(x1, y1)
                let y2 = connectionPoint2.y
                let x2 = connectionPoint2.x + lifeline2.getHorizontalOffset(y2, "left")
                connectionPoint2.move(x2, y2)
            } else {
                let y1 = connectionPoint1.y
                let x1 = connectionPoint1.x + lifeline1.getHorizontalOffset(y1, "left")
                connectionPoint1.move(x1, y1)
                let y2 = connectionPoint2.y
                let x2 = connectionPoint2.x + lifeline2.getHorizontalOffset(y2, "right")
                connectionPoint2.move(x2, y2)

            }
            connector.uptodate = false
        }
    }

    getConnectionPositions(boundingbox1, boundingbox2, type) {
        let result = { 
            start: ConnectionPointPosition.TopCenter,
            end: ConnectionPointPosition.TopCenter
        }

        if (type != "usecaseassociation") {
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
        } else {
            if (boundingbox1.x < boundingbox2.x) {
                result.start = ConnectionPointPosition.RightCenter
                result.end = ConnectionPointPosition.LeftCenter
            } else if (boundingbox1.x > (boundingbox2.x + boundingbox2.width)) {
                result.start = ConnectionPointPosition.LeftCenter
                result.end = ConnectionPointPosition.RightCenter
            } else if (boundingbox1.y < boundingbox2.y) {
                result.start = ConnectionPointPosition.BottomCenter
                result.end = ConnectionPointPosition.TopCenter
            } else {
                result.start = ConnectionPointPosition.TopCenter
                result.end = ConnectionPointPosition.BottomCenter
            }
        }

        return result
    }
}

export { LayoutManager }
