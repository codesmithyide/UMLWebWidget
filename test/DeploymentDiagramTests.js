'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let deploymentDiagramSequence = theTestHarness.appendTestSequence("Deployment diagram tests")

    TestUtils.createDirectory(__dirname + "/output/deploymentdiagramtests")

    new tf.FileComparisonTest("createFromJSON test 1", DeploymentDiagramCreateFromJSONTest1, deploymentDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 2", DeploymentDiagramCreateFromJSONTest2, deploymentDiagramSequence)
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
            WebServer: { x: 1, y: 1 },
            DatabaseServer: { x:150, y: 1 }
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
