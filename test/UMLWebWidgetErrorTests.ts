/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let errorSequence = theTestHarness.appendTestSequence("UMLWebWidgetError tests")

    new tf.FunctionBasedTest("Creation test 1", UMLWebWidgetErrorCreationTest1, errorSequence)

    new tf.FunctionBasedTest("try/catch test 1", UMLWebWidgetErrorTryCatchTest1, errorSequence)
}

function UMLWebWidgetErrorCreationTest1(resolve) {
    let error = new UMLWebWidget.UMLWebWidgetError()
    if (error instanceof UMLWebWidget.UMLWebWidgetError) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function UMLWebWidgetErrorTryCatchTest1(resolve) {
    let result = tf.TestResultOutcome.eFailed
    try {
        throw new UMLWebWidget.UMLWebWidgetError()
    } catch(err) {
        if (err instanceof UMLWebWidget.UMLWebWidgetError) {
            result = tf.TestResultOutcome.ePassed
        }
    } finally {
        resolve(result)
    }
}
