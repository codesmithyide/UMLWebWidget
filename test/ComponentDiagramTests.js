'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let componentDiagramSequence = theTestHarness.appendTestSequence("Component diagram tests")

    TestUtils.createDirectory(__dirname + "/output/componentdiagramtests")

    new tf.FileComparisonTest("createFromJSON test 1", ComponentDiagramCreateFromJSONTest1, componentDiagramSequence)
}

function ComponentDiagramCreateFromJSONTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let componentDiagram = new UMLWebWidget.Diagram()
    componentDiagram.createFromJSON(svg, {
        "componentdiagram":
          [
              { 
                  "component":
                      {
                          "name": "ControlPanel"
                      }
              }
          ]
    })
    let elementKeys = Object.keys(componentDiagram.diagramDescription)
    let componentsKeys = Object.keys(componentDiagram.components)
    if ((elementKeys.length == 1) && (componentsKeys.length == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest1.html", true)

        test.setOutputFilePath(__dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest1.html")
        test.setReferenceFilePath(__dirname + "/reference/componentdiagramtests/ComponentDiagramCreateFromJSONTest1.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
