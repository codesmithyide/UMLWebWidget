/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import { CSSClassName } from "./CSSClassNames"

/** Style settings. */
export class Style {
    style

    constructor() {
        this.style = new Map()
        this.style.set("defaults", {
            "margin-left": 12,
            "margin-right": 12,
            "margin-top": 9,
            "margin-bottom": 9
        })
        this.style.set(CSSClassName.ClassTemplate, {
            "margin-right": 15,
            "margin-top": 12
        })
        this.style.set(CSSClassName.ClassTemplate_ParametersCompartment, {
            "margin-left": 8,
            "margin-right": 8,
            "margin-top": 4,
            "margin-bottom": 4
        })
        this.style.set("lifeline", {
            "execution-specification-bar-width": 8,
            "execution-specification-bar-overhang": 5,
            "execution-specification-bar-margin": 15
        })
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
        return this.style.get("lifeline")["execution-specification-bar-width"]
    }

    getExecutionSpecificationBarOverhang() {
        return this.style.get("lifeline")["execution-specification-bar-overhang"]
    }

    getExecutionSpecificationBarMargin() {
        return this.style.get("lifeline")["execution-specification-bar-margin"]
    }

    getValueOrDefault(self, element, style) {
        if (self.style.get(element) && self.style.get(element)[style]) {
            return self.style.get(element)[style]
        } else {
            return self.style.get("defaults")[style]
        }
    }

}
