
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
