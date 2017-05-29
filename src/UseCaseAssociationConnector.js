'use strict'

export class UseCaseAssociationConnector {

    constructor(svg, classbox1, classbox2, text, layout) {
        this.classbox1 = classbox1
        this.classbox2 = classbox2
        this.text = text
        this.layout = layout
        this.svg = svg.group()
        this.svg.addClass("UMLUseCaseAssociation")
    }

    draw() {
        this.svg.clear()
        this.svg.line(this.classbox1.svg.bbox().x + this.classbox1.svg.bbox().width, this.classbox1.svg.bbox().cy, this.classbox2.svg.bbox().x, this.classbox2.svg.bbox().cy)
    }
      
    move(y) {
        this.svg.each(function(i, children) {
            this.dy(y)
        })
    }

    hide() {
        this.svg.hide()
    }

}
