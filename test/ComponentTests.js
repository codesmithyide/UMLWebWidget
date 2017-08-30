'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let componentSequence = theTestHarness.appendTestSequence("Component tests")

    new tf.FunctionBasedTest("Creation test 1", ComponentCreationTest1, componentSequence)
}

function ComponentCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let componentDescription = {
        "name": "ControlPanel",
         "dependencies": [ ]
    }
    let style = new UMLWebWidget.Style()
    let component = new UMLWebWidget.Component(svg, componentDescription, style)
    resolve(tf.TestResultOutcome.ePassed)
}
