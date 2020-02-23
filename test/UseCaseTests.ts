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
var TestUtils = require("./TestUtils.ts")

module.exports = function(theTestHarness) {
    let useCaseSequence = theTestHarness.appendTestSequence("UseCase tests")

    TestUtils.createDirectory(__dirname + "/output/usecasetests")

    new tf.FunctionBasedTest("Creation test 1", UseCaseCreationTest1, useCaseSequence)

    new tf.FileComparisonTest("getLayers test 1", UseCaseGetLayersTest1, useCaseSequence)
}

function UseCaseCreationTest1(resolve) {
    let svg = SVG(window.document.createElement("div"))
    let useCaseDescription = {
        "title": "Pay for merchandise"
    }
    let useCase = new UMLWebWidget.UseCase(svg, useCaseDescription.title, useCaseDescription)
    resolve(tf.TestResultOutcome.ePassed)
}

function UseCaseGetLayersTest1(resolve, reject, test) {
    let svg = SVG(window.document.createElement("div"))

    let useCaseDescription = {
        "title": "Pay for merchandise"
    }

    let useCase = new UMLWebWidget.UseCase(svg, useCaseDescription.title, useCaseDescription)

    let layers = useCase.getLayers()
    layers.getLayer("shape").write()
    layers.getLayer("text").write()

    TestUtils.exportSVGToHTML(svg, __dirname + "/output/usecasetests/UseCaseGetLayersTest1.html", true)

    test.setOutputFilePath(__dirname + "/output/usecasetests/UseCaseGetLayersTest1.html")
    test.setReferenceFilePath(__dirname + "/reference/usecasetests/UseCaseGetLayersTest1.html")

    resolve(tf.TestResultOutcome.ePassed)
}
