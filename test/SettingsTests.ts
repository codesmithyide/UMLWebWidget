/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let settingsSequence = theTestHarness.appendTestSequence("Settings tests")

    new tf.FunctionBasedTest("Creation test 1", SettingsCreationTest1, settingsSequence)
}

function SettingsCreationTest1(resolve) {
    let settings = new UMLWebWidget.Settings()
    resolve(tf.TestResultOutcome.ePassed)
}
