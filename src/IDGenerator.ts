/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

class IdGenerator {
    private prefix: string

    constructor(prefix: string) {
        this.prefix = prefix
    }

    createId(type: string): string {
        return (this.prefix + "-" + type)
    }
}

export { IdGenerator }
