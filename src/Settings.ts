'use strict'

/**
  Diagram settings.

  @property {int} width - The width of the diagram in pixels.
  @property {height} height - The height of the diagram in pixels.
  @property {boolean} debug - If debug is true then additional checks
    and logging will be performed. This is false by default so that
    diagrams are displayed as well as possible regardless
    of errors. It is recommended to enable debug mode when updating a
    diagram and set it back to false afterwards.
*/
class Settings {
    width: number
    height: number
    canMove: boolean
    canResize: boolean
    logLevel
    debug

    /** 
      Creates a new Settings instance with each property
      having a default value or the value specified in 
      the jsonSettings argument.
      @param {json=} jsonSettings - The initial settings.
      @param {int} [jsonSettings.width=600] - The width of the diagram.
      @param {int} [jsonSettings.height=200] - The height of the diagram.
      @param {boolean} [jsonSettings.debug=false] - Debug mode.
    */
    constructor(jsonSettings) {
        this.width = 600
        this.height = 200
        this.canMove = false
        this.canResize = false
        this.logLevel = "none"
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
            if (jsonSettings.logLevel != null) {
                this.logLevel = jsonSettings.logLevel
            }
        }
    }

}

export { Settings }
