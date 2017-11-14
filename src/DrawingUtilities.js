'use strict'

class DrawingUtilities {

    // Converts the visibility from the user string provided
    // in the input to the appropriate UML symbol for
    // visibility
    static visibilityStringToSymbol(visibility) {
        let stringToSymbolMap = {
            "public": "+ ",
            "protected": "# ",
            "private": "- "
        }
        return stringToSymbolMap[visibility]
    }

}

export { DrawingUtilities }
