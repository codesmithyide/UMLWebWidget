/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

var AddSVGLayerTests = require("./SVGLayerTests.ts")
var AddSVGLayerSetTests = require("./SVGLayerSetTests.ts")
var AddErrorsTests = require("./ErrorsTests.ts")
var AddSettingsTests = require("./SettingsTests.ts")
var AddStyleTests = require("./StyleTests.ts")
var AddConnectionPointPositionTests = require("./ConnectionPointPositionTests.ts")
var AddConnectionPointTests = require("./ConnectionPointTests.ts")
var AddConnectorTests = require("./ConnectorTests.ts")
var AddLayoutManagerTests = require("./LayoutManagerTests.ts")
var AddClassBoxTests = require("./ClassBoxTests.ts")
var AddClassTemplateTests = require("./ClassTemplateTests.ts")
var AddLifelineTests = require("./LifelineTests.ts")
var AddActorTests = require("./ActorTests.ts")
var AddUseCaseTests = require("./UseCaseTests.ts")
var AddComponentTests = require("./ComponentTests.ts")
var AddNodeTests = require("./NodeTests.ts")
var AddClassDiagramTests = require("./ClassDiagramTests.ts")
var AddSequenceDiagramTests = require("./SequenceDiagramTests.ts")
var AddUseCaseDiagramTests = require("./UseCaseDiagramTests.ts")
var AddComponentDiagramTests = require("./ComponentDiagramTests.ts")
var AddDeploymentDiagramTests = require("./DeploymentDiagramTests.ts")
var AddNoteTests = require("./NoteTests.ts")
var TestUtils = require("./TestUtils.ts")
var tf = require("ishiko-test-framework")

let theTestHarness = new tf.TestHarness("codesmithy-umlwebwidget")

TestUtils.createDirectory(__dirname + "/output")

AddErrorsTests(theTestHarness)
AddSVGLayerTests(theTestHarness)
AddSVGLayerSetTests(theTestHarness)
AddSettingsTests(theTestHarness)
AddStyleTests(theTestHarness)
AddConnectionPointPositionTests(theTestHarness)
AddConnectionPointTests(theTestHarness)
AddConnectorTests(theTestHarness)
AddLayoutManagerTests(theTestHarness)
AddClassBoxTests(theTestHarness)
AddClassTemplateTests(theTestHarness)
AddLifelineTests(theTestHarness)
AddActorTests(theTestHarness)
AddUseCaseTests(theTestHarness)
AddComponentTests(theTestHarness)
AddNodeTests(theTestHarness)
AddClassDiagramTests(theTestHarness)
AddSequenceDiagramTests(theTestHarness)
AddUseCaseDiagramTests(theTestHarness)
AddComponentDiagramTests(theTestHarness)
AddDeploymentDiagramTests(theTestHarness)
AddNoteTests(theTestHarness)

theTestHarness.run()
