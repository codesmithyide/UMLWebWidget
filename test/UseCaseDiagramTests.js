'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let useCaseDiagramSequence = theTestHarness.appendTestSequence("Use case diagram tests")

    TestUtils.createDirectory(__dirname + "/output/usecasediagramtests")

    new tf.FileComparisonTest("createFromJSON test 1", UseCaseDiagramCreateFromJSONTest1, useCaseDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 2", UseCaseDiagramCreateFromJSONTest2, useCaseDiagramSequence)
}

function UseCaseDiagramCreateFromJSONTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, {
        "usecasediagram":
          [
              { 
                  "actor":
                      {
                          "name": "Customer"
                      }
              }
          ]
    })
    let elementKeys = Object.keys(useCaseDiagram.diagramDescription)
    let actorsKeys = Object.keys(useCaseDiagram.actors)
    let usecasesKeys = Object.keys(useCaseDiagram.usecases)
    if ((elementKeys.length == 1) && (actorsKeys.length == 1) && (usecasesKeys.length == 0)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest1.html", true)

        test.setOutputFilePath(__dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest1.html")
        test.setReferenceFilePath(__dirname + "/reference/usecasediagramtests/UseCaseDiagramCreateFromJSONTest1.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function UseCaseDiagramCreateFromJSONTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, {
        "usecasediagram":
          [
              { 
                  "actor":
                      {
                          "name": "Customer"
                      }
              },
              { 
                  "actor":
                      {
                          "name": "Shopkeeper"
                      }
              },
              { 
                  "actor":
                      {
                          "name": "Till"
                      }
              }
          ]
    })
    let elementKeys = Object.keys(useCaseDiagram.diagramDescription)
    let actorsKeys = Object.keys(useCaseDiagram.actors)
    let usecasesKeys = Object.keys(useCaseDiagram.usecases)
    if ((elementKeys.length == 1) && (actorsKeys.length == 3) && (usecasesKeys.length == 0)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest2.html", true)

        test.setOutputFilePath(__dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest2.html")
        test.setReferenceFilePath(__dirname + "/reference/usecasediagramtests/UseCaseDiagramCreateFromJSONTest2.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
