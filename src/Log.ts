/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

/**
 * A class used to log diagram events, mostly useful for debugging only.
 */
class Log {
    level: number

    constructor(level: string) {
        switch (level) {
            case "none":
                this.level = 0
                break

            case "error":
                this.level = 1
                break

            case "warn":
                this.level = 2
                break

            case "info":
                this.level = 3
                break

            case "debug":
                this.level = 4
                break

            case "trace":
                this.level = 5
                break
        }
    }

    error(message) {
        if (this.level >= 1) {
            console.error(message)
        }
    }

    warn(message) {
        if (this.level >= 2) {
            console.warn(message)
        }
    }

    info(message) {
        if (this.level >= 3) {
            console.log(message)
        }
    }

    debug(message) {
        if (this.level >= 4) {
            console.log(message)
        }
    }

    trace(message) {
        if (this.level >= 5) {
            console.log(message)
        }
    }

}

export { Log }
