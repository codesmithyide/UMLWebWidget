'use strict'

var AddClassDiagramTests = require("./ClassDiagramTests.js")
var tf = require("ishiko-test-framework")

let theTestHarness = new tf.TestHarness("codesmithy-umlwebwidget")

AddClassDiagramTests(theTestHarness)

theTestHarness.run()
