'use strict'

export class SynchronousMessageConnector {

    constructor(svg, classbox1, classbox2, text, layout) {

        this.classbox1 = classbox1
        this.classbox2 = classbox2
        this.text = text
        this.layout = layout
        this.svg = svg.group()
        this.svg.addClass("UMLSynchronousMessage")
    }

    draw() {
        this.svg.clear()
        let caller = this.classbox1
        let callee = this.classbox2
        if (caller != callee) {
            let startX = caller.svg.bbox().cx
            let endX = callee.svg.bbox().cx
            let width = (endX - startX)

            let textDef = this.svg.defs().text(this.text)
            if (textDef.bbox().width < width) {
                textDef.move((startX + ((width - textDef.bbox().width) / 2)), 0)
            }

            let y = textDef.bbox().height + 2
            this.svg.line(startX, y, endX - 12, y)
            let polygonDescription = "" + (endX - 12) + "," + (y - 6) + " " +
                endX + "," + y + " " +
                (endX - 12) + "," + (y + 6)
            this.svg.polygon(polygonDescription)
            this.svg.use(textDef)
        } else {
            let startX = caller.svg.bbox().cx
            let textDef = this.svg.defs().text(this.text).move(startX + 8, 5)
            let offsetY = textDef.bbox().y + textDef.bbox().height + 3
            this.svg.use(textDef)
            this.svg.line(startX, offsetY, startX + 30, offsetY)
            this.svg.line(startX + 30, offsetY, startX + 30, 20 + offsetY)
            this.svg.line(startX + 30, 20 + offsetY, startX, 20 + offsetY)
            let polygonDescription = "" + startX + "," + (20 + offsetY) + " " +
                (startX + 12) + "," + (20 + offsetY - 6) + " " +
                (startX + 12) + "," + (20 + offsetY + 6)
            this.svg.polygon(polygonDescription)
        }
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
