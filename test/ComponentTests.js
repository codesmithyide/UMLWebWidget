'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let componentSequence = theTestHarness.appendTestSequence("Component tests")

    TestUtils.createDirectory(__dirname + "/output/componenttests")

    new tf.FunctionBasedTest("Creation test 1", ComponentCreationTest1, componentSequence)

    new tf.FileComparisonTest("getLayers test 1", ComponentGetLayersTest1, componentSequence)
}

function ComponentCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let componentDescription = {
        "name": "ControlPanel"
    }
    let style = new UMLWebWidget.Style()
    let component = new UMLWebWidget.Component(svg, componentDescription, style)
    resolve(tf.TestResultOutcome.ePassed)
}

function ComponentGetLayersTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let componentDescription = {
        "name": "ControlPanel"
    }

    let style = new UMLWebWidget.Style()
    let component = new UMLWebWidget.Component(svg, componentDescription, style)

    let layers = component.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/componenttests/ComponentGetLayersTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/componenttests/ComponentGetLayersTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/componenttests/ComponentGetLayersTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}
