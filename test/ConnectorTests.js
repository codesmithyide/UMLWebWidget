'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let connectorSequence = theTestHarness.appendTestSequence("Connector tests")

    new tf.FunctionBasedTest("Creation test 1", ConnectorCreationTest1, connectorSequence)
}

function ConnectorCreationTest1(resolve) {
    let connector = new UMLWebWidget.Connector()
    resolve(tf.TestResultOutcome.ePassed)
}
