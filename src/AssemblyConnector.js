'use strict'

export class AssemblyConnector {

    constructor(svgParentGroup) {
        this.svgParentGroup = svgParentGroup
        this.startPoint = { x: 0, y: 0 }
        this.endPoint = { x: 0, y: 0 }
    }

    move(x1, y1, x2, y2) {
        this.startPoint = { x: x1, y: y1 }
        this.endPoint = { x: x2, y: y2 }
    }

    draw() {
        let assemblyConnectorGroup = this.svgParentGroup.group().addClass("UMLAssemblyConnector")
        assemblyConnectorGroup.line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y).attr("stroke-dasharray", "8, 4")
        assemblyConnectorGroup.line(this.endPoint.x - 13, this.endPoint.y + 5, this.endPoint.x, this.endPoint.y)
        assemblyConnectorGroup.line(this.endPoint.x - 13, this.endPoint.y - 5, this.endPoint.x, this.endPoint.y)
    }

}
