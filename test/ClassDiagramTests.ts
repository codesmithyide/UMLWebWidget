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
    let classDiagramSequence = theTestHarness.appendTestSequence("Class diagram tests")

    TestUtils.createDirectory(__dirname + "/output/classdiagramtests")

    new tf.FunctionBasedTest("Creation test 1", ClassDiagramCreationTest1, classDiagramSequence)

    new tf.FunctionBasedTest("createFromJSON test 1", ClassDiagramCreateFromJSONTest1, classDiagramSequence)
    new tf.FunctionBasedTest("createFromJSON test 2", ClassDiagramCreateFromJSONTest2, classDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 3", ClassDiagramCreateFromJSONTest3, classDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 4", ClassDiagramCreateFromJSONTest4, classDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 5", ClassDiagramCreateFromJSONTest5, classDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 6", ClassDiagramCreateFromJSONTest6, classDiagramSequence)
    new tf.FileComparisonTest("createFromJSON test 7", ClassDiagramCreateFromJSONTest7, classDiagramSequence)

    new tf.FileComparisonTest("connector layout test 1", ClassDiagramConnectorLayoutTest1, classDiagramSequence)
    new tf.FileComparisonTest("connector layout test 2", ClassDiagramConnectorLayoutTest2, classDiagramSequence)
    new tf.FileComparisonTest("connector layout test 3", ClassDiagramConnectorLayoutTest3, classDiagramSequence)
    new tf.FileComparisonTest("connector layout test 4", ClassDiagramConnectorLayoutTest4, classDiagramSequence)
    new tf.FileComparisonTest("connector layout test 5", ClassDiagramConnectorLayoutTest5, classDiagramSequence)

    new tf.FileComparisonTest("class template test 1", ClassDiagramClassTemplateTest1, classDiagramSequence)
    new tf.FileComparisonTest("class template test 2", ClassDiagramClassTemplateTest2, classDiagramSequence)
}

function ClassDiagramCreationTest1(resolve) {
    let classDiagram = new UMLWebWidget.Diagram()
    resolve(tf.TestResultOutcome.ePassed)
}

function ClassDiagramCreateFromJSONTest1(resolve) {
    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON()
    let descriptionKeys = Object.keys(classDiagram.diagramDescription)
    if ((descriptionKeys.length == 0) && (classDiagram.classboxes.size == 0)) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ClassDiagramCreateFromJSONTest2(resolve) {
    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(null, "ClassDiagramCreateFromJSONTest2", {
    })
    let elementKeys = Object.keys(classDiagram.diagramDescription)
    if ((elementKeys.length == 0) && (classDiagram.classboxes.size == 0)) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ClassDiagramCreateFromJSONTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))
    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramCreateFromJSONTest3", {
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
    if ((elementKeys.length == 1) && (classDiagram.classboxes.size == 1)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest3.html", true)

        test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest3.html")
        test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramCreateFromJSONTest3.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

// A class diagram with 2 classes without any relationships
function ClassDiagramCreateFromJSONTest4(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "ClassDiagramCreateFromJSONTest4--class-box--MyClass1": { "position": { "x": 0, "y": 0 } },
            "ClassDiagramCreateFromJSONTest4--class-box--MyClass2": { "position": { "x": 150, "y": 0 } }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramCreateFromJSONTest4", {
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
    if ((elementKeys.length == 1) && (classDiagram.classboxes.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest4.html", true)

        test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest4.html")
        test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramCreateFromJSONTest4.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

// A class diagram with a base class and a derived class
function ClassDiagramCreateFromJSONTest5(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "ClassDiagramCreateFromJSONTest5--class-box--MyBaseClass": { "position": { "x": 0, "y": 0 } },
            "ClassDiagramCreateFromJSONTest5--class-box--MyDerivedClass": { "position": { "x": 170, "y": 0 } }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramCreateFromJSONTest5", {
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
    if ((elementKeys.length == 1) && (classDiagram.classboxes.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest5.html", true)

        test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest5.html")
        test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramCreateFromJSONTest5.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

// A class diagram with 2 classes and a composition relationship
function ClassDiagramCreateFromJSONTest6(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "ClassDiagramCreateFromJSONTest6--class-box--ContainingClass": { "position": { "x": 0, "y": 0 } },
            "ClassDiagramCreateFromJSONTest6--class-box--ContainedClass": { "position": { "x": 200, "y": 0 } }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramCreateFromJSONTest6", {
        "elements":
            [
                { 
                    "class":
                        {
                            "name": "ContainingClass",
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
                            "name": "ContainedClass",
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
                        "type": "composition",
                        "containingclass": "ContainingClass",
                        "containedclass": "ContainedClass"
                    }
                }
            ]
    },
    layout)

    let elementKeys = Object.keys(classDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (classDiagram.classboxes.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest6.html", true)

        test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest6.html")
        test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramCreateFromJSONTest6.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

// A class diagram with 2 classes and an aggregation relationship
function ClassDiagramCreateFromJSONTest7(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "ClassDiagramCreateFromJSONTest7--class-box--ContainingClass": { "position": { "x": 0, "y": 0 } },
            "ClassDiagramCreateFromJSONTest7--class-box--ContainedClass": { "position": { "x": 200, "y": 0 } }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramCreateFromJSONTest7", {
        "elements":
            [
                { 
                    "class":
                        {
                            "name": "ContainingClass",
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
                            "name": "ContainedClass",
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
                        "type": "aggregation",
                        "containingclass": "ContainingClass",
                        "containedclass": "ContainedClass"
                    }
                }
            ]
    },
    layout)

    let elementKeys = Object.keys(classDiagram.diagramDescription)
    if ((elementKeys.length == 1) && (classDiagram.classboxes.size == 2)) {
        TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest7.html", true)

        test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramCreateFromJSONTest7.html")
        test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramCreateFromJSONTest7.html")

        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ClassDiagramConnectorLayoutTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(400, 400)

    let layout = {
        "elements": {
            "ClassDiagramConnectorLayoutTest1--class-box--Base": { "position": { "x": 150, "y": 125 } },
            "ClassDiagramConnectorLayoutTest1--class-box--Derived1": { "position": { "x": 134, "y": 0 } },
            "ClassDiagramConnectorLayoutTest1--class-box--Derived2": { "position": { "x": 0, "y": 125 } },
            "ClassDiagramConnectorLayoutTest1--class-box--Derived3": { "position": { "x": 260, "y": 125 } },
            "ClassDiagramConnectorLayoutTest1--class-box--Derived4": { "position": { "x": 134, "y": 250 } }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramConnectorLayoutTest1", {
        "elements":
            [
                { 
                    "class":
                        {
                            "name": "Base",
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
                            "name": "Derived1",
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
                            "name": "Derived2",
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
                            "name": "Derived3",
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
                            "name": "Derived4",
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
                        "baseclass": "Base",
                        "derivedclass": "Derived1"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived2"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived3"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived4"
                    }
                }
            ]
    },
    layout)

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramConnectorLayoutTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramConnectorLayoutTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramConnectorLayoutTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function ClassDiagramConnectorLayoutTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(400, 400)

    let layout = {
        "elements": {
            "ClassDiagramConnectorLayoutTest2--class-box--Base": { "position": { "x": 150, "y": 125 } },
            "ClassDiagramConnectorLayoutTest2--class-box--Derived1": { "position": { "x": 0, "y": 0 } },
            "ClassDiagramConnectorLayoutTest2--class-box--Derived2": { "position": { "x": 260, "y": 0 } },
            "ClassDiagramConnectorLayoutTest2--class-box--Derived3": { "position": { "x": 0, "y": 250 } },
            "ClassDiagramConnectorLayoutTest2--class-box--Derived4": { "position": { "x": 260, "y": 250 } }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramConnectorLayoutTest2", {
        "elements":
            [
                { 
                    "class":
                        {
                            "name": "Base",
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
                            "name": "Derived1",
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
                            "name": "Derived2",
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
                            "name": "Derived3",
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
                            "name": "Derived4",
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
                        "baseclass": "Base",
                        "derivedclass": "Derived1"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived2"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived3"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived4"
                    }
                }
            ]
    },
    layout)

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramConnectorLayoutTest2.html", true)

    test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramConnectorLayoutTest2.html")
    test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramConnectorLayoutTest2.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function ClassDiagramConnectorLayoutTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(400, 400)

    let layout = {
        "elements": {
            "ClassDiagramConnectorLayoutTest3--class-box--Base": { "position": { "x": 150, "y": 65 } },
            "ClassDiagramConnectorLayoutTest3--class-box--Derived1": { "position": { "x": 0, "y": 0 } },
            "ClassDiagramConnectorLayoutTest3--class-box--Derived2": { "position": { "x": 260, "y": 0 } },
            "ClassDiagramConnectorLayoutTest3--class-box--Derived3": { "position": { "x": 0, "y": 130 } },
            "ClassDiagramConnectorLayoutTest3--class-box--Derived4": { "position": { "x": 260, "y": 130 } }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramConnectorLayoutTest3", {
        "elements":
            [
                { 
                    "class":
                        {
                            "name": "Base",
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
                            "name": "Derived1",
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
                            "name": "Derived2",
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
                            "name": "Derived3",
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
                            "name": "Derived4",
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
                        "baseclass": "Base",
                        "derivedclass": "Derived1"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived2"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived3"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived4"
                    }
                }
            ]
    },
    layout)

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramConnectorLayoutTest3.html", true)

    test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramConnectorLayoutTest3.html")
    test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramConnectorLayoutTest3.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function ClassDiagramConnectorLayoutTest4(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(400, 400)

    let layout = {
        "elements": {
            "ClassDiagramConnectorLayoutTest4--class-box--Base": { "position": { "x": 150, "y": 65 } },
            "ClassDiagramConnectorLayoutTest4--class-box--Derived1": { "position": { "x": 0, "y": 0 } },
            "ClassDiagramConnectorLayoutTest4--class-box--Derived2": { "position": { "x": 260, "y": 0 } },
            "ClassDiagramConnectorLayoutTest4--class-box--Derived3": { "position": { "x": 0, "y": 130 } },
            "ClassDiagramConnectorLayoutTest4--class-box--Derived4": { "position": { "x": 260, "y": 130 } },
            "ClassDiagramConnectorLayoutTest4--class-box--Derived1-ClassDiagramConnectorLayoutTest4--class-box--Base-inheritance": { "end": "top-center" },
            "ClassDiagramConnectorLayoutTest4--class-box--Derived2-ClassDiagramConnectorLayoutTest4--class-box--Base-inheritance": { "end": "top-center" },
            "ClassDiagramConnectorLayoutTest4--class-box--Derived3-ClassDiagramConnectorLayoutTest4--class-box--Base-inheritance": { "end": "bottom-center" },
            "ClassDiagramConnectorLayoutTest4--class-box--Derived4-ClassDiagramConnectorLayoutTest4--class-box--Base-inheritance": { "end": "bottom-center" }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramConnectorLayoutTest4", {
        "elements":
            [
                { 
                    "class":
                        {
                            "name": "Base",
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
                            "name": "Derived1",
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
                            "name": "Derived2",
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
                            "name": "Derived3",
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
                            "name": "Derived4",
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
                        "baseclass": "Base",
                        "derivedclass": "Derived1"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived2"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived3"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived4"
                    }
                }
            ]
    },
    layout)

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramConnectorLayoutTest4.html", true)

    test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramConnectorLayoutTest4.html")
    test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramConnectorLayoutTest4.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function ClassDiagramConnectorLayoutTest5(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(400, 400)

    let layout = {
        "elements": {
            "ClassDiagramConnectorLayoutTest5--class-box--Base": { "position": { "x": 150, "y": 125 } },
            "ClassDiagramConnectorLayoutTest5--class-box--Derived1": { "position": { "x": 0, "y": 0 } },
            "ClassDiagramConnectorLayoutTest5--class-box--Derived2": { "position": { "x": 260, "y": 0 } },
            "ClassDiagramConnectorLayoutTest5--class-box--Derived3": { "position": { "x": 0, "y": 250 } },
            "ClassDiagramConnectorLayoutTest5--class-box--Derived4": { "position": { "x": 260, "y": 250 } },
            "ClassDiagramConnectorLayoutTest5--class-box--Derived1-ClassDiagramConnectorLayoutTest5--class-box--Base-inheritance": { "end": "left-center" },
            "ClassDiagramConnectorLayoutTest5--class-box--Derived2-ClassDiagramConnectorLayoutTest5--class-box--Base-inheritance": { "end": "right-center" },
            "ClassDiagramConnectorLayoutTest5--class-box--Derived3-ClassDiagramConnectorLayoutTest5--class-box--Base-inheritance": { "end": "left-center" },
            "ClassDiagramConnectorLayoutTest5--class-box--Derived4-ClassDiagramConnectorLayoutTest5--class-box--Base-inheritance": { "end": "right-center" }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramConnectorLayoutTest5", {
        "elements":
            [
                { 
                    "class":
                        {
                            "name": "Base",
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
                            "name": "Derived1",
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
                            "name": "Derived2",
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
                            "name": "Derived3",
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
                            "name": "Derived4",
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
                        "baseclass": "Base",
                        "derivedclass": "Derived1"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived2"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived3"
                    }
                },
                {
                    "relationship":
                    {
                        "type": "inheritance",
                        "baseclass": "Base",
                        "derivedclass": "Derived4"
                    }
                }
            ]
    },
    layout)

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramConnectorLayoutTest5.html", true)

    test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramConnectorLayoutTest5.html")
    test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramConnectorLayoutTest5.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function ClassDiagramClassTemplateTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramClassTemplateTest1", {
        "elements":
            [
                { 
                    "classtemplate":
                        {
                            "name": "ClassTemplate",
                            "parameters":
                                [
                                    "T"
                                ], 
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

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramClassTemplateTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramClassTemplateTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramClassTemplateTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function ClassDiagramClassTemplateTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let layout = {
        "elements": {
            "ClassTemplate": { "position": { "x": 0, "y": 0 } },
            "ClassDiagramClassTemplateTest2--class-box--MyClass": { "position": { "x": 175, "y": 16 } }
        }
    }

    let classDiagram = new UMLWebWidget.Diagram()
    classDiagram.createFromJSON(svg, "ClassDiagramClassTemplateTest2", {
        "elements":
            [
                { 
                    "classtemplate":
                        {
                            "name": "ClassTemplate",
                            "parameters":
                                [
                                    "T"
                                ], 
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
                            "name": "MyClass",
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
                        "baseclass": "ClassTemplate",
                        "derivedclass": "MyClass"
                    }
                }
            ]
    },
    layout)

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/classdiagramtests/ClassDiagramClassTemplateTest2.html", true)

    test.setOutputFilePath(__dirname + "/output/classdiagramtests/ClassDiagramClassTemplateTest2.html")
    test.setReferenceFilePath(__dirname + "/reference/classdiagramtests/ClassDiagramClassTemplateTest2.html")

    resolve(tf.TestResultOutcome.ePassed)
}
