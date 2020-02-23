/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.ts")

module.exports = function(theTestHarness) {
    let classtemplateSequence = theTestHarness.appendTestSequence("ClassTemplate tests")

    TestUtils.createDirectory(__dirname + "/output/classtemplatetests")

    new tf.FunctionBasedTest("Creation test 1", ClassTemplateCreationTest1, classtemplateSequence)

    new tf.FileComparisonTest("getLayers test 1", ClassTemplateGetLayersTest1, classtemplateSequence)
    new tf.FileComparisonTest("getLayers test 2", ClassTemplateGetLayersTest2, classtemplateSequence)
}

function ClassTemplateCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let classTemplateDescription = {
        "name": "MyClassTemplate",
        "attributes":
            [
            ],
        "operations":
            [
            ]
    }
    let style = new UMLWebWidget.Style()
    let classtemplate = new UMLWebWidget.ClassTemplate(svg, classTemplateDescription.name, classTemplateDescription, style)
    resolve(tf.TestResultOutcome.ePassed)
}

function ClassTemplateGetLayersTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let classTemplateDescription = {
        "name": "MyClassTemplate",
        "parameters": [ "T" ],
        "attributes":
            [
            ],
        "operations":
            [
            ]
    }
    let style = new UMLWebWidget.Style()
    let classtemplate = new UMLWebWidget.ClassTemplate(svg, classTemplateDescription.name, classTemplateDescription, style)

    let layers = classtemplate.getLayers()
    layers.layers["shape"].write()
    layers.layers["text"].write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/classtemplatetests/ClassTemplateGetLayersTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/classtemplatetests/ClassTemplateGetLayersTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/classtemplatetests/ClassTemplateGetLayersTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function ClassTemplateGetLayersTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div")).size(400, 400)

    let classTemplateDescription = {
        "name": "MyClassTemplate",
        "parameters": [ "T" ],
        "attributes":
            [
                {
                    "name": "m_attr1", "visibility": "public" 
                },
                {
                    "name": "m_attr2", "visibility": "protected" 
                },
                {
                    "name": "m_attr3", "visibility": "private" 
                }
            ],
        "operations":
            [
                { 
                    "name": "method1()", "visibility": "public", "return": "int"
                },
                { 
                    "name": "method2()", "visibility": "protected", "return": "void"
                },
                { 
                    "name": "method3()", "visibility": "private", "return": "std::string"
                }
            ]
    }
    let style = new UMLWebWidget.Style()
    let classtemplate = new UMLWebWidget.ClassTemplate(svg, classTemplateDescription.name, classTemplateDescription, style)

    let layers = classtemplate.getLayers()
    layers.layers["shape"].write()
    layers.layers["text"].write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/classtemplatetests/ClassTemplateGetLayersTest2.html", true)

    test.setOutputFilePath(__dirname + "/output/classtemplatetests/ClassTemplateGetLayersTest2.html")
    test.setReferenceFilePath(__dirname + "/reference/classtemplatetests/ClassTemplateGetLayersTest2.html")

    resolve(tf.TestResultOutcome.ePassed)
}
