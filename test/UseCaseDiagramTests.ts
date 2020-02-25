/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
import { TestUtils } from "./TestUtils"
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let useCaseDiagramSequence = theTestHarness.appendTestSequence("Use case diagram tests")

    TestUtils.createDirectory(__dirname + "/output/usecasediagramtests")

    new tf.FileComparisonTest("createFromJSON test 1", UseCaseDiagramCreateFromJSONTest1, useCaseDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 2", UseCaseDiagramCreateFromJSONTest2, useCaseDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 3", UseCaseDiagramCreateFromJSONTest3, useCaseDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 4", UseCaseDiagramCreateFromJSONTest4, useCaseDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 5", UseCaseDiagramCreateFromJSONTest5, useCaseDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 6", UseCaseDiagramCreateFromJSONTest6, useCaseDiagramSequence)
}

function UseCaseDiagramCreateFromJSONTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, "UseCaseDiagramCreateFromJSONTest1", {
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
    if ((elementKeys.length == 1) && (useCaseDiagram.actors.size == 1) && (useCaseDiagram.usecases.size == 0)) {
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
            "Customer": { "position": { "x": 10, "y": 1 } },
            "Shopkeeper": { "position": { "x": 1, "y": 75 } },
            "Till": { "position": { "x": 33, "y": 150 } }
        }
    }

    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, "UseCaseDiagramCreateFromJSONTest2", {
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
    if ((elementKeys.length == 1) && (useCaseDiagram.actors.size == 3) && (useCaseDiagram.usecases.size == 0)) {
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
            "Customer": { "position": { "x": 10, "y": 1 } },
            "Shopkeeper": { "position": { "x": 1, "y": 75 } },
            "Till": { "position": { "x": 33, "y": 150 } },
            "Pay for merchandise": { "position": { "x": 140, "y": 75 } }
        }
    }

    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, "UseCaseDiagramCreateFromJSONTest3", {
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
    if ((elementKeys.length == 1) && (useCaseDiagram.actors.size == 3) && (useCaseDiagram.usecases.size == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest3.html", true)

        test.setOutputFilePath(__dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest3.html")
        test.setReferenceFilePath(__dirname + "/reference/usecasediagramtests/UseCaseDiagramCreateFromJSONTest3.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function UseCaseDiagramCreateFromJSONTest4(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(600, 300)

    let layout = {
        "elements": {
            "Customer": { "position": { "x": 10, "y": 1 } },
            "Shopkeeper": { "position": { "x": 1, "y": 75 } },
            "Till": { "position": { "x": 33, "y": 150 } },
            "Pay for merchandise": { "position": { "x": 140, "y": 75 } }
        }
    }

    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, "UseCaseDiagramCreateFromJSONTest4", {
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
              },
              {
                  "association":
                      {
                          "actor": "Customer",
                          "usecase": "Pay for merchandise"
                      }
              }
          ]
    },
    layout)

    let elementKeys = Object.keys(useCaseDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (useCaseDiagram.actors.size == 3) && (useCaseDiagram.usecases.size == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest4.html", true)

        test.setOutputFilePath(__dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest4.html")
        test.setReferenceFilePath(__dirname + "/reference/usecasediagramtests/UseCaseDiagramCreateFromJSONTest4.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function UseCaseDiagramCreateFromJSONTest5(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(600, 300)

    let layout = {
        "elements": {
            "Customer": { "position": { "x": 10, "y": 1 } },
            "Shopkeeper": { "position": { "x": 1, "y": 75 } },
            "Till": { "position": { "x": 33, "y": 150 } },
            "Pay for merchandise": { "position": { "x": 140, "y": 75 } }
        }
    }

    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, "UseCaseDiagramCreateFromJSONTest5", {
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
              },
              {
                  "association":
                      {
                          "actor": "Customer",
                          "usecase": "Pay for merchandise"
                      }
              },
              {
                  "association":
                      {
                          "actor": "Shopkeeper",
                          "usecase": "Pay for merchandise"
                      }
              },
              {
                  "association":
                      {
                          "actor": "Till",
                          "usecase": "Pay for merchandise"
                      }
              }
          ]
    },
    layout)

    let elementKeys = Object.keys(useCaseDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (useCaseDiagram.actors.size == 3) && (useCaseDiagram.usecases.size == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest5.html", true)

        test.setOutputFilePath(__dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest5.html")
        test.setReferenceFilePath(__dirname + "/reference/usecasediagramtests/UseCaseDiagramCreateFromJSONTest5.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function UseCaseDiagramCreateFromJSONTest6(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(600, 300)

    let layout = {
        "elements": {
            "Customer": { "position": { "x": 160, "y": 1 } },
            "Shopkeeper": { "position": { "x": 1, "y": 95 } },
            "Till": { "position": { "x": 400, "y": 95 } },
            "Credit Card": { "position": { "x": 160, "y": 230 } },
            "Pay for merchandise": { "position": { "x": 140, "y": 95 } }
        }
    }

    let useCaseDiagram = new UMLWebWidget.Diagram()
    useCaseDiagram.createFromJSON(svg, "UseCaseDiagramCreateFromJSONTest6", {
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
                  "actor":
                      {
                          "name": "Credit Card"
                      }
              },
              {
                  "usecase":
                      {
                          "title": "Pay for merchandise"
                      }
              },
              {
                  "association":
                      {
                          "actor": "Customer",
                          "usecase": "Pay for merchandise"
                      }
              },
              {
                  "association":
                      {
                          "actor": "Shopkeeper",
                          "usecase": "Pay for merchandise"
                      }
              },
              {
                  "association":
                      {
                          "actor": "Till",
                          "usecase": "Pay for merchandise"
                      }
              },
              {
                  "association":
                      {
                          "actor": "Credit Card",
                          "usecase": "Pay for merchandise"
                      }
              }
          ]
    },
    layout)

    let elementKeys = Object.keys(useCaseDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (useCaseDiagram.actors.size == 4) && (useCaseDiagram.usecases.size == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest6.html", true)

        test.setOutputFilePath(__dirname + "/output/usecasediagramtests/UseCaseDiagramCreateFromJSONTest6.html")
        test.setReferenceFilePath(__dirname + "/reference/usecasediagramtests/UseCaseDiagramCreateFromJSONTest6.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
