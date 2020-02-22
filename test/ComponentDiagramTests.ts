/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.ts")

module.exports = function(theTestHarness) {
    let componentDiagramSequence = theTestHarness.appendTestSequence("Component diagram tests")

    TestUtils.createDirectory(__dirname + "/output/componentdiagramtests")

    new tf.FileComparisonTest("createFromJSON test 1", ComponentDiagramCreateFromJSONTest1, componentDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 2", ComponentDiagramCreateFromJSONTest2, componentDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 3", ComponentDiagramCreateFromJSONTest3, componentDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 4", ComponentDiagramCreateFromJSONTest4, componentDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 5", ComponentDiagramCreateFromJSONTest5, componentDiagramSequence)
}

function ComponentDiagramCreateFromJSONTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let componentDiagram = new UMLWebWidget.Diagram()
    componentDiagram.createFromJSON(svg, {
        "elements":
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
    if ((elementKeys.length == 1) && (componentDiagram.components.size == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest1.html", true)

        test.setOutputFilePath(__dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest1.html")
        test.setReferenceFilePath(__dirname + "/reference/componentdiagramtests/ComponentDiagramCreateFromJSONTest1.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ComponentDiagramCreateFromJSONTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "ControlPanel": { "position": { "x": 10, "y": 1 } },
            "WebServer": { "position": { "x": 200, "y": 1 } }
        }
    }

    let componentDiagram = new UMLWebWidget.Diagram()
    componentDiagram.createFromJSON(svg, {
        "elements":
          [
              { 
                  "component":
                      {
                          "name": "ControlPanel"
                      }
              },
              {
                  "component":
                      {
                          "name": "WebServer"
                      }
              }
          ]
    },
    layout)

    let elementKeys = Object.keys(componentDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (componentDiagram.components.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest2.html", true)

        test.setOutputFilePath(__dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest2.html")
        test.setReferenceFilePath(__dirname + "/reference/componentdiagramtests/ComponentDiagramCreateFromJSONTest2.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ComponentDiagramCreateFromJSONTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "ControlPanel": { "position": { "x": 10, "y": 1 } },
            "WebServer": { "position": { "x": 200, "y": 1 } }
        }
    }

    let componentDiagram = new UMLWebWidget.Diagram()
    componentDiagram.createFromJSON(svg, {
        "elements":
          [
              { 
                  "component":
                      {
                          "name": "ControlPanel",
                          "dependencies":
                              [
                                  { "name": "IControl" }
                              ]
                      }
              },
              {
                  "component":
                      {
                          "name": "WebServer",
                          "dependencies":
                              [
                                  { "name": "INetwork" }
                              ],
                          "interfaces":
                              [
                                  { "name": "IControl" }
                              ]
                      }
              }
          ]
    },
    layout)

    let elementKeys = Object.keys(componentDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (componentDiagram.components.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest3.html", true)

        test.setOutputFilePath(__dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest3.html")
        test.setReferenceFilePath(__dirname + "/reference/componentdiagramtests/ComponentDiagramCreateFromJSONTest3.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ComponentDiagramCreateFromJSONTest4(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "ControlPanel": { "position": { "x": 10, "y": 1 } },
            "WebServer": { "position": { "x": 200, "y": 1 } }
        }
    }

    let componentDiagram = new UMLWebWidget.Diagram()
    componentDiagram.createFromJSON(svg, {
        "elements":
          [
              { 
                  "component":
                      {
                          "name": "ControlPanel",
                          "dependencies":
                              [
                                  { "name": "IControl" }
                              ]
                      }
              },
              {
                  "component":
                      {
                          "name": "WebServer",
                          "dependencies":
                              [
                                  { "name": "INetwork" }
                              ],
                          "interfaces":
                              [
                                  { "name": "IControl" }
                              ]
                      }
              },
              {
                  "assemblyconnector":
                      {
                          "interface": "IControl",
                          "consumer": "ControlPanel",
                          "provider": "WebServer"
                      }
              }
          ]
    },
    layout)

    let elementKeys = Object.keys(componentDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (componentDiagram.components.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest4.html", true)

        test.setOutputFilePath(__dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest4.html")
        test.setReferenceFilePath(__dirname + "/reference/componentdiagramtests/ComponentDiagramCreateFromJSONTest4.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ComponentDiagramCreateFromJSONTest5(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(300, 200)

    let layout = {
        "elements": {
            "ControlPanel": { "position": { "x": 75, "y": 1 } },
            "WebServer": { "position": { "x": 20, "y": 100 } }
        }
    }

    let componentDiagram = new UMLWebWidget.Diagram()
    componentDiagram.createFromJSON(svg, {
        "elements":
          [
              {
                  "component":
                      {
                          "name": "ControlPanel",
                          "dependencies":
                              [
                                  { "name": "IControl" }
                              ]
                      }
              },
              {
                  "component":
                      {
                          "name": "WebServer",
                          "dependencies":
                              [
                                  { "name": "INetwork" }
                              ],
                          "interfaces":
                              [
                                  { "name": "IControl" }
                              ]
                      }
              },
              {
                  "assemblyconnector":
                      {
                          "interface": "IControl",
                          "consumer": "ControlPanel",
                          "provider": "WebServer"
                      }
              }
          ]
    },
    layout)

    let elementKeys = Object.keys(componentDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (componentDiagram.components.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest5.html", true)

        test.setOutputFilePath(__dirname + "/output/componentdiagramtests/ComponentDiagramCreateFromJSONTest5.html")
        test.setReferenceFilePath(__dirname + "/reference/componentdiagramtests/ComponentDiagramCreateFromJSONTest5.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
