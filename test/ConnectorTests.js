'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let connectorSequence = theTestHarness.appendTestSequence("Connector tests")

    new tf.FunctionBasedTest("Creation test 1", ConnectorCreationTest1, connectorSequence)

    new tf.FileComparisonTest("getLayers test 1", ConnectorGetLayersTest1, connectorSequence)
}

function ConnectorCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let connector = new UMLWebWidget.Connector(svg)
    resolve(tf.TestResultOutcome.ePassed)
}

function ConnectorGetLayersTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let connector = new UMLWebWidget.Connector(svg)

    let layers = connector.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/ConnectorGetLayersTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/ConnectorGetLayersTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/ConnectorGetLayersTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}
