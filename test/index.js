'use strict'

var AddSettingsTests = require("./SettingsTests.js")
var AddClassDiagramTests = require("./ClassDiagramTests.js")
var tf = require("ishiko-test-framework")

let theTestHarness = new tf.TestHarness("codesmithy-umlwebwidget")

AddSettingsTests(theTestHarness)
AddClassDiagramTests(theTestHarness)

theTestHarness.run()
