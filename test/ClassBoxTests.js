'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let classboxSequence = theTestHarness.appendTestSequence("ClassBox tests")

    new tf.FunctionBasedTest("Creation test 1", ClassBoxCreationTest1, classboxSequence)
}

function ClassBoxCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let classDescription = {
        "name": "MyClass",
        "attributes":
            [
            ],
        "operations":
            [
            ]
    }
    let style = new UMLWebWidget.Style()
    let classbox = new UMLWebWidget.ClassBox(svg, classDescription, false, style)
    resolve(tf.TestResultOutcome.ePassed)
}
