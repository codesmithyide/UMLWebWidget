'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { ConnectionPointPosition } from "./ConnectionPointPosition.js"

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
*/
class ConnectionPoint extends DiagramElement {

    constructor(svg, element) {
        super(svg)
        this.element = element
    }

}

export { ConnectionPoint }
