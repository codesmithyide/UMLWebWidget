'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let svgLayerSetSequence = theTestHarness.appendTestSequence("SVGLayerSet tests")

    new tf.FunctionBasedTest("Creation test 1", SVGLayerSetCreationTest1, svgLayerSetSequence)
}

function SVGLayerSetCreationTest1(resolve) {
    let layerSet = new UMLWebWidget.SVGLayerSet()
    resolve(tf.TestResultOutcome.ePassed)
}
