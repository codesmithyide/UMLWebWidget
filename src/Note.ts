/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import { DiagramElement } from "./DiagramElement"

/**
  A note on a UML diagram.

  @extends DiagramElement
*/
class Note extends DiagramElement {
    shapeLayer
    textLayer
    noteDescription
    style

    constructor(svg, id, noteDescription, style) {
        super(svg, null, null)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.noteDescription = noteDescription
        this.style = style
    }

    update() {
        this.uptodate = true
    }

}

export { Note }
