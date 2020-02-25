
  //  if (interactive) {
    //  classGroup.click(function() {
      //  self.toggle(this)
//      })
  //  }


/* 
        this.sizingState = 0
        this.clientx = 0
        this.initialWidth = 0

        this.selectedClassBoxBorder = classGroup.group().hide()
        this.selectedClassBoxBorder.rect(10, 10).move(-5,-5)
        this.selectedClassBoxBorder.rect(10, 10).move((classBoxWidth/2) - 5, -5)
        var topRightSizingHandle = this.selectedClassBoxBorder.rect(10, 10).move(classBoxWidth - 5, -5).addClass("TopRightSizingHandle")
        topRightSizingHandle.mousedown(function(evt) {
            this.sizingState = 1
            this.initialWidth = this.width()
            this.clientx = evt.clientX
        })
        topRightSizingHandle.mousemove(function(evt) {
            if (this.sizingState == 1) {
                this.width(this.initialWidth + evt.clientX - this.clientx)
            }
        })
        topRightSizingHandle.mouseup(function(evt) {
            this.sizingState = 0
        })
        topRightSizingHandle.mouseout(function(evt) {
            this.sizingState = 0
        })
        this.selectedClassBoxBorder.rect(10, 10).move(classBoxWidth - 5, (classBoxHeight/2) - 5)
        this.selectedClassBoxBorder.rect(10, 10).move(classBoxWidth - 5, classBoxHeight - 5)
        this.selectedClassBoxBorder.rect(10, 10).move((classBoxWidth/2) - 5, classBoxHeight - 5)
        this.selectedClassBoxBorder.rect(10, 10).move(-5, classBoxHeight - 5)
        this.selectedClassBoxBorder.rect(10, 10).move(-5, (classBoxHeight/2) - 5)
*/
   
       return classGroup
    }

    this.draw = function(svg) {
        this.svg = svg.use(this.def)
    }

    this.hide = function() {
        this.svg.hide()
    }

    this.selected = false

    this.toggle = function(el) {
        if (this.selected) {
            this.selectedClassBoxBorder.hide()
            this.selected = false
        } else {
            this.selectedClassBoxBorder.show()
            this.selected = true
        }
    }

        let bbox2 = derivedclassbox.svg.bbox()

        let connectionPositions = getConnectionPositions(bbox1, bbox2)
        let startPoint = getConnectionPoint(connectionPositions.start, bbox2)
        let endPoint = getConnectionPoint(connectionPositions.end, bbox1)

        let polygonDescription
        switch (connectionPositions.end) {
            case ConnectorPosition.TopCenter:
                polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                    (endPoint.x - 10) + "," + (endPoint.y - 12) + " " +
                    (endPoint.x + 10) + "," + (endPoint.y - 12)                
                svg.polygon(polygonDescription)
                svg.line(endPoint.x, endPoint.y - 12, startPoint.x, startPoint.y)
                break

            case ConnectorPosition.RightCenter:
                polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                    (endPoint.x + 12) + "," + (endPoint.y - 10) + " " +
                    (endPoint.x + 12) + "," + (endPoint.y + 10)                
                svg.polygon(polygonDescription)
                if (endPoint.y == startPoint.y) {
                    svg.line(endPoint.x + 12, endPoint.y, startPoint.x, startPoint.y)
                } else {
                    middleX = (endPoint.x + 12 + ((startPoint.x - endPoint.x - 12)/2))
                    svg.line(endPoint.x + 12, endPoint.y, middleX, endPoint.y)
                    svg.line(middleX, endPoint.y, middleX, startPoint.y)
                    svg.line(middleX, startPoint.y, startPoint.x, startPoint.y)
                }
                break

            case ConnectorPosition.BottomCenter:
                polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                    (endPoint.x - 10) + "," + (endPoint.y + 12) + " " +
                    (endPoint.x + 10) + "," + (endPoint.y + 12)                
                svg.polygon(polygonDescription)
                if (endPoint.x == startPoint.x) {
                    svg.line(endPoint.x, endPoint.y + 12, startPoint.x, startPoint.y)
                } else {
                    middleY = (endPoint.y + 12 + ((startPoint.y - endPoint.y - 12)/2))
                    svg.line(endPoint.x, endPoint.y + 12, endPoint.x, middleY)
                    svg.line(endPoint.x, middleY, startPoint.x, middleY)
                    svg.line(startPoint.x, middleY, startPoint.x, startPoint.y)
                }
                break

            case ConnectorPosition.LeftCenter:
                polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                    (endPoint.x - 12) + "," + (endPoint.y - 10) + " " +
                    (endPoint.x - 12) + "," + (endPoint.y + 10)                
                svg.polygon(polygonDescription)
                if (endPoint.y == startPoint.y) {
                    svg.line(endPoint.x - 12, endPoint.y, startPoint.x, startPoint.y)
                } else {
                    middleX = (endPoint.x - 12 - ((endPoint.x - 12 - startPoint.x)/2))
                    svg.line(endPoint.x - 12, endPoint.y, middleX, endPoint.y)
                    svg.line(middleX, endPoint.y, middleX, startPoint.y)
                    svg.line(middleX, startPoint.y, startPoint.x, startPoint.y)
                }
                break
            }
        }

        
                }
            }

            let startPoint = getConnectionPoint(connectionPositions.start, bbox2)
            let endPoint = getConnectionPoint(connectionPositions.end, bbox1)

            let polygonDescription
            let middleX = 0
            let middleY = 0
            switch (connectionPositions.end) {
                case ConnectorPosition.TopCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x - 8) + "," + (endPoint.y - 10) + " " +
                        endPoint.x + "," + (endPoint.y - 20) + " " +
                        (endPoint.x + 8) + "," + (endPoint.y - 10)
                    svg.polygon(polygonDescription)
                    if (endPoint.x == startPoint.x) {
                        svg.line(endPoint.x, endPoint.y - 20, startPoint.x, startPoint.y)
                    } else {
                        middleY = (endPoint.y - 20 + ((startPoint.y - endPoint.y + 20)/2))
                        svg.line(endPoint.x, endPoint.y - 20, endPoint.x, middleY)
                        svg.line(endPoint.x, middleY, startPoint.x, middleY)
                        svg.line(startPoint.x, middleY, startPoint.x, startPoint.y)
                    }
                    break

                case ConnectorPosition.RightCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x + 10) + "," + (endPoint.y - 8) + " " +
                        (endPoint.x + 20) + "," + endPoint.y + " " +
                        (endPoint.x + 10) + "," + (endPoint.y + 8)
                    svg.polygon(polygonDescription)
                    if (connectionPositions.start == ConnectorPosition.LeftCenter) {                        
                        if (endPoint.y == startPoint.y) {
                            svg.line(endPoint.x + 20, endPoint.y, startPoint.x, startPoint.y)
                        } else {
                            middleX = (endPoint.x + 20 + ((startPoint.x - endPoint.x - 20)/2))
                            svg.line(endPoint.x + 20, endPoint.y, middleX, endPoint.y)
                            svg.line(middleX, endPoint.y, middleX, startPoint.y)
                            svg.line(middleX, startPoint.y, startPoint.x, startPoint.y)
                        }
                    } else {
                        svg.line(endPoint.x + 20, endPoint.y, startPoint.x, endPoint.y)
                        svg.line(startPoint.x, endPoint.y, startPoint.x, startPoint.y)
                    }
                    break

                case ConnectorPosition.BottomCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x - 8) + "," + (endPoint.y + 10) + " " +
                        endPoint.x + "," + (endPoint.y + 20) + " " +
                        (endPoint.x + 8) + "," + (endPoint.y + 10)
                    svg.polygon(polygonDescription)
                    if (endPoint.x == startPoint.x) {
                        svg.line(endPoint.x, endPoint.y + 20, startPoint.x, startPoint.y)
                    } else {
                        middleY = (endPoint.y + 20 + ((startPoint.y - endPoint.y - 20)/2))
                        svg.line(endPoint.x, endPoint.y + 20, endPoint.x, middleY)
                        svg.line(endPoint.x, middleY, startPoint.x, middleY)
                        svg.line(startPoint.x, middleY, startPoint.x, startPoint.y)
                    }
                    break

                case ConnectorPosition.LeftCenter:
                    polygonDescription = "" + endPoint.x + "," + endPoint.y + " " +
                        (endPoint.x - 10) + "," + (endPoint.y - 8) + " " +
                        (endPoint.x - 20) + "," + endPoint.y + " " +
                        (endPoint.x - 10) + "," + (endPoint.y + 8)
                    svg.polygon(polygonDescription)
                    if (endPoint.y == startPoint.y) {
                        svg.line(endPoint.x - 20, endPoint.y, startPoint.x, startPoint.y)
                    } else {
                        middleX = (endPoint.x - 20 - ((endPoint.x - 20 - startPoint.x)/2))
                        svg.line(endPoint.x - 20, endPoint.y, middleX, endPoint.y)
                        svg.line(middleX, endPoint.y, middleX, startPoint.y)
                        svg.line(middleX, startPoint.y, startPoint.x, startPoint.y)
                    }
                    break
            }
        }
