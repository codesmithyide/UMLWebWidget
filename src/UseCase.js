'use strict'

export class UseCase {

    constructor(svg, useCaseDescription, layout) {
        this.def = svg.group().addClass("UMLUseCase")
        let textDef = this.def.defs().text(useCaseDescription.title).move(0, 0)
        this.def.ellipse(1.2*textDef.bbox().width, 3*textDef.bbox().height)
        this.def.use(textDef).move(0.1*textDef.bbox().width, textDef.bbox().height)
        if (layout.usecasepositions[useCaseDescription.title]) {
            this.def.move(layout.usecasepositions[useCaseDescription.title].x, layout.usecasepositions[useCaseDescription.title].y)
        }
        this.svg = svg.use(this.def)
    }

}
