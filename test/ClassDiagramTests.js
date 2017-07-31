'use strict'

var fs = require('fs')
var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let classDiagramSequence = theTestHarness.appendTestSequence("Class diagram tests")

    new tf.FunctionBasedTest("Creation test 1", ClassDiagramCreationTest1, classDiagramSequence)

    new tf.FunctionBasedTest("createFromJSON test 1", ClassDiagramCreateFromJSONTest1, classDiagramSequence)
    new tf.FunctionBasedTest("createFromJSON test 2", ClassDiagramCreateFromJSONTest2, classDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 3", ClassDiagramCreateFromJSONTest3, classDiagramSequence)
}

function ClassDiagramCreationTest1(resolve) {
    let classDiagram = new UMLWebWidget.Diagram()
    resolve(tf.TestResultOutcome.ePassed)
}

function ClassDiagramCreateFromJSONTest1(resolve) {
    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON()
    let descriptionKeys = Object.keys(classDiagram.diagramDescription)
    let classboxesKeys = Object.keys(classDiagram.classboxes)
    if ((descriptionKeys.length == 0) && (classboxesKeys.length == 0)) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ClassDiagramCreateFromJSONTest2(resolve) {
    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(null, {
        "classdiagram":
          [
          ]
    })
    let descriptionKeys = Object.keys(classDiagram.diagramDescription)
    let classboxesKeys = Object.keys(classDiagram.classboxes)
    if ((descriptionKeys.length == 1) && (classboxesKeys.length == 0)) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ClassDiagramCreateFromJSONTest3(resolve, reject, test) {
    let svg = SVG(window.document.documentElement)
    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, {
        "classdiagram":
            [
                { 
                    "class":
                        {
                            "name": "MyClass",
                             "attributes":
                                 [
                                 ],
                             "operations":
                                 [
                                 ]
                        }
                }
            ]
    })
    let descriptionKeys = Object.keys(classDiagram.diagramDescription)
    let classboxesKeys = Object.keys(classDiagram.classboxes)
    if ((descriptionKeys.length == 1) && (classboxesKeys.length == 1)) {
        fs.writeFileSync(__dirname + "/output/ClassDiagramCreateFromJSONTest3.html", "<html><head><link rel='stylesheet' href='../../StyleSheets/CodeSmithyUMLWebWidget.css'></head><body><div class='CodeSmithyUMLWebWidget'>" + svg.svg() + "</div></body></html>")
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
