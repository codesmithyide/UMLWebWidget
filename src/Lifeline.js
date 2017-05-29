'use strict'

export class Lifeline {

    constructor(svg, lifelineDescription, lifelineStyle, layout) {
        this.lifelineDescription = lifelineDescription
        this.def = createDef(svg.defs(), lifelineDescription, lifelineStyle, layout)
        this.svg = svg.use(this.def)

        // List of connectors that are connected to this lifeline
        this.connectors = [ ]
    }

    drawLine(svg) {
        let firstConnectorY = 0
        if (this.connectors.length > 0) {
            firstConnectorY = this.connectors[0].svg.bbox().y
        }
        let lastConnectorY = 0
        if (this.connectors.length > 0) {
            lastConnectorY = this.connectors[this.connectors.length - 1].svg.bbox().y + this.connectors[this.connectors.length - 1].svg.bbox().height
        }
        let lineGroup = svg.group().addClass("UMLLifeline")
        lineGroup.line(this.svg.bbox().cx, this.svg.bbox().y + this.svg.bbox().height, this.svg.bbox().cx, firstConnectorY)
        lineGroup.rect(8, (lastConnectorY - firstConnectorY)).move(this.svg.bbox().cx - 4, firstConnectorY)
    }

}

function createDef(defs, lifelineDescription, style, layout) {
    var lifelineGroup = defs.group().addClass("UMLLifeline")

    let currentDimensions = { 
        width: 0,
        height: 0
    }
    
    currentDimensions.height = style["margin-top"]

    var instanceNameDef = defs.text(":" + lifelineDescription.name).addClass("UMLInstanceName").move(style["margin-left"], currentDimensions.height)
    currentDimensions.width = Math.max(currentDimensions.width, instanceNameDef.bbox().width)
    currentDimensions.height += (instanceNameDef.bbox().height + style["margin-bottom"])

    currentDimensions.width += (style["margin-left"] + style["margin-right"])
    
    lifelineGroup.rect(currentDimensions.width, currentDimensions.height).move(0,0)
    lifelineGroup.use(instanceNameDef)

    // Offset by 1 to leave some space because the border stroke width is 2
    lifelineGroup.move(1,1)

    if (layout.lifelinepositions[lifelineDescription.name]) {
        lifelineGroup.move(layout.lifelinepositions[lifelineDescription.name].x, layout.lifelinepositions[lifelineDescription.name].y)
    }

    return lifelineGroup
}
