'use strict'

class DrawingUtilities {

    // Creates a group with all the attributes or operations
    static createAttributeOrOperationGroupDef(textLayer, currentDimensions, offsetX, offsetY, items, cssClass) {
        let itemGroupDef = textLayer.group().addClass(cssClass)
        for (var i = 0; i < items.length; i++) {
            let itemDef = createAttributeOrOperationDef(itemGroupDef, items[i])
            itemDef.move(offsetX, offsetY + currentDimensions.height)
            currentDimensions.width = Math.max(currentDimensions.width, itemDef.bbox().width)
            currentDimensions.height += itemDef.bbox().height
        }
        return itemGroupDef
    }

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
