'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

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
    let lifeline = new UMLWebWidget.Lifeline(svg, lifelineDescription.name, lifelineDescription, style)
    resolve(tf.TestResultOutcome.ePassed)
}

function LifelineGetLayersTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let lifelineDescription = {
        "name": "MyClass"
    }

    let style = new UMLWebWidget.Style()
    let lifeline = new UMLWebWidget.Lifeline(svg, lifelineDescription.name, lifelineDescription, style)

    let layers = lifeline.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/lifelinetests/LifelineGetLayersTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/lifelinetests/LifelineGetLayersTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/lifelinetests/LifelineGetLayersTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}
