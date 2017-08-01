'use strict'

var fs = require('fs')
var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let svgLayerSequence = theTestHarness.appendTestSequence("SVGLayer tests")

    new tf.FunctionBasedTest("Creation test 1", SVGLayerCreationTest1, svgLayerSequence)

    new tf.FileComparisonTest("text test 1", SVGLayerTextTest1, svgLayerSequence)
    new tf.FileComparisonTest("text test 2", SVGLayerTextTest2, svgLayerSequence)

    new tf.FileComparisonTest("merge test 1", SVGLayerMergeTest1, svgLayerSequence)
}

function SVGLayerCreationTest1(resolve) {
    let layer = new UMLWebWidget.SVGLayer()
    resolve(tf.TestResultOutcome.ePassed)
}

function SVGLayerTextTest1(resolve) {
    let svg = SVG(window.document.documentElement)

    let layer = new UMLWebWidget.SVGLayer(svg)
    layer.text("Hello World!")
    layer.write()

    fs.writeFileSync(__dirname + "/output/SVGLayerTextTest1.html", "<html><body><div>" + svg.svg() + "</div></body></html>")
    resolve(tf.TestResultOutcome.eFailed)
}

function SVGLayerTextTest2(resolve) {
    let svg = SVG(window.document.documentElement)

    let layer = new UMLWebWidget.SVGLayer(svg)
    layer.text("Hello World!")
    layer.text("How are you?").dy(20)
    layer.write()

    fs.writeFileSync(__dirname + "/output/SVGLayerTextTest2.html", "<html><body><div>" + svg.svg() + "</div></body></html>")
    resolve(tf.TestResultOutcome.eFailed)
}

function SVGLayerMergeTest1(resolve) {
    let svg = SVG(window.document.documentElement)

    let layer1 = new UMLWebWidget.SVGLayer(svg)
    layer1.text("Hello World!")

    let layer2 = new UMLWebWidget.SVGLayer(svg)
    layer2.text("How are you?").dy(20)

    layer1.merge(layer2)

    layer1.write()

    fs.writeFileSync(__dirname + "/output/SVGLayerMergeTest1.html", "<html><body><div>" + svg.svg() + "</div></body></html>")
    resolve(tf.TestResultOutcome.eFailed)
}
