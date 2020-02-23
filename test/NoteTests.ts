/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

import window = require("svgdom")
var SVG = require("svg.js")(window)
var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let noteSequence = theTestHarness.appendTestSequence("Note tests")

    new tf.FunctionBasedTest("Creation test 1", NoteCreationTest1, noteSequence)
}

function NoteCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let noteDescription = {
        title: "Note1"
    }
    let style = new UMLWebWidget.Style()
    let note = new UMLWebWidget.Note(svg, noteDescription.title, noteDescription , style)
    resolve(tf.TestResultOutcome.ePassed)
}
