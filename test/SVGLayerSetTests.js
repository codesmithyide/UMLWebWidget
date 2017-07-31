'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let svgLayerSetSequence = theTestHarness.appendTestSequence("SVGLayerSet tests")

    new tf.FunctionBasedTest("Creation test 1", SVGLayerSetCreationTest1, svgLayerSetSequence)

    new tf.FunctionBasedTest("createLayer test 1", SVGLayerSetCreateLayerTest1, svgLayerSetSequence)

    new tf.FunctionBasedTest("merge test 1", SVGLayerSetMergeTest1, svgLayerSetSequence)
}

function SVGLayerSetCreationTest1(resolve) {
    let layerSet = new UMLWebWidget.SVGLayerSet()
    resolve(tf.TestResultOutcome.ePassed)
}

function SVGLayerSetCreateLayerTest1(resolve) {
    let layerSet = new UMLWebWidget.SVGLayerSet()
    let newLayer = layerSet.createLayer("layer1")
    if (layerSet.layers["layer1"] != null) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function SVGLayerSetMergeTest1(resolve) {
    resolve(tf.TestResultOutcome.eFailed)
}
