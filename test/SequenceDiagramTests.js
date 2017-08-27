'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let sequenceDiagramSequence = theTestHarness.appendTestSequence("Sequence diagram tests")

    TestUtils.createDirectory(__dirname + "/output/sequencediagramtests")

    new tf.FileComparisonTest("createFromJSON test 1", SequenceDiagramCreateFromJSONTest1, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 2", SequenceDiagramCreateFromJSONTest2, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 3", SequenceDiagramCreateFromJSONTest3, sequenceDiagramSequence)
}

function SequenceDiagramCreateFromJSONTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "sequencediagram":
          [
              { 
                  "lifeline":
                      {
                          "name": "Customer"
                      }
              }
          ]
    })
    let elementKeys = Object.keys(sequenceDiagram.diagramDescription)
    let lifelinesKeys = Object.keys(sequenceDiagram.lifelines)
    if ((elementKeys.length == 1) && (lifelinesKeys.length == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest1.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest1.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest1.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function SequenceDiagramCreateFromJSONTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "lifelinepositions": {
            "Customer": { "x": 1, "y": 1 },
            "Shopkeeper": { "x": 150, "y": 1 }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "sequencediagram":
          [
              { 
                  "lifeline":
                      {
                          "name": "Customer"
                      }
              },
              {
                  "lifeline":
                      {
                          "name": "Shopkeeper"
                      }
              }
          ]
    },
    layout)

    let elementKeys = Object.keys(sequenceDiagram.diagramDescription)
    let lifelinesKeys = Object.keys(sequenceDiagram.lifelines)
    if ((elementKeys.length == 1) && (lifelinesKeys.length == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest2.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest2.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest2.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function SequenceDiagramCreateFromJSONTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "lifelinepositions": {
            "Customer": { "x": 1, "y": 1 },
            "Shopkeeper": { "x": 150, "y": 1 }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "sequencediagram":
            [
                { 
                    "lifeline":
                        {
                            "name": "Customer"
                        }
                },
                {
                    "lifeline":
                        {
                            "name": "Shopkeeper"
                        }
                },
                {
                    "messages":
                        [
                            {
                                "synchronousmessage":
                                    {
                                        "name": "pay",
                                        "caller": "Customer",
                                        "callee": "Shopkeeper"
                                    }
                            }
                        ]
                }
            ]
    },
    layout)

    let elementKeys = Object.keys(sequenceDiagram.diagramDescription)
    let lifelinesKeys = Object.keys(sequenceDiagram.lifelines)
    if ((elementKeys.length == 1) && (lifelinesKeys.length == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest3.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest3.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest3.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
