/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

/**
 * The position of a connection point. These are not the coordinates of the connection point but a description of where
 * the connection point should be relative to the element.
 */
class ConnectionPointPosition {
    type

    constructor(type) {
        switch (type) {
            case "top-center":
                this.type = topCenter
                break

            case "top-right":
                this.type = topRight
                break

            case "right-center":
                this.type = rightCenter
                break

            case "bottom-right":
                this.type = bottomRight
                break

            case "bottom-center":
                this.type = bottomCenter
                break

            case "bottom-left":
                this.type = bottomLeft
                break

            case "left-center":
                this.type = leftCenter
                break

            case "top-left":
                this.type = topLeft
                break
        }
    }

    equals(other) {
        return (this.type === other.type)
    }

    static get TopCenter() {
        return staticTopCenter
    }

    static get TopRight() {
        return staticTopRight
    }

    static get RightCenter() {
        return staticRightCenter
    }

    static get BottomRight() {
        return staticBottomRight
    }

    static get BottomCenter() {
        return staticBottomCenter
    }

    static get BottomLeft() {
        return staticBottomLeft
    }

    static get LeftCenter() {
        return staticLeftCenter
    }

    static get TopLeft() {
        return staticTopLeft
    }
}

let topCenter = 0
let topRight = 1
let rightCenter = 2
let bottomRight = 3
let bottomCenter = 4
let bottomLeft = 5
let leftCenter = 6
let topLeft = 7

let staticTopCenter = new ConnectionPointPosition("top-center")
let staticTopRight = new ConnectionPointPosition("top-right")
let staticRightCenter = new ConnectionPointPosition("right-center")
let staticBottomRight = new ConnectionPointPosition("bottom-right")
let staticBottomCenter = new ConnectionPointPosition("bottom-center")
let staticBottomLeft = new ConnectionPointPosition("bottom-left")
let staticLeftCenter = new ConnectionPointPosition("left-center")
let staticTopLeft = new ConnectionPointPosition("top-left")

export { ConnectionPointPosition }
