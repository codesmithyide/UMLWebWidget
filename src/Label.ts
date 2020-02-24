/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

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
