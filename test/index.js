'use strict'

var AddSVGLayerTests = require("./SVGLayerTests.js")
var AddSVGLayerSetTests = require("./SVGLayerSetTests.js")
var AddUMLWebWidgetErrorTests = require("./UMLWebWidgetErrorTests.js")
var AddSettingsTests = require("./SettingsTests.js")
var AddStyleTests = require("./StyleTests.js")
var AddClassBoxTests = require("./ClassBoxTests.js")
var AddClassDiagramTests = require("./ClassDiagramTests.js")
var TestUtils = require("./TestUtils.js")
var tf = require("ishiko-test-framework")

let theTestHarness = new tf.TestHarness("codesmithy-umlwebwidget")

TestUtils.createDirectory(__dirname + "/output")

AddSVGLayerTests(theTestHarness)
AddSVGLayerSetTests(theTestHarness)
AddUMLWebWidgetErrorTests(theTestHarness)
AddSettingsTests(theTestHarness)
AddStyleTests(theTestHarness)
AddClassBoxTests(theTestHarness)
AddClassDiagramTests(theTestHarness)

theTestHarness.run()
