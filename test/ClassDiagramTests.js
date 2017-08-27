'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let classDiagramSequence = theTestHarness.appendTestSequence("Class diagram tests")

    TestUtils.createDirectory(__dirname + "/output/classdiagramtests")

    new tf.FunctionBasedTest("Creation test 1", ClassDiagramCreationTest1, classDiagramSequence)

    new tf.FunctionBasedTest("createFromJSON test 1", ClassDiagramCreateFromJSONTest1, classDiagramSequence)
    new tf.FunctionBasedTest("createFromJSON test 2", ClassDiagramCreateFromJSONTest2, classDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 3", ClassDiagramCreateFromJSONTest3, classDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 4", ClassDiagramCreateFromJSONTest4, classDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 5", ClassDiagramCreateFromJSONTest5, classDiagramSequence)
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
    })
    let elementKeys = Object.keys(classDiagram.diagramDescription)
    let classboxesKeys = Object.keys(classDiagram.classboxes)
    if ((elementKeys.length == 0) && (classboxesKeys.length == 0)) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ClassDiagramCreateFromJSONTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, {
        "elements":
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
    let elementKeys = Object.keys(classDiagram.diagramDescription)
    let classboxesKeys = Object.keys(classDiagram.classboxes)
    if ((elementKeys.length == 1) && (classboxesKeys.length == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest3.html", true)

        test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest3.html")
        test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramCreateFromJSONTest3.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ClassDiagramCreateFromJSONTest4(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "MyClass1": { "x": 0, "y": 0 },
            "MyClass2": { "x": 150, "y": 0 }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, {
        "elements":
            [
                { 
                    "class":
                        {
                            "name": "MyClass1",
                             "attributes":
                                 [
                                 ],
                             "operations":
                                 [
                                 ]
                        }
                },
                { 
                    "class":
                        {
                            "name": "MyClass2",
                             "attributes":
                                 [
                                 ],
                             "operations":
                                 [
                                 ]
                        }
                }
            ]
    },
    layout)

    let elementKeys = Object.keys(classDiagram.diagramDescription)
    let classboxesKeys = Object.keys(classDiagram.classboxes)
    if ((elementKeys.length == 1) && (classboxesKeys.length == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest4.html", true)

        test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest4.html")
        test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramCreateFromJSONTest4.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ClassDiagramCreateFromJSONTest5(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "MyBaseClass": { "x": 0, "y": 0 },
            "MyDerivedClass": { "x": 170, "y": 0 }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, {
        "elements":
            [
                { 
                    "class":
                        {
                            "name": "MyBaseClass",
                             "attributes":
                                 [
                                 ],
                             "operations":
                                 [
                                 ]
                        }
                },
                { 
                    "class":
                        {
                            "name": "MyDerivedClass",
                             "attributes":
                                 [
                                 ],
                             "operations":
                                 [
                                 ]
                        }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "MyBaseClass",
                        "derivedclass": "MyDerivedClass"
                    }
                }
            ]
    },
    layout)

    let elementKeys = Object.keys(classDiagram.diagramDescription)
    let classboxesKeys = Object.keys(classDiagram.classboxes)
    if ((elementKeys.length == 1) && (classboxesKeys.length == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest5.html", true)

        test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest5.html")
        test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramCreateFromJSONTest5.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
