'use strict'

export class Actor {

    constructor(svg, actorDescription, layout) {
        this.actorDescription = actorDescription
        this.def = svg.group().addClass("UMLActor")
        this.draw(this.def, this.actorDescription)
        this.svg = svg.use(this.def)
    }

    draw(svg, actorDescription) {
        let textDef = svg.text(actorDescription.name).move(0, 35)
        let width = textDef.bbox().width
        let offset = ((width - 16) / 2)
        svg.circle(12).move(2 + offset, 1)
        svg.line(8 + offset, 13, 8 + offset, 26)
        svg.line(offset, 18, 16 + offset, 18)
        svg.line(8 + offset, 26, offset, 33)
        svg.line(8 + offset, 26, 16 + offset, 33)

        if (layout.actorpositions[actorDescription.name]) {
            svg.move(layout.actorpositions[actorDescription.name].x, layout.actorpositions[actorDescription.name].y)
        }

        svg.use(textDef)     
    }
}
