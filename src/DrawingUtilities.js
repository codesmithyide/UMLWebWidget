'use strict'

class DrawingUtilities {

    // Add an attribute or operation compartment and updates the current dimensions
    // of the class box
    static addClassCompartmentText(textLayer, currentDimensions, borderAdjustment, style, items, cssClass) {
        currentDimensions.height += style.getTopMargin("classbox")
        let width = createAttributeOrOperationGroupDef(textLayer, currentDimensions, borderAdjustment.left + style.getLeftMargin("classbox"), borderAdjustment.top, items, cssClass)
        currentDimensions.height += style.getBottomMargin("classbox")
        return width
    }

}

// Creates a group with all the attributes or operations
function createAttributeOrOperationGroupDef(textLayer, currentDimensions, offsetX, offsetY, items, cssClass) {
    let width = 0
    let itemGroupDef = textLayer.group().addClass(cssClass)
    for (var i = 0; i < items.length; i++) {
        let itemDef = createAttributeOrOperationDef(itemGroupDef, items[i])
        itemDef.move(offsetX, offsetY + currentDimensions.height)
        width = Math.max(width, itemDef.bbox().width)
        currentDimensions.height += itemDef.bbox().height
    }
    return width
}

// Creates a single attribute or operation line
function createAttributeOrOperationDef(svg, item) {
    let text = visibilityStringToSymbol(item.visibility) + item.name
    if (item.return) {
        text += " : " + item.return
    }
    return svg.text(text)
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

export { DrawingUtilities }
