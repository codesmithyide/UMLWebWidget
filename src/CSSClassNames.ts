/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

const enum CSSClassName {
    Diagram = "codesmithy-uml-diagram",
    ClassBox = "codesmithy-uml-diagram__classbox",
    ClassBox_Shape = "classbox__shape",
    ClassBox_ClassNameCompartment = "classbox__class-name-compartment",
    ClassBox_AttributesCompartment = "classbox__attributes-compartment",
    ClassBox_OperationsCompartment = "classbox__operations-compartment",
    ClassTemplate = "codesmithy-uml-diagram__classtemplate",
    ClassTemplate_Shape = "classtemplate__shape",
    ClassTemplate_ClassNameCompartment = "classtemplate__class-name-compartment",
    ClassTemplate_AttributesCompartment = "classtemplate__attributes-compartment",
    ClassTemplate_OperationsCompartment = "classtemplate__operations-compartment",
    ClassTemplate_ParametersCompartment = "classtemplate__parameters-compartment",
    Lifeline = "codesmithy-uml-diagram__lifeline",
    Lifeline_Head = "lifeline__lifeline-head",
    Lifeline_Head_Shape = "lifeline-head__shape",
    Lifeline_Head_Text = "lifeline-head__text",
    Lifeline_Line = "lifeline__lifeline-line",
    InheritanceConnector = "codesmithy-uml-diagram__inheritance-connector",
    InheritanceConnector_Shape = "inheritance-connector__shape",
    CompositionConnector = "codesmithy-uml-diagram__composition-connector",
    CompositionConnector_Shape = "composition-connector__shape",
    AggregationConnector = "codesmithy-uml-diagram__aggregation-connector",
    AggregationConnector_Shape = "aggregation-connector__shape",
    CreationMessageConnector = "codesmithy-uml-diagram__creation-message-connector",
    SynchronousMessageConnector = "codesmithy-uml-diagram__synchronous-message-connector",
    ReturnMessageConnector = "codesmithy-uml-diagram__return-message-connector",
    DestructionMessageConnector = "codesmithy-uml-diagram__destruction-message-connector",
}

export { CSSClassName }
