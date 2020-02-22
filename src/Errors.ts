/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import { BuildType } from "./Settings"

/**
 * Class that provides methods to handle errors.
 */
class Errors {
    buildType: BuildType

    constructor(buildType: BuildType) {
        this.buildType = buildType
    }

    assertAlways(condition: boolean) {
        if (!condition) {
            console.error("Assertion failed")
            window.alert("Assertion failed")
            throw new Error()
        }
    }

    assertDebug(condition: boolean) {
        if (this.buildType == BuildType.DEBUG) {
            this.assertAlways(condition)
        }
    }
}

/**
 * Errors related to diagram operations are communicated via this class.
 *
 * Note that by default errors are only shown if debug mode is enabled in the {@link Settings}.
 */
class UMLWebWidgetError extends Error {    
}

export { Errors, UMLWebWidgetError }
