'use strict'

import { ConnectionPointPosition } from "./ConnectionPointPosition.js"

/** Sets the position of the elements on the diagram. */
export class LayoutManager {

    constructor(layout) {
        this.layout = layout
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
