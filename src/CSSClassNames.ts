/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

const enum CSSClassName {
    Diagram = "codesmithy-uml-diagram",
    ClassBox = "class-box",
    ClassBox_Shape = "class-box__shape",
    ClassBox_ClassNameCompartment = "class-box__class-name-compartment",
    ClassBox_AttributesCompartment = "class-box__attributes-compartment",
    ClassBox_OperationsCompartment = "class-box__operations-compartment",
    ClassTemplate = "class-template",
    ClassTemplate_Shape = "class-template__shape",
    ClassTemplate_ClassNameCompartment = "class-template__class-name-compartment",
    ClassTemplate_AttributesCompartment = "class-template__attributes-compartment",
    ClassTemplate_OperationsCompartment = "class-template__operations-compartment",
    ClassTemplate_ParametersCompartment = "class-template__parameters-compartment",
    Lifeline = "lifeline",
    Lifeline_Head = "lifeline__lifeline-head",
    Lifeline_Head_Shape = "lifeline-head__shape",
    Lifeline_Head_Text = "lifeline-head__text",
    Lifeline_Line = "lifeline__lifeline-line",
    Connector = "connector",
    InheritanceConnector = "connector connector--inheritance",
    CompositionConnector = "connector connector--composition",
    AggregationConnector = "connector connector--aggregation",
    CreationMessageConnector = "connector connector--creation-message",
    SynchronousMessageConnector = "connector connector--synchronous-message",
    ReturnMessageConnector = "connector connector--return-message",
    DestructionMessageConnector = "connector connector--destruction-message",
    ConnectorShape = "connector__shape"
}

export { CSSClassName }
