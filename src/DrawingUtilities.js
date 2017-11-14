'use strict'

class DrawingUtilities {

    // Add an attribute or operation compartment and updates the current dimensions
    // of the class box
    static addClassCompartmentText(textLayer, currentDimensions, borderAdjustment, style, items, cssClass) {
        let y = (currentDimensions.height + style.getTopMargin("classbox"))
        let dimensions = createAttributeOrOperationGroupDef(textLayer, currentDimensions.width, y, borderAdjustment.left + style.getLeftMargin("classbox"), borderAdjustment.top, items, cssClass)
        dimensions.height += (style.getTopMargin("classbox") + style.getBottomMargin("classbox"))
        return dimensions
    }

}

// Creates a group with all the attributes or operations
function createAttributeOrOperationGroupDef(textLayer, x, y, offsetX, offsetY, items, cssClass) {
    let width = 0
    let height = 0
    let itemGroupDef = textLayer.group().addClass(cssClass)
    for (var i = 0; i < items.length; i++) {
        let itemDef = createAttributeOrOperationDef(itemGroupDef, items[i])
        itemDef.move(offsetX, offsetY + y + height)
        width = Math.max(width, itemDef.bbox().width)
        height += itemDef.bbox().height
    }
    return { width: width, height: height }
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
