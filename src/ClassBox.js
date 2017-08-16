'use strict'

import { DiagramElement } from "./DiagramElement.js"
import { SVGLayerSet } from "./SVGLayerSet.js"

/** A class box. */
class ClassBox extends DiagramElement {

    constructor(svg, classDescription, canMove, style) {  
        super(svg)
        this.classDescription = classDescription

        this.def = createDef(this, svg.defs(), classDescription, canMove, style)

        this.svg = svg.use(this.def)

        // List of connectors that are connected to this class box
        this.connectors = [ ]
    }

    move(x, y) {
        this.def.move(x, y)
    }
        
    fire(evt) {
        if (evt == "positionchanged") {
            for (let i = 0; i < this.connectors.length; i++) {
                this.connectors[i].draw()        
            }
        }
    }

}

function createDef(self, defs, classInfo, canMove, style) {
    var classGroup = defs.group().addClass("UMLClass")

    let currentDimensions = { 
        width: 0,
        height: 0
    }
    
    currentDimensions.height = style.getTopMargin("classbox")

    var classNameDef = defs.text(classInfo.name).addClass("UMLClassName").move(style.getLeftMargin("classbox"), currentDimensions.height)
    currentDimensions.width = Math.max(currentDimensions.width, classNameDef.bbox().width)
    currentDimensions.height += (classNameDef.bbox().height + style.getBottomMargin("classbox"))

    var line1YPos = currentDimensions.height
    let attributeGroupDef = addCompartment(defs, currentDimensions, style, classInfo.attributes, "UMLAttribute")
 
    var line2YPos = currentDimensions.height
    let operationGroupDef = addCompartment(defs, currentDimensions, style, classInfo.operations, "UMLOperation")

    // According to the UML standard the class name must be
    // centered so center it
    if (currentDimensions.width > classNameDef.bbox().width) {
        classNameDef.dx((currentDimensions.width - classNameDef.bbox().width)/2)
    }

    currentDimensions.width += (style.getLeftMargin("classbox") + style.getRightMargin("classbox"))
    
    classGroup.rect(currentDimensions.width, currentDimensions.height).move(0,0)
    classGroup.use(classNameDef)
    classGroup.line(0, line1YPos, currentDimensions.width, line1YPos)
    classGroup.use(attributeGroupDef)
    classGroup.line(0, line2YPos, currentDimensions.width, line2YPos)
    classGroup.use(operationGroupDef)

    if (canMove) {
        classGroup.draggable(true)
        classGroup.on('dragmove.namespace', function(evt) {
            self.fire('positionchanged')
        })
        classGroup.on('dragend.namespace', function(evt) {
            self.fire('positionchanged')
        })
    }

    // Offset by 1 to leave some space because the border stroke width is 2
    classGroup.move(1,1)

    return classGroup
}

// Add an attribute or operation compartment and updates the current dimensions
// of the class box
function addCompartment(svg, currentDimensions, style, items, cssClass) {
    currentDimensions.height += style.getTopMargin("classbox")
    let compartmentDef = createAttributeOrOperationGroupDef(svg, currentDimensions, items, cssClass)
    compartmentDef.dmove(style.getLeftMargin("classbox"), 0)            
    currentDimensions.height += style.getBottomMargin("classbox")
    return compartmentDef
}

// Creates a group with all the attributes or operations
function createAttributeOrOperationGroupDef(svg, currentDimensions, items, cssClass) {
    let itemGroupDef = svg.group()
    for (var i = 0; i < items.length; i++) {
        let itemDef = createAttributeOrOperationDef(itemGroupDef, items[i], cssClass)
        itemDef.move(0, currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, itemDef.bbox().width)
        currentDimensions.height += itemDef.bbox().height
        }
    return itemGroupDef
}

// Creates a single attribute or operation line
function createAttributeOrOperationDef(svg, item, cssClass) {
    let text = visibilityStringToSymbol(item.visibility) + item.name
    if (item.return) {
        text += " : " + item.return
    }
    return svg.text(text).addClass(cssClass)
}

// Converts the visibility from the user string provided
// in the input to the appropriate UML symbol for
// visibility
function visibilityStringToSymbol(visibility) {
    let stringToSymbolMap = {
        "public": "+ ",
        "protected": "# ",
        "private": "- "
    }
    return stringToSymbolMap[visibility]
}

export { ClassBox }
