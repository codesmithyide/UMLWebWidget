'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let svgLayerSequence = theTestHarness.appendTestSequence("SVGLayer tests")

    new tf.FunctionBasedTest("Creation test 1", SVGLayerCreationTest1, svgLayerSequence)
}

function SVGLayerCreationTest1(resolve) {
    let layer = new UMLWebWidget.SVGLayer()
    resolve(tf.TestResultOutcome.ePassed)
}
