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
import { TestUtils } from "./TestUtils"

module.exports = function(theTestHarness) {
    let actorSequence = theTestHarness.appendTestSequence("Actor tests")

    TestUtils.createDirectory(__dirname + "/output/actortests")

    new tf.FunctionBasedTest("Creation test 1", ActorCreationTest1, actorSequence)

    new tf.FileComparisonTest("getLayers test 1", ActorGetLayersTest1, actorSequence)
}

function ActorCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let actorDescription = {
        "name": "Customer"
    }
    let actor = new UMLWebWidget.Actor(svg, actorDescription.name, actorDescription)
    resolve(tf.TestResultOutcome.ePassed)
}

function ActorGetLayersTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let actorDescription = {
        "name": "Customer"
    }

    let actor = new UMLWebWidget.Actor(svg, actorDescription.name, actorDescription)

    let layers = actor.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/actortests/ActorGetLayersTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/actortests/ActorGetLayersTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/actortests/ActorGetLayersTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}
