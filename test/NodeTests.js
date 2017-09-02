'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let nodeSequence = theTestHarness.appendTestSequence("Node tests")

    new tf.FunctionBasedTest("Creation test 1", NodeCreationTest1, nodeSequence)
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
