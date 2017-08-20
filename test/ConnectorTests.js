'use strict'

var window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")
var TestUtils = require("./TestUtils.js")

module.exports = function(theTestHarness) {
    let connectorSequence = theTestHarness.appendTestSequence("Connector tests")

    new tf.FunctionBasedTest("Creation test 1", ConnectorCreationTest1, connectorSequence)

    new tf.FileComparisonTest("getLayers test 1", ConnectorGetLayersTest1, connectorSequence)
    new tf.FileComparisonTest("getLayers test 2", ConnectorGetLayersTest2, connectorSequence)
    new tf.FileComparisonTest("getLayers test 3", ConnectorGetLayersTest3, connectorSequence)
    new tf.FileComparisonTest("getLayers test 4", ConnectorGetLayersTest4, connectorSequence)
}

function ConnectorCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let connector = new UMLWebWidget.Connector(svg)
    resolve(tf.TestResultOutcome.ePassed)
}

function ConnectorGetLayersTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let connectionPoint1 = new UMLWebWidget.ConnectionPoint(svg, null)
    connectionPoint1.move(20, 20)
    let connectionPoint2 = new UMLWebWidget.ConnectionPoint(svg, null, UMLWebWidget.ConnectionPointPosition.LeftCenter)
    connectionPoint2.move(60, 20)
    let connector = new UMLWebWidget.Connector(svg, "inheritance", connectionPoint1, connectionPoint2)

    let layers = connector.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/ConnectorGetLayersTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/ConnectorGetLayersTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/ConnectorGetLayersTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function ConnectorGetLayersTest2(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let connectionPoint1 = new UMLWebWidget.ConnectionPoint(svg, null)
    connectionPoint1.move(60, 20)
    let connectionPoint2 = new UMLWebWidget.ConnectionPoint(svg, null, UMLWebWidget.ConnectionPointPosition.RightCenter)
    connectionPoint2.move(20, 20)
    let connector = new UMLWebWidget.Connector(svg, "inheritance", connectionPoint1, connectionPoint2)

    let layers = connector.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/ConnectorGetLayersTest2.html", true)

    test.setOutputFilePath(__dirname + "/output/ConnectorGetLayersTest2.html")
    test.setReferenceFilePath(__dirname + "/reference/ConnectorGetLayersTest2.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function ConnectorGetLayersTest3(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let connectionPoint1 = new UMLWebWidget.ConnectionPoint(svg, null)
    connectionPoint1.move(20, 20)
    let connectionPoint2 = new UMLWebWidget.ConnectionPoint(svg, null, UMLWebWidget.ConnectionPointPosition.TopCenter)
    connectionPoint2.move(20, 60)
    let connector = new UMLWebWidget.Connector(svg, "inheritance", connectionPoint1, connectionPoint2)

    let layers = connector.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/ConnectorGetLayersTest3.html", true)

    test.setOutputFilePath(__dirname + "/output/ConnectorGetLayersTest3.html")
    test.setReferenceFilePath(__dirname + "/reference/ConnectorGetLayersTest3.html")

    resolve(tf.TestResultOutcome.ePassed)
}

function ConnectorGetLayersTest4(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let connectionPoint1 = new UMLWebWidget.ConnectionPoint(svg, null)
    connectionPoint1.move(20, 60)
    let connectionPoint2 = new UMLWebWidget.ConnectionPoint(svg, null, UMLWebWidget.ConnectionPointPosition.BottomCenter)
    connectionPoint2.move(20, 20)
    let connector = new UMLWebWidget.Connector(svg, "inheritance", connectionPoint1, connectionPoint2)

    let layers = connector.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/ConnectorGetLayersTest4.html", true)

    test.setOutputFilePath(__dirname + "/output/ConnectorGetLayersTest4.html")
    test.setReferenceFilePath(__dirname + "/reference/ConnectorGetLayersTest4.html")

    resolve(tf.TestResultOutcome.ePassed)
}
