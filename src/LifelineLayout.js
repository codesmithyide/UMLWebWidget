'use strict'

class LifelineLayout {

    constructor() {
    }

    dolayout(connectionPoints, levels, adjustmentNeeded) {
        for (let i = 0; i < connectionPoints.length; i++) {
            let connectionPoint = connectionPoints[i]
            switch (connectionPoint.type) {
                case "synchronous-start":
                    this.addCallerOccurrence(levels, connectionPoint.point.y)
                    break

                case "synchronous-end":
                    this.addCalleeOccurrence(levels, connectionPoint.point.y)
                    break

                case "return-start":
                    this.addReturnOccurrence(levels, connectionPoint.point.y)
                    break

                case "return-end":
                    this.addReturnCalleeOccurrence(levels, connectionPoint.point.y)
                    break

                case "creation-start":
                    this.addCallerOccurrence(levels, connectionPoint.point.y)
                    break

                case "destruction-end":
                    if (adjustmentNeeded) {
                        this.addReturnOccurrence(levels, connectionPoint.point.y - 25)
                    }
                    this.addDestructionOccurrence(levels, connectionPoint.point.y)
                    break
            }
        }
    }

    addCallerOccurrence(levels, y) {
        levels.push([y, 1])
        concatenateLevels(levels)
    }

    addCalleeOccurrence(levels, y) {
        if (levels.length == 0) {
            levels.push([y, 1])
        } else {
            levels.push([y, levels[levels.length - 1][1] + 1])
        }
        concatenateLevels(levels)
    }

    addReturnOccurrence(levels, y) {
        let newLevel = 0
        let length = levels.length
        if (length > 0) {
            newLevel = Math.max(0, (levels[length - 1][1] - 1))
        }
        levels.push([y, newLevel])
        concatenateLevels(levels)
    }

    addReturnCalleeOccurrence(levels, y) {
        let length = levels.length
        if (length == 0) {
            levels.push([y, 1])
        } else {
            levels.push([y, levels[length - 1][1]])
        }
        concatenateLevels(levels)
    }

    addDestructionOccurrence(levels, y) {
        levels.push([y, 0])
    }

}

function concatenateLevels(levels) {
    let length = levels.length
    if (length >= 3) {
        if (levels[length - 3][1] == levels[length - 2][1]) {
            levels[length - 2][0] = levels[length - 1][0]
            levels[length - 2][1] = levels[length - 1][1]
            levels.pop()
        }
    }
}

export { LifelineLayout }
