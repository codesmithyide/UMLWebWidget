'use strict'

/** Style */
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
                "margin-left": 12,
                "margin-right": 12,
                "margin-top": 9,
                "margin-bottom": 9
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

    getValueOrDefault(self, element, style) {
        if (self.style[element] && self.style[element][style]) {
            return self.style[element][style]
        } else {
            return self.style["defaults"][style]
        }
    }

}
