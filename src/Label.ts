'use strict'

class Label {
    text

    constructor(text) {
        this.text = text
    }

    empty() {
        return ((this.text == null) || (this.text == ""))
    }

}

export { Label }
