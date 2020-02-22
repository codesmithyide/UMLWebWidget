/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import { DiagramElementType } from "./DiagramElement"
import { DiagramElement } from "./DiagramElement"
import { ConnectionPointPosition } from "./ConnectionPointPosition"

/**
 * <p>
 *   The point where an element and a connector meet.
 * </p>
 *
 * <p>
 *   Although it derives from {@link DiagramElement} this element will probably be invisible to the user. However it may
 *   be useful to make the connection points visible under some circumstances like for instance when the diagram is
 *   being edited. </p>
 *
 *   @extends DiagramElement
 *   @property {DiagramElement} this.element - The element.
 *   @property {ConnectionPointPosition} this.position - The position of the connection point relative to the element.
*/
class ConnectionPoint extends DiagramElement {
    element: DiagramElement
    position: ConnectionPointPosition

    constructor(svg, element: DiagramElement,
                position: ConnectionPointPosition = ConnectionPointPosition.BottomCenter) {
        super(svg, DiagramElementType.ConnectionPoint, null)
        this.element = element
        this.position = position
    }

    setPosition(position: ConnectionPointPosition) {
        this.position = position

        let x: number = 0
        let y: number = 0
        let boundingbox = this.element.getConnectionPointsRectangle()
        if (boundingbox != null) {
            switch (this.position) {
                case ConnectionPointPosition.TopCenter:
                    x = boundingbox.cx
                    y = boundingbox.y
                    break

                case ConnectionPointPosition.RightCenter:
                    x = (boundingbox.x + boundingbox.width)
                    y = boundingbox.cy
                    break

                case ConnectionPointPosition.BottomCenter:
                    x = boundingbox.cx
                    y = (boundingbox.y + boundingbox.height)
                    break

                case ConnectionPointPosition.LeftCenter:
                    x = boundingbox.x
                    y = boundingbox.cy
                    break
            }
        } else {
            // TODO
        }

        this.move(x, y)
    }

}

export { ConnectionPoint }
