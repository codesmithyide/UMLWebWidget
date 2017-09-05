'use strict'

/** Style settings. */
export class Style {

    constructor() {
        this.style = {
            "defaults": {
                "margin-left": 12,
                "margin-right": 12,
                "margin-top": 9,
                "margin-bottom": 9
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
