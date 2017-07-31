'use strict'

var fs = require('fs')
var AddSVGLayerTests = require("./SVGLayerTests.js")
var AddSVGLayerSetTests = require("./SVGLayerSetTests.js")
var AddUMLWebWidgetErrorTests = require("./UMLWebWidgetErrorTests.js")
var AddSettingsTests = require("./SettingsTests.js")
var AddClassBoxTests = require("./ClassBoxTests.js")
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

AddSVGLayerTests(theTestHarness)
AddSVGLayerSetTests(theTestHarness)
AddUMLWebWidgetErrorTests(theTestHarness)
AddSettingsTests(theTestHarness)
AddClassBoxTests(theTestHarness)
AddClassDiagramTests(theTestHarness)

theTestHarness.run()
