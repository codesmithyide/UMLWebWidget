'use strict'

class DrawingUtilities {

    // Creates a single attribute or operation line
    static createAttributeOrOperationDef(svg, item) {
        let text = visibilityStringToSymbol(item.visibility) + item.name
        if (item.return) {
            text += " : " + item.return
        }
        return svg.text(text)
    }

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
