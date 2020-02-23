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
    let deploymentDiagramSequence = theTestHarness.appendTestSequence("Deployment diagram tests")

    TestUtils.createDirectory(__dirname + "/output/deploymentdiagramtests")

    new tf.FileComparisonTest("createFromJSON test 1", DeploymentDiagramCreateFromJSONTest1, deploymentDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 2", DeploymentDiagramCreateFromJSONTest2, deploymentDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 3", DeploymentDiagramCreateFromJSONTest3, deploymentDiagramSequence)
}

function DeploymentDiagramCreateFromJSONTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let deploymentDiagram = new UMLWebWidget.Diagram()
    deploymentDiagram.createFromJSON(svg, { 
        "elements":
            [
                {
                    "node":
                        {
                            "name": "WebServer"
                        }
                }
            ]
    })
    let elementKeys = Object.keys(deploymentDiagram.diagramDescription)
    if (elementKeys.length == 1) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/deploymentdiagramtests/DeploymentDiagramCreateFromJSONTest1.html", true)

        test.setOutputFilePath(__dirname + "/output/deploymentdiagramtests/DeploymentDiagramCreateFromJSONTest1.html")
        test.setReferenceFilePath(__dirname + "/reference/deploymentdiagramtests/DeploymentDiagramCreateFromJSONTest1.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function DeploymentDiagramCreateFromJSONTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        elements: {
            WebServer: { "position": { x: 1, y: 1 } },
            DatabaseServer: { "position": { x:150, y: 1 } }
        }
    }

    let deploymentDiagram = new UMLWebWidget.Diagram()
    deploymentDiagram.createFromJSON(svg, { 
        "elements":
            [
                {
                    "node":
                        {
                            "name": "WebServer"
                        }
                },
                {
                    "node":
                        {
                            "name": "DatabaseServer"
                        }
                }
            ]
    },
    layout)
    let elementKeys = Object.keys(deploymentDiagram.diagramDescription)
    if (elementKeys.length == 1) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/deploymentdiagramtests/DeploymentDiagramCreateFromJSONTest2.html", true)

        test.setOutputFilePath(__dirname + "/output/deploymentdiagramtests/DeploymentDiagramCreateFromJSONTest2.html")
        test.setReferenceFilePath(__dirname + "/reference/deploymentdiagramtests/DeploymentDiagramCreateFromJSONTest2.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function DeploymentDiagramCreateFromJSONTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        elements: {
            WebServer: { "position": { x: 1, y: 1 } },
            DatabaseServer: { "position": { x: 150, y: 1 } }
        }
    }

    let deploymentDiagram = new UMLWebWidget.Diagram()
    deploymentDiagram.createFromJSON(svg, {
        "elements":
            [
                {
                    "node":
                        {
                            "name": "WebServer"
                        }
                },
                {
                    "node":
                        {
                            "name": "DatabaseServer"
                        }
                },
                {
                    "communicationpath":
                    {
                        "firstnode": "WebServer",
                        "secondnode": "DatabaseServer"
                    }
                }
            ]
    },
    layout)
    let elementKeys = Object.keys(deploymentDiagram.diagramDescription)
    if (elementKeys.length == 1) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/deploymentdiagramtests/DeploymentDiagramCreateFromJSONTest3.html", true)

        test.setOutputFilePath(__dirname + "/output/deploymentdiagramtests/DeploymentDiagramCreateFromJSONTest3.html")
        test.setReferenceFilePath(__dirname + "/reference/deploymentdiagramtests/DeploymentDiagramCreateFromJSONTest3.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
