'use strict'

class Label {
    text: string

    constructor(text: string) {
        this.text = text
    }

    empty(): boolean {
        return ((this.text == null) || (this.text == ""))
    }

}

export { Label }
