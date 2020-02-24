/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

/** Style settings. */
export class Style {
    style

    constructor() {
        this.style = {
            "defaults": {
                "margin-left": 12,
                "margin-right": 12,
                "margin-top": 9,
                "margin-bottom": 9
            },
            "codesmithy-uml-diagram__classtemplate": {
                "margin-right": 15,
                "margin-top": 12
            },
            "classtemplateparameters": {
                "margin-left": 8,
                "margin-right": 8,
                "margin-top": 4,
                "margin-bottom": 4
            },
            "lifeline": {
                "execution-specification-bar-width": 8,
                "execution-specification-bar-overhang": 5,
                "execution-specification-bar-margin": 15
            }
        }
    }

    getTopMargin(element) {
        return this.getValueOrDefault(this, element, "margin-top")
    }

    getBottomMargin(element) {
        return this.getValueOrDefault(this, element, "margin-bottom")
    }

    getLeftMargin(element) {
        return this.getValueOrDefault(this, element, "margin-left")
    }

    getRightMargin(element) {
        return this.getValueOrDefault(this, element, "margin-right")
    }

    getExecutionSpecificationBarWidth() {
        return this.style.lifeline["execution-specification-bar-width"]
    }

    getExecutionSpecificationBarOverhang() {
        return this.style.lifeline["execution-specification-bar-overhang"]
    }

    getExecutionSpecificationBarMargin() {
        return this.style.lifeline["execution-specification-bar-margin"]
    }

    getValueOrDefault(self, element, style) {
        if (self.style[element] && self.style[element][style]) {
            return self.style[element][style]
        } else {
            return self.style["defaults"][style]
        }
    }

}
