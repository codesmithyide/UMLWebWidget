/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

/**
 * The type of build.
 */
const enum BuildType {
    /**
     * In debug mode errors are reported via window.alert if supported and considered fatal.
     */
    DEBUG,
    /**
     * In release mode errors are reported to the console but are otherwise ignored unless they can't be recovered
     * from.
     */
    RELEASE
}

/**
 * Diagram settings.
 *
 * @property {int} width - The width of the diagram in pixels.
 * @property {height} height - The height of the diagram in pixels.
 * @property {boolean} debug - If debug is true then additional checks and logging will be performed. This is false by
 *     default so that diagrams are displayed as well as possible regardless of errors. It is recommended to enable
 *     debug mode when updating a diagram and set it back to false afterwards.
 */
class Settings {
    width: number
    height: number
    canMove: boolean
    canResize: boolean
    logLevel
    buildType: BuildType

    /** 
      Creates a new Settings instance with each property
      having a default value or the value specified in 
      the jsonSettings argument.
      @param {json=} jsonSettings - The initial settings.
      @param {int} [jsonSettings.width=600] - The width of the diagram.
      @param {int} [jsonSettings.height=200] - The height of the diagram.
      @param {boolean} [jsonSettings.debug=false] - Debug mode.
    */
    constructor(jsonSettings?) {
        this.width = 600
        this.height = 200
        this.canMove = false
        this.canResize = false
        this.logLevel = "none"
        this.buildType = BuildType.RELEASE

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

export { BuildType, Settings }
