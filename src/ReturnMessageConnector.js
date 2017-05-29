'use strict'

export class ReturnMessageConnector {

    constructor(svg, classbox1, classbox2, text, layout) {
        this.classbox1 = classbox1
        this.classbox2 = classbox2
        this.text = text
        this.layout = layout
        this.svg = svg.group()
        this.svg.addClass("UMLReturnMessage")
    }

    draw() {
        this.svg.clear()
        let startX = this.classbox1.svg.bbox().cx
        let endX = this.classbox2.svg.bbox().cx

        this.svg.line(startX, 6, startX + 10, 0)
        this.svg.line(startX, 6, endX, 6).attr("stroke-dasharray", "4, 4")
        this.svg.line(startX, 6, startX + 10, 12)
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
