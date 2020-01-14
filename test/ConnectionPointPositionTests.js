'use strict'

var UMLWebWidget = require("../dist/codesmithy-umlwebwidget.node.dev.js")
var tf = require("ishiko-test-framework")

module.exports = function(theTestHarness) {
    let positionSequence = theTestHarness.appendTestSequence("ConnectionPointPosition tests")

    new tf.FunctionBasedTest("Creation test 1", ConnectionPointPositionCreationTest1, positionSequence)

    new tf.FunctionBasedTest("TopCenter test 1", ConnectionPointPositionTopCenterTest1, positionSequence)
    new tf.FunctionBasedTest("TopRight test 1", ConnectionPointPositionTopRightTest1, positionSequence)
    new tf.FunctionBasedTest("RightCenter test 1", ConnectionPointPositionRightCenterTest1, positionSequence)
    new tf.FunctionBasedTest("BottomRight test 1", ConnectionPointPositionBottomRightTest1, positionSequence)
    new tf.FunctionBasedTest("BottomCenter test 1", ConnectionPointPositionBottomCenterTest1, positionSequence)
    new tf.FunctionBasedTest("BottomLeft test 1", ConnectionPointPositionBottomLeftTest1, positionSequence)
    new tf.FunctionBasedTest("LeftCenter test 1", ConnectionPointPositionLeftCenterTest1, positionSequence)
    new tf.FunctionBasedTest("TopLeft test 1", ConnectionPointPositionTopLeftTest1, positionSequence)
}

function ConnectionPointPositionCreationTest1(resolve) {
    let point = new UMLWebWidget.ConnectionPointPosition()
    resolve(tf.TestResultOutcome.ePassed)
}

function ConnectionPointPositionTopCenterTest1(resolve) {
    if (UMLWebWidget.ConnectionPointPosition.TopCenter.equals(new UMLWebWidget.ConnectionPointPosition("top-center"))) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ConnectionPointPositionTopRightTest1(resolve) {
    if (UMLWebWidget.ConnectionPointPosition.TopRight.equals(new UMLWebWidget.ConnectionPointPosition("top-right"))) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ConnectionPointPositionRightCenterTest1(resolve) {
    if (UMLWebWidget.ConnectionPointPosition.RightCenter.equals(new UMLWebWidget.ConnectionPointPosition("right-center"))) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ConnectionPointPositionBottomRightTest1(resolve) {
    if (UMLWebWidget.ConnectionPointPosition.BottomRight.equals(new UMLWebWidget.ConnectionPointPosition("bottom-right"))) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ConnectionPointPositionBottomCenterTest1(resolve) {
    if (UMLWebWidget.ConnectionPointPosition.BottomCenter.equals(new UMLWebWidget.ConnectionPointPosition("bottom-center"))) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ConnectionPointPositionBottomLeftTest1(resolve) {
    if (UMLWebWidget.ConnectionPointPosition.BottomLeft.equals(new UMLWebWidget.ConnectionPointPosition("bottom-left"))) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ConnectionPointPositionLeftCenterTest1(resolve) {
    if (UMLWebWidget.ConnectionPointPosition.LeftCenter.equals(new UMLWebWidget.ConnectionPointPosition("left-center"))) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}

function ConnectionPointPositionTopLeftTest1(resolve) {
    if (UMLWebWidget.ConnectionPointPosition.TopLeft.equals(new UMLWebWidget.ConnectionPointPosition("top-left"))) {
        resolve(tf.TestResultOutcome.ePassed)
    } else {
        resolve(tf.TestResultOutcome.eFailed)
    }
}
