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
    let sequenceDiagramSequence = theTestHarness.appendTestSequence("Sequence diagram tests")

    TestUtils.createDirectory(__dirname + "/output/sequencediagramtests")

    new tf.FileComparisonTest("createFromJSON test 1", SequenceDiagramCreateFromJSONTest1, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 2", SequenceDiagramCreateFromJSONTest2, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 3", SequenceDiagramCreateFromJSONTest3, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 4", SequenceDiagramCreateFromJSONTest4, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 5", SequenceDiagramCreateFromJSONTest5, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 6", SequenceDiagramCreateFromJSONTest6, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 7", SequenceDiagramCreateFromJSONTest7, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 8", SequenceDiagramCreateFromJSONTest8, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 9", SequenceDiagramCreateFromJSONTest9, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 10", SequenceDiagramCreateFromJSONTest10, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 11", SequenceDiagramCreateFromJSONTest11, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 12", SequenceDiagramCreateFromJSONTest12, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 13", SequenceDiagramCreateFromJSONTest13, sequenceDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 14", SequenceDiagramCreateFromJSONTest14, sequenceDiagramSequence)
}

function SequenceDiagramCreateFromJSONTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
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
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 1)) {
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
        "elements": {
            "Customer": { "position": { "x": 1, "y": 1 } },
            "Shopkeeper": { "position": { "x": 150, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
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
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 2)) {
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
        "elements": {
            "Customer": { "position": { "x": 1, "y": 1 } },
            "Shopkeeper": { "position": { "x": 150, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
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
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest3.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest3.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest3.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function SequenceDiagramCreateFromJSONTest4(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "Customer": { "position": { "x": 1, "y": 1 } },
            "Shopkeeper": { "position": { "x": 150, "y": 1 } },
            "Till": { "position": { "x": 320, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
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
                    "lifeline":
                        {
                            "name": "Till"
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
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "open",
                                        "caller": "Shopkeeper",
                                        "callee": "Till"
                                    }
                            }
                        ]
                }
            ]
    },
    layout)

    let elementKeys = Object.keys(sequenceDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 3)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest4.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest4.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest4.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function SequenceDiagramCreateFromJSONTest5(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(600, 300)

    let layout = {
        "elements": {
            "Customer": { "position": { "x": 1, "y": 1 } },
            "Shopkeeper": { "position": { "x": 150, "y": 1 } },
            "Till": { "position": { "x": 320, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
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
                    "lifeline":
                        {
                            "name": "Till"
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
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "open",
                                        "caller": "Shopkeeper",
                                        "callee": "Till"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
                                        "caller": "Shopkeeper",
                                        "callee": "Till"
                                    }
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "countMoney",
                                        "caller": "Shopkeeper",
                                        "callee": "Shopkeeper"
                                    }
                            },
                            {
                                "returnmessage":
                                {
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
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 3)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest5.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest5.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest5.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

// Test an object creation message
function SequenceDiagramCreateFromJSONTest6(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "Author": { "position": { "x": 1, "y": 1 } },
            "Book": { "position": { "x": 150, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
            [
                { 
                    "lifeline":
                        {
                            "name": "Author"
                        }
                },
                {
                    "lifeline":
                        {
                            "name": "Book"
                        }
                },
                {
                    "messages":
                        [
                            {
                                "creationmessage":
                                    {
                                        "caller": "Author",
                                        "callee": "Book"
                                    }
                            }
                        ]
                }
            ]
    },
    layout)

    let elementKeys = Object.keys(sequenceDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest6.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest6.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest6.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

// Test an object creation message
function SequenceDiagramCreateFromJSONTest7(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "Author": { "position": { "x": 1, "y": 1 } },
            "Book": { "position": { "x": 150, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
            [
                { 
                    "lifeline":
                        {
                            "name": "Author"
                        }
                },
                {
                    "lifeline":
                        {
                            "name": "Book"
                        }
                },
                {
                    "messages":
                        [
                            {
                                "creationmessage":
                                    {
                                        "caller": "Author",
                                        "callee": "Book"
                                    }
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "writeLine",
                                        "caller": "Author",
                                        "callee": "Book"
                                    }
                            }
                        ]
                }
            ]
    },
    layout)

    let elementKeys = Object.keys(sequenceDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest7.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest7.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest7.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function SequenceDiagramCreateFromJSONTest8(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
            [
                { 
                    "lifeline":
                        {
                            "name": "Book"
                        }
                },
                {
                    "messages":
                        [
                            {
                                "destructionmessage":
                                    {
                                        "callee": "Book"
                                    }
                            }
                        ]
                }
            ]
    })
    let elementKeys = Object.keys(sequenceDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest8.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest8.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest8.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function SequenceDiagramCreateFromJSONTest9(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(400, 300)

    let layout = {
        "elements": {
            "Author": { "position": { "x": 1, "y": 1 } },
            "Book": { "position": { "x": 150, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
            [
                { 
                    "lifeline":
                        {
                            "name": "Author"
                        }
                },
                { 
                    "lifeline":
                        {
                            "name": "Book"
                        }
                },
                {
                    "messages":
                        [
                            {
                                "creationmessage":
                                    {
                                        "caller": "Author",
                                        "callee": "Book"
                                    }
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "writeLine",
                                        "caller": "Author",
                                        "callee": "Book"
                                    }
                            },
                            {
                                "destructionmessage":
                                    {
                                        "callee": "Book"
                                    }
                            }
                        ]
                }
            ]
    },
    layout)
    let elementKeys = Object.keys(sequenceDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest9.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest9.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest9.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

// This is a diagram with messages from right to left, this is
// the same diagram as SequenceDiagramCreateFromJSONTest5 but
// with the lifelines in the opposite order
function SequenceDiagramCreateFromJSONTest10(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(600, 300)

    let layout = {
        "elements": {
            "Customer": { "position": { "x": 320, "y": 1 } },
            "Shopkeeper": { "position": { "x": 150, "y": 1 } },
            "Till": { "position": { "x": 1, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
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
                    "lifeline":
                        {
                            "name": "Till"
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
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "open",
                                        "caller": "Shopkeeper",
                                        "callee": "Till"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
                                        "caller": "Shopkeeper",
                                        "callee": "Till"
                                    }
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "countMoney",
                                        "caller": "Shopkeeper",
                                        "callee": "Shopkeeper"
                                    }
                            },
                            {
                                "returnmessage":
                                {
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
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 3)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest10.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest10.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest10.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

// Test with a callback and nested execution specifications
function SequenceDiagramCreateFromJSONTest11(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(400, 300)

    let layout = {
        "elements": {
            "Customer": { "position": { "x": 1, "y": 1 } },
            "Shopkeeper": { "position": { "x": 150, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
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
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "give change",
                                        "caller": "Shopkeeper",
                                        "callee": "Customer"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
                                        "caller": "Shopkeeper",
                                        "callee": "Customer"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
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
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest11.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest11.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest11.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

// Test with a callback and nested execution specifications similar to
// SequenceDiagramCreateFromJSONTest11 but with more calls before the call
// with the callback is made and 2 separate consecutive execution
// specifications on a lifeline
function SequenceDiagramCreateFromJSONTest12(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(400, 300)

    let layout = {
        "elements": {
            "Customer": { "position": { "x": 1, "y": 1 } },
            "Shopkeeper": { "position": { "x": 150, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
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
                                        "name": "confirmprice",
                                        "caller": "Customer",
                                        "callee": "Shopkeeper"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
                                        "caller": "Customer",
                                        "callee": "Shopkeeper"
                                    }
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "pay",
                                        "caller": "Customer",
                                        "callee": "Shopkeeper"
                                    }
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "give change",
                                        "caller": "Shopkeeper",
                                        "callee": "Customer"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
                                        "caller": "Shopkeeper",
                                        "callee": "Customer"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
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
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest12.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest12.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest12.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

// Same as SequenceDiagramCreateFromJSONTest12 but with more calls
// after the call with the callback
function SequenceDiagramCreateFromJSONTest13(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(400, 300)

    let layout = {
        "elements": {
            "Customer": { "position": { "x": 1, "y": 1 } },
            "Shopkeeper": { "position": { "x": 150, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
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
                                        "name": "confirmprice",
                                        "caller": "Customer",
                                        "callee": "Shopkeeper"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
                                        "caller": "Customer",
                                        "callee": "Shopkeeper"
                                    }
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "pay",
                                        "caller": "Customer",
                                        "callee": "Shopkeeper"
                                    }
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "give change",
                                        "caller": "Shopkeeper",
                                        "callee": "Customer"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
                                        "caller": "Shopkeeper",
                                        "callee": "Customer"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
                                        "caller": "Customer",
                                        "callee": "Shopkeeper"
                                    }
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "give tip",
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
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest13.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest13.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest13.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function SequenceDiagramCreateFromJSONTest14(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "Mail Server": { "position": { "x": 1, "y": 1 } },
            "DNS": { "position": { "x": 200, "y": 1 } }
        }
    }

    let sequenceDiagram = new UMLWebWidget.Diagram()
    sequenceDiagram.createFromJSON(svg, {
        "elements":
            [
                { 
                    "lifeline":
                        {
                            "name": "Mail Server"
                        }
                },
                {
                    "lifeline":
                        {
                            "name": "DNS"
                        }
                },
                {
                    "messages":
                        [
                            {
                                "synchronousmessage":
                                    {
                                        "name": "getremoteIP",
                                        "caller": "Mail Server",
                                        "callee": "Mail Server"
                                    }
                            },
                            {
                                "returnmessage":
                                    {
                                        "caller": "Mail Server",
                                        "callee": "Mail Server"
                                    }
                            },
                            {
                                "synchronousmessage":
                                    {
                                        "name": "getMXServers",
                                        "caller": "Mail Server",
                                        "callee": "DNS"
                                    }
                            }
                        ]
                }
            ]
    },
    layout)

    let elementKeys = Object.keys(sequenceDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (sequenceDiagram.lifelines.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest14.html", true)

        test.setOutputFilePath(__dirname + "/output/sequencediagramtests/SequenceDiagramCreateFromJSONTest14.html")
        test.setReferenceFilePath(__dirname + "/reference/sequencediagramtests/SequenceDiagramCreateFromJSONTest14.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
