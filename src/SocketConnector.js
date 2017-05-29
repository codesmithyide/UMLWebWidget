'use strict'

var textDef = Symbol()

export class SocketConnector {

    constructor(svgDefs, svgParentGroup, text) {
        this.svgParentGroup = svgParentGroup
        this.x = 0
        this.y = 0
        this[textDef] = svgDefs.text(text).move(0, 0)
        this.width = this[textDef].bbox().width + 5
    }

    // Move the connector so that the top left
    // corner of the bounding box is at position
    // (x, y)
    move(x, y) {
        this.x = x
        this.y = y
    }

    // Move the connector so that its connection
    // point is at position (x, y)
    moveConnectionPoint(x, y) {
        let connectorOffsetY = this[textDef].bbox().height + 6
        y -= connectorOffsetY
        this.move(x, y)
    }

    draw() {
        this.svgParentGroup.use(this[textDef]).move(this.x + 5, this.y)
        this.svgParentGroup.line(this.x, this.y + this[textDef].bbox().height + 8, this.x + (this.width / 2), this.y + this[textDef].bbox().height + 8)
        let clippath = this.svgParentGroup.clip()
        clippath.rect(10, 17).move(this.x + (this.width / 2) - 1, this.y + this[textDef].bbox().height, 0)
        this.svgParentGroup.circle(15).move(this.x + (this.width / 2), this.y + this[textDef].bbox().height + 1).clipWith(clippath)
    }

    getAssemblyConnectionPoint() {
        return { x: (this.x + (this.width / 2) - 1 + 10), y: this.y + this[textDef].bbox().height + 8 }
    }

}
