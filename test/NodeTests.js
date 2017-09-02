'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let nodeSequence = theTestHarness.appendTestSequence("Node tests")

    TestUtils.createDirectory(__dirname + "/output/nodetests")

    new tf.FunctionBasedTest("Creation test 1", NodeCreationTest1, nodeSequence)

    new tf.FileComparisonTest("getLayers test 1", NodeGetLayersTest1, nodeSequence)
}

function NodeCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let nodeDescription = {
        "name": "WebServer"
    }
    let style = new UMLWebWidget.Style()
    let node = new UMLWebWidget.Node(svg, nodeDescription.name, nodeDescription, style)
    resolve(tf.TestResultOutcome.ePassed)
}

function NodeGetLayersTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let nodeDescription = {
        "name": "WebServer"
    }
    let style = new UMLWebWidget.Style()
    let node = new UMLWebWidget.Node(svg, nodeDescription.name, nodeDescription, style)

    let layers = node.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/nodetests/NodeGetLayersTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/nodetests/NodeGetLayersTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/nodetests/NodeGetLayersTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}
