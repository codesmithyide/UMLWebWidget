/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
import { TestUtils } from "./TestUtils"
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let svgLayerSequence = theTestHarness.appendTestSequence("SVGLayer tests")

    new tf.FunctionBasedTest("Creation test 1", SVGLayerCreationTest1, svgLayerSequence)

    new tf.FileComparisonTest("text test 1", SVGLayerTextTest1, svgLayerSequence)
    new tf.FileComparisonTest("text test 2", SVGLayerTextTest2, svgLayerSequence)
    new tf.FileComparisonTest("text test 3", SVGLayerTextTest3, svgLayerSequence)

    new tf.FileComparisonTest("merge test 1", SVGLayerMergeTest1, svgLayerSequence)

    new tf.FileComparisonTest("clear test 1", SVGLayerClearTest1, svgLayerSequence)
    new tf.FileComparisonTest("clear test 2", SVGLayerClearTest2, svgLayerSequence)
    new tf.FileComparisonTest("clear test 3", SVGLayerClearTest3, svgLayerSequence)

    new tf.FileComparisonTest("write test 1", SVGLayerWriteTest1, svgLayerSequence)
}

function SVGLayerCreationTest1(resolve) {
    let layer = new UMLWebWidget.SVGLayer()
    resolve(tf.TestResultOutcome.ePassed)
}

function SVGLayerTextTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layer = new UMLWebWidget.SVGLayer(svg)
    layer.write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/SVGLayerTextTest1.html")

    test.setOutputFilePath(__dirname + "/output/SVGLayerTextTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/SVGLayerTextTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function SVGLayerTextTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layer = new UMLWebWidget.SVGLayer(svg)
    layer.text("Hello World!").move(0, 0)
    layer.write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/SVGLayerTextTest2.html")

    test.setOutputFilePath(__dirname + "/output/SVGLayerTextTest2.html")
    test.setReferenceFilePath(__dirname + "/reference/SVGLayerTextTest2.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function SVGLayerTextTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layer = new UMLWebWidget.SVGLayer(svg)
    layer.text("Hello World!").move(0, 0)
    layer.text("How are you?").move(0, 20)
    layer.write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/SVGLayerTextTest3.html")
    
    test.setOutputFilePath(__dirname + "/output/SVGLayerTextTest3.html")
    test.setReferenceFilePath(__dirname + "/reference/SVGLayerTextTest3.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function SVGLayerMergeTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layer1 = new UMLWebWidget.SVGLayer(svg)
    layer1.text("Hello World!").move(0, 0)

    let layer2 = new UMLWebWidget.SVGLayer(svg)
    layer2.text("How are you?").move(0, 20)

    layer1.merge(layer2)

    layer1.write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/SVGLayerMergeTest1.html")
    
    test.setOutputFilePath(__dirname + "/output/SVGLayerMergeTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/SVGLayerMergeTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}

// Clear an already empty layer
function SVGLayerClearTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layer = new UMLWebWidget.SVGLayer(svg)
    layer.clear()

    layer.write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/SVGLayerClearTest1.html")
    
    test.setOutputFilePath(__dirname + "/output/SVGLayerClearTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/SVGLayerClearTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}

// Clear a layer that had a text element in it
function SVGLayerClearTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layer = new UMLWebWidget.SVGLayer(svg)
    layer.text("Hello World!").move(0, 0)
    layer.clear()

    layer.write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/SVGLayerClearTest2.html")
    
    test.setOutputFilePath(__dirname + "/output/SVGLayerClearTest2.html")
    test.setReferenceFilePath(__dirname + "/reference/SVGLayerClearTest2.html")

    resolve(tf.TestResultOutcome.ePassed)
}

// Clear a layer that had a text element in it and then re-add
// another element
function SVGLayerClearTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layer = new UMLWebWidget.SVGLayer(svg)
    layer.text("Hello World!").move(0, 0)
    layer.clear()
    layer.text("Hello World again!").move(0, 0)

    layer.write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/SVGLayerClearTest3.html")
    
    test.setOutputFilePath(__dirname + "/output/SVGLayerClearTest3.html")
    test.setReferenceFilePath(__dirname + "/reference/SVGLayerClearTest3.html")

    resolve(tf.TestResultOutcome.ePassed)
}

// Test writing to a group instead of the main document
function SVGLayerWriteTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layer = new UMLWebWidget.SVGLayer(svg)
    layer.text("Hello World!").move(0, 0)

    layer.write(svg.group())

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/SVGLayerWriteTest1.html")

    test.setOutputFilePath(__dirname + "/output/SVGLayerWriteTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/SVGLayerWriteTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}
