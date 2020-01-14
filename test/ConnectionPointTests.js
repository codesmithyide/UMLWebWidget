'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let connectionPointSequence = theTestHarness.appendTestSequence("ConnectionPoint tests")

    new tf.FunctionBasedTest("Creation test 1", ConnectionPointCreationTest1, connectionPointSequence)
}

function ConnectionPointCreationTest1(resolve) {
    let point = new UMLWebWidget.ConnectionPoint()
    resolve(tf.TestResultOutcome.ePassed)
}
