/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.ts")

module.exports = function(theTestHarness) {
    let lifelineSequence = theTestHarness.appendTestSequence("Lifeline tests")

    TestUtils.createDirectory(__dirname + "/output/lifelinetests")

    new tf.FunctionBasedTest("Creation test 1", LifelineCreationTest1, lifelineSequence)

    new tf.FileComparisonTest("getLayers test 1", LifelineGetLayersTest1, lifelineSequence)
}

function LifelineCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let lifelineDescription = {
        "name": "MyClass"
    }
    let style = new UMLWebWidget.Style()
    let log = new UMLWebWidget.Log("none")
    let lifeline = new UMLWebWidget.Lifeline(svg, lifelineDescription.name, lifelineDescription, style, log)
    resolve(tf.TestResultOutcome.ePassed)
}

function LifelineGetLayersTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let lifelineDescription = {
        "name": "MyClass"
    }

    let style = new UMLWebWidget.Style()
    let log = new UMLWebWidget.Log("none")
    let lifeline = new UMLWebWidget.Lifeline(svg, lifelineDescription.name, lifelineDescription, style, log)

    let layers = lifeline.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/lifelinetests/LifelineGetLayersTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/lifelinetests/LifelineGetLayersTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/lifelinetests/LifelineGetLayersTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}
