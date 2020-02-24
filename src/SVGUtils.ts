/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

class SVGUtils {

    static Rectangle(parent, left, top, width, height) {
        let rect = parent.rect(width, height).move(left, top)
        rect.id(null)
        return rect
    }

    static Line(parent, x1, y1, x2, y2) {
        let line = parent.line(x1, y1, x2, y2)
        line.id(null)
        return line
    }

}

export { SVGUtils }
