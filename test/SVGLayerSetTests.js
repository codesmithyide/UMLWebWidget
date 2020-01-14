'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let svgLayerSetSequence = theTestHarness.appendTestSequence("SVGLayerSet tests")

    new tf.FunctionBasedTest("Creation test 1", SVGLayerSetCreationTest1, svgLayerSetSequence)

    new tf.FunctionBasedTest("createLayer test 1", SVGLayerSetCreateLayerTest1, svgLayerSetSequence)

    new tf.FileComparisonTest("merge test 1", SVGLayerSetMergeTest1, svgLayerSetSequence)
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

function SVGLayerSetMergeTest1(resolve, reject, test) {
    let result = tf.TestResultOutcome.eFailed

    let svg = SVG(window.document.createElement("div"))

    let layerSet1 = new UMLWebWidget.SVGLayerSet(svg)
    let layer1 = layerSet1.createLayer("text")
    layer1.text("Hello World!").move(0, 0)

    let layerSet2 = new UMLWebWidget.SVGLayerSet(svg)
    let layer2 = layerSet2.createLayer("text")
    layer2.text("How are you?").move(0, 20)

    layerSet1.merge(layerSet2)

    if (layerSet1.layers.text.defs.length == 2) {
        layerSet1.layers.text.write()

        TestUtils.exportSVGToHTML(svg, __dirname + "/output/SVGLayerSetMergeTest1.html")

        test.setOutputFilePath(__dirname + "/output/SVGLayerSetMergeTest1.html")
        test.setReferenceFilePath(__dirname + "/reference/SVGLayerSetMergeTest1.html")
        result = tf.TestResultOutcome.ePassed
    }

    resolve(result)
}
