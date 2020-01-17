'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let styleSequence = theTestHarness.appendTestSequence("Style tests")

    new tf.FunctionBasedTest("Creation test 1", StyleCreationTest1, styleSequence)
}

function StyleCreationTest1(resolve) {
    let style = new UMLWebWidget.Style()
    resolve(tf.TestResultOutcome.ePassed)
}
