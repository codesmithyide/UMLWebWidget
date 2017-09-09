'use strict'

class Log {

    constructor(level) {
        switch (level) {
            case "debug":
                this.level = level
                break

            case "trace":
                this.level = level
                break
        }
    }

    debug(message) {
    }

    trace(message) {
    }

}

export { Log }
