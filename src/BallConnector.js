'use strict'

var textDef = Symbol()

export class BallConnector {

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
        this.svgParentGroup.use(this[textDef]).move(this.x, this.y)
        this.svgParentGroup.circle(10).move(this.x + (this.width)/2 - 5, this.y + 22)
        this.svgParentGroup.line(this.x + 10 + (this.width)/2 - 5, this.y + 27, this.x + (this.width), this.y + 27)
    }

    getAssemblyConnectionPoint() {
        return { x: (this.x + (this.width / 2) - 4), y: this.y + this[textDef].bbox().height + 8 }
    }

}
