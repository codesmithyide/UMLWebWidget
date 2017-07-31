'use strict'

var fs = require('fs')
var AddUMLWebWidgetErrorTests = require("./UMLWebWidgetErrorTests.js")
var AddSettingsTests = require("./SettingsTests.js")
var AddClassDiagramTests = require("./ClassDiagramTests.js")
var tf = require("ishiko-test-framework")

let theTestHarness = new tf.TestHarness("codesmithy-umlwebwidget")

try {
    fs.mkdirSync(__dirname + "/output")
} catch (e) {
    if (e.code !== 'EEXIST') {
        throw e
    }
}

AddUMLWebWidgetErrorTests(theTestHarness)
AddSettingsTests(theTestHarness)
AddClassDiagramTests(theTestHarness)

theTestHarness.run()
