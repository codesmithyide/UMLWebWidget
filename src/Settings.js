'use strict'

export class Settings {    

    constructor(jsonSettings) {
        this.width = 600
        this.height = 200
        this.canMove = false
        this.canResize = false
        this.debug = false

        if (jsonSettings) {
            if (jsonSettings.width) {
                this.width = jsonSettings.width
            }
            if (jsonSettings.height) {
                this.height = jsonSettings.height
            }
            if (jsonSettings.interactive) {
                if (jsonSettings.interactive.canMove) {
                    this.canMove = jsonSettings.interactive.canMove
                }
            }
        }
    }
}
