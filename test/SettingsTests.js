'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let settingsSequence = theTestHarness.appendTestSequence("Settings tests")

    new tf.FunctionBasedTest("Creation test 1", SettingsCreationTest1, settingsSequence)
}

function SettingsCreationTest1(resolve) {
    let settings = new UMLWebWidget.Settings()
    resolve(tf.TestResultOutcome.ePassed)
}
