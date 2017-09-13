'use strict'

import { SVGLayerSet } from "./SVGLayerSet.js"

var textDef = Symbol()

/**
  A socket connector to represent a dependency for a 
  component.
*/
class SocketConnector {

    constructor(svg, component, name) {
        this.svg = svg
        this.layers = new SVGLayerSet(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.uptodate = false
        this.x = 0
        this.y = 0
        this.component = component
        this.name = name
        this.textGroup = this.textLayer.group()
        this[textDef] = this.textGroup.text(this.name).move(0, 0)
        this.width = this[textDef].bbox().width + 5
    }

    getLayers() {
        if (!this.uptodate) {
            this.update()
        }
        return this.layers
    }

    // Move the connector so that the top left
    // corner of the bounding box is at position
    // (x, y)
    move(x, y) {
        this.uptodate = false
        this.x = x
        this.y = y
    }

    // Move the connector so that its connection
    // point is at position (x, y)
    moveConnectionPoint(x, y) {
        this.uptodate = false
        let connectorOffsetY = this[textDef].bbox().height + 6
        y -= connectorOffsetY
        this.move(x, y)
    }

    update() {
        this.shapeLayer.clear()
        this[textDef].move(this.x + 5, this.y)
        let lineGroup = this.shapeLayer.group().addClass("UMLComponent")
        lineGroup.line(this.x, this.y + this[textDef].bbox().height + 8, this.x + (this.width / 2), this.y + this[textDef].bbox().height + 8)
        let clippath = this.svg.clip()
        clippath.rect(10, 17).move(this.x + (this.width / 2) - 1, this.y + this[textDef].bbox().height, 0)
        lineGroup.circle(15).move(this.x + (this.width / 2), this.y + this[textDef].bbox().height + 1).clipWith(clippath)
        this.uptodate = true
    }

    getAssemblyConnectionPoint() {
        return { x: (this.x + (this.width / 2) - 1 + 10), y: this.y + this[textDef].bbox().height + 8 }
    }

}

export { SocketConnector }
