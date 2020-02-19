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
    let componentSequence = theTestHarness.appendTestSequence("Component tests")

    TestUtils.createDirectory(__dirname + "/output/componenttests")

    new tf.FunctionBasedTest("Creation test 1", ComponentCreationTest1, componentSequence)

    new tf.FileComparisonTest("getLayers test 1", ComponentGetLayersTest1, componentSequence)
    new tf.FileComparisonTest("getLayers test 2", ComponentGetLayersTest2, componentSequence)
    new tf.FileComparisonTest("getLayers test 3", ComponentGetLayersTest3, componentSequence)
    new tf.FileComparisonTest("getLayers test 4", ComponentGetLayersTest4, componentSequence)
}

function ComponentCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let componentDescription = {
        "name": "ControlPanel"
    }
    let style = new UMLWebWidget.Style()
    let component = new UMLWebWidget.Component(svg, componentDescription.name, componentDescription, style)
    resolve(tf.TestResultOutcome.ePassed)
}

// Test a component without any interfaces or dependencies
function ComponentGetLayersTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let componentDescription = {
        "name": "ControlPanel"
    }

    let style = new UMLWebWidget.Style()
    let component = new UMLWebWidget.Component(svg, componentDescription.name, componentDescription, style)

    let layers = component.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/componenttests/ComponentGetLayersTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/componenttests/ComponentGetLayersTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/componenttests/ComponentGetLayersTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}

// Test a component with a single dependency and no interfaces
function ComponentGetLayersTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let componentDescription = {
        "name": "ControlPanel",
        "dependencies":
            [
                { "name": "INetwork" }
            ]
    }

    let style = new UMLWebWidget.Style()
    let component = new UMLWebWidget.Component(svg, componentDescription.name, componentDescription, style)

    let layers = component.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/componenttests/ComponentGetLayersTest2.html", true)

    test.setOutputFilePath(__dirname + "/output/componenttests/ComponentGetLayersTest2.html")
    test.setReferenceFilePath(__dirname + "/reference/componenttests/ComponentGetLayersTest2.html")

    resolve(tf.TestResultOutcome.ePassed)
}

// Test a component with a single interface and no dependencies
function ComponentGetLayersTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let componentDescription = {
        "name": "ControlPanel",
        "interfaces":
            [
                { "name": "IControl" }
            ]
    }

    let style = new UMLWebWidget.Style()
    let component = new UMLWebWidget.Component(svg, componentDescription.name, componentDescription, style)

    let layers = component.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/componenttests/ComponentGetLayersTest3.html", true)

    test.setOutputFilePath(__dirname + "/output/componenttests/ComponentGetLayersTest3.html")
    test.setReferenceFilePath(__dirname + "/reference/componenttests/ComponentGetLayersTest3.html")

    resolve(tf.TestResultOutcome.ePassed)
}

// Test a component with a single interface and a single dependency
function ComponentGetLayersTest4(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let componentDescription = {
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

    let style = new UMLWebWidget.Style()
    let component = new UMLWebWidget.Component(svg, componentDescription.name, componentDescription, style)

    let layers = component.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/componenttests/ComponentGetLayersTest4.html", true)

    test.setOutputFilePath(__dirname + "/output/componenttests/ComponentGetLayersTest4.html")
    test.setReferenceFilePath(__dirname + "/reference/componenttests/ComponentGetLayersTest4.html")

    resolve(tf.TestResultOutcome.ePassed)
}
