'use strict'

import { DiagramElement } from "./DiagramElement.ts"
import { ConnectionPointPosition } from "./ConnectionPointPosition.ts"

/**
  <p>
    The point where an element and a connector meet.
  </p>

  <p>
    Although it derives from {@link DiagramElement} this
    element will probably be invisible to the user. 
    However it may be useful to make the connection points
    visible under some circumstances like for instance when
    the diagram is being edited.
  </p>

  @extends DiagramElement
  @property {DiagramElement} this.element - The element.
  @property {ConnectionPointPosition} this.position - The position
    of the connection point relative to the element.
*/
class ConnectionPoint extends DiagramElement {
    element
    position

    constructor(svg, element, position = ConnectionPointPosition.BottomCenter) {
        super(svg, null, null)
        this.element = element
        this.position = position
    }

    setPosition(position) {
        this.position = position

        let x = 0
        let y = 0
        let boundingbox = this.element.getConnectionPointsRectangle()

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

        this.move(x, y)
    }

}

export { ConnectionPoint }
