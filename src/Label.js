'use strict'

class Label {

    constructor(text) {
        this.text = text
    }

    empty() {
        return ((this.text != null) && (this.text != ""))
    }

}

export { Label }
