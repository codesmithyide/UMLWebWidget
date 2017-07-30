'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let errorSequence = theTestHarness.appendTestSequence("UMLWebWidgetError tests")

    new tf.FunctionBasedTest("Creation test 1", UMLWebWidgetErrorCreationTest1, errorSequence)
}

function UMLWebWidgetErrorCreationTest1(resolve) {
    let error = new UMLWebWidget.UMLWebWidgetError()
    resolve(tf.TestResultOutcome.ePassed)
}
