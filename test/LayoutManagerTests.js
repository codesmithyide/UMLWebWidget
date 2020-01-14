'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let layoutManagerSequence = theTestHarness.appendTestSequence("LayoutManager tests")

    new tf.FunctionBasedTest("Creation test 1", LayoutManagerCreationTest1, layoutManagerSequence)
}

function LayoutManagerCreationTest1(resolve) {
    let layoutManager = new UMLWebWidget.LayoutManager()
    resolve(tf.TestResultOutcome.ePassed)
}
