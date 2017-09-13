'use strict'

/**
  This class computes and stores the depth levels for the execution
  specifications of the lifeline based on the messages received and
  sent.
*/
class LifelineLayout {

    constructor() {
        this.depthChanges = [ ]
    }

    dolayout(connectionPoints, adjustmentNeeded) {
        for (let i = 0; i < connectionPoints.length; i++) {
            let connectionPoint = connectionPoints[i]
            switch (connectionPoint.type) {
                case "synchronous-start":
                    addCallerOccurrence(this.depthChanges, connectionPoint.point.y)
                    break

                case "synchronous-end":
                    addCalleeOccurrence(this.depthChanges, connectionPoint.point.y)
                    break

                case "return-start":
                    addReturnOccurrence(this.depthChanges, connectionPoint.point.y)
                    break

                case "return-end":
                    addReturnCalleeOccurrence(this.depthChanges, connectionPoint.point.y)
                    break

                case "creation-start":
                    addCallerOccurrence(this.depthChanges, connectionPoint.point.y)
                    break

                case "destruction-end":
                    if (adjustmentNeeded) {
                        addReturnOccurrence(this.depthChanges, connectionPoint.point.y - 25)
                    }
                    addDestructionOccurrence(this.depthChanges, connectionPoint.point.y)
                    break
            }
        }
    }

}

function addCallerOccurrence(depthChanges, y) {
    depthChanges.push([y, 1])
    concatenateLevels(depthChanges)
}

function addCalleeOccurrence(depthChanges, y) {
    if (depthChanges.length == 0) {
        depthChanges.push([y, 1])
    } else {
        depthChanges.push([y, depthChanges[depthChanges.length - 1][1] + 1])
    }
    concatenateLevels(depthChanges)
}

function addReturnOccurrence(depthChanges, y) {
    let newLevel = 0
    let length = depthChanges.length
    if (length > 0) {
        newLevel = Math.max(0, (depthChanges[length - 1][1] - 1))
    }
    depthChanges.push([y, newLevel])
    concatenateLevels(depthChanges)
}

function addReturnCalleeOccurrence(depthChanges, y) {
    let length = depthChanges.length
    if (length == 0) {
        depthChanges.push([y, 1])
    } else {
        depthChanges.push([y, depthChanges[length - 1][1]])
    }
    concatenateLevels(depthChanges)
}

function addDestructionOccurrence(depthChanges, y) {
    depthChanges.push([y, 0])
}

function concatenateLevels(depthChanges) {
    let length = depthChanges.length
    if (length >= 3) {
        if (depthChanges[length - 3][1] == depthChanges[length - 2][1]) {
            depthChanges[length - 2][0] = depthChanges[length - 1][0]
            depthChanges[length - 2][1] = depthChanges[length - 1][1]
            depthChanges.pop()
        }
    }
}

export { LifelineLayout }
