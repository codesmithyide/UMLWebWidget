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
    new tf.FileComparisonTest("createFromJSON test 3", UseCaseDiagramCreateFromJSONTest3, useCaseDiagramSequence)
}

function UseCaseDiagramCreateFromJSONTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, {
        "elements":
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
    let svg = SVG(window.document.createElement("div")).size(600, 300)

    let layout = {
        "elements": {
            "Customer": { "x": 10, "y": 1 },
            "Shopkeeper": { "x": 1, "y": 75 },
            "Till": { "x": 33, "y": 150 }
        }
    }

    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, {
        "elements":
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
    },
    layout)

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

function UseCaseDiagramCreateFromJSONTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(600, 300)

    let layout = {
        "elements": {
            "Customer": { "x": 10, "y": 1 },
            "Shopkeeper": { "x": 1, "y": 75 },
            "Till": { "x": 33, "y": 150 },
            "Pay for merchandise": { "x": 140, "y": 75 }
        }
    }

    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, {
        "elements":
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
              },
              {
                  "usecase":
                      {
                          "title": "Pay for merchandise"
                      }
              }
          ]
    },
    layout)

    let elementKeys = Object.keys(useCaseDiagram.diagramDescription)
    let actorsKeys = Object.keys(useCaseDiagram.actors)
    let usecasesKeys = Object.keys(useCaseDiagram.usecases)
    if ((elementKeys.length == 1) && (actorsKeys.length == 3) && (usecasesKeys.length == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest3.html", true)

        test.setOutputFilePath(__dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest3.html")
        test.setReferenceFilePath(__dirname + "/reference/usecasediagramtests/UseCaseDiagramCreateFromJSONTest3.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
