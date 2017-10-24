'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let classtemplateSequence = theTestHarness.appendTestSequence("ClassTemplate tests")

    TestUtils.createDirectory(__dirname + "/output/classtemplatetests")

    new tf.FunctionBasedTest("Creation test 1", ClassTemplateCreationTest1, classtemplateSequence)
}

function ClassTemplateCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let classTemplateDescription = {
        "name": "MyClassTemplate",
        "attributes":
            [
            ],
        "operations":
            [
            ]
    }
    let style = new UMLWebWidget.Style()
    let classtemplate = new UMLWebWidget.ClassTemplate(svg, classTemplateDescription.name, classTemplateDescription, false, style)
    resolve(tf.TestResultOutcome.ePassed)
}
