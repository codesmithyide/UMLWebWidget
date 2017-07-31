'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let classboxSequence = theTestHarness.appendTestSequence("ClassBox tests")

    new tf.FunctionBasedTest("Creation test 1", ClassBoxCreationTest1, classboxSequence)
}

function ClassBoxCreationTest1(resolve) {
    let classbox = new UMLWebWidget.ClassBox()
    resolve(tf.TestResultOutcome.ePassed)
}
