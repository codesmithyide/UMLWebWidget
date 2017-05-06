// Global namespace for CodeSmithy applications
var CodeSmithy = CodeSmithy || { }

// The namespace for the UMLWebWidget application
CodeSmithy.UMLWebWidget = { }

// The constructor for the Diagram object. This
// the entry point for all the functionality provided
// by the CodeSmithy UMLWebWidget.
// - interactive: true if the user can edit the diagram online,
//   false otherwise. Considered false if not provided.
function UMLDiagram(interactive) {
  if (interactive) {
    this.interactive = true
  } else {
    this.interactive = false
  }

  // The list of all UML class boxes present on the
  // diagram
  this.classboxes = { }

  // Create a diagram from a div element in the HTML document.
  // The div element must contain a JSON object with the UML
  // diagram information. The contents of the div will be replaced
  // by the diagram.
  // - divId: this is the id of the div element to use, it should be the id
  //   without any '#' prefix.
  this.createFromDiv = function(divId, layout) {
    var diagramDescription = JSON.parse($('#' + divId).text())
    $('#' + divId).empty()
    var svg = SVG(divId).size(400, 400)
    var style = { 
      "classbox": {
        "margin-left": 12,
        "margin-right": 12,
        "margin-top": 9,
        "margin-bottom": 9
      }
    }
    if (diagramDescription.classdiagram) {
      this.drawClassDiagram(svg, diagramDescription.classdiagram, style, layout)
    }
  }

  this.drawClassDiagram = function(svg, classDiagram, style, layout) {
    if (layout == null) {
      layout = { }
    }
    if (layout.positions == null) {
      layout.positions = { }
    }

    for (var i = 0; i < classDiagram.length; i++) {
      var item = classDiagram[i];
      if (item.class) {
        this.classboxes[item.class.name] = new ClassBox(svg, item.class, this.interactive, style.classbox, layout)
      } else if (item.relationship) {
        if (item.relationship.type == "inheritance") {
          drawInheritanceRelationship(svg, this.classboxes, item.relationship.baseclass, item.relationship.derivedclass)
        } else if (item.relationship.type == "composition") {
          drawCompositionRelationship(svg, this.classboxes, item.relationship.containingclass, item.relationship.containedclass)
        }
      }
    }
  }

}

function drawInheritanceRelationship(svg, classboxes, baseclass, derivedclass) {
  var g = svg.group().addClass("UMLInheritanceRelationship")
  var bbox1 = classboxes[baseclass].svg.bbox();
  var bbox2 = classboxes[derivedclass].svg.bbox();

  var t1 = "" + bbox1.cx + "," + (bbox1.y + bbox1.height) + " " +
    (bbox1.cx - 10) + "," + (bbox1.y + bbox1.height + 12) + " " +
    (bbox1.cx + 10) + "," + (bbox1.y + bbox1.height + 12)                
  g.polygon(t1)

  g.line(bbox1.cx, bbox1.y + bbox1.height + 12, bbox2.cx, bbox2.y)
}

function drawCompositionRelationship(svg, classboxes, containingclass, containedclass) {
  var g = svg.group().addClass("UMLCompositionRelationship")
  var bbox1 = classboxes[containingclass].svg.bbox();
  var bbox2 = classboxes[containedclass].svg.bbox();

  var t1 = "" + (bbox1.x + bbox1.width) + "," + bbox1.cy + " " +
    (bbox1.x + bbox1.width + 10) + "," + (bbox1.cy - 8) + " " +
    (bbox1.x + bbox1.width + 20) + "," + bbox1.cy + " " +
    (bbox1.x + bbox1.width + 10) + "," + (bbox1.cy + 8)
  g.polygon(t1)
              
  g.line(bbox1.x + bbox1.width + 20, bbox1.cy, bbox2.x, bbox2.cy)
}

function ClassBox(svg, classDescription, interactive, classboxStyle, layout) {

  this.createDef = function(defs, classInfo, interactive, style) {
    var self = this

    var classGroup = defs.group().addClass("UMLClass")
    
    if (interactive) {
      classGroup.click(function() {
        self.toggle(this)
      })
    }

    var classBoxWidth = 0
    var classBoxHeight = style["margin-top"]

    var classNameDef = defs.text(classInfo.name).addClass("UMLClassName").move(style["margin-left"], classBoxHeight)
    classBoxWidth = Math.max(classBoxWidth, classNameDef.bbox().width)
    classBoxHeight += (classNameDef.bbox().height + style["margin-bottom"])

    var line1YPos = classBoxHeight;
 
    classBoxHeight += style["margin-top"]

    var attributeDefs = []
    for (var i = 0; i < classInfo.attributes.length; i++) {
      var attrItem = classInfo.attributes[i]
      var attrText = CodeSmithy.UMLWebWidget.visibilityStringToSymbol(attrItem.visibility) + attrItem.name
      var attributeDef = defs.text(attrText).addClass("UMLAttribute").move(style["margin-left"], classBoxHeight)
      attributeDefs.push(attributeDef)
      classBoxWidth = Math.max(classBoxWidth, attributeDef.bbox().width)
      classBoxHeight += attributeDef.bbox().height;
    }

    classBoxHeight += style["margin-bottom"]

    var line2YPos = classBoxHeight;

    classBoxHeight += style["margin-top"]

    var operationDefs = []
    for (var i = 0; i < classInfo.operations.length; i++) {
      var opItem = classInfo.operations[i]
      var opText = visibilityStringToSymbol(opItem.visibility) + opItem.name
      var operationDef = defs.text(opText).addClass("UMLOperation").move(style["margin-left"], classBoxHeight)
      operationDefs.push(operationDef)
      classBoxWidth = Math.max(classBoxWidth, operationDef.bbox().width)
      classBoxHeight += operationDef.bbox().height;
    }

    // According to the UML standard the class name must be
    // centered so center it
    if (classBoxWidth > classNameDef.bbox().width) {
      classNameDef.dx((classBoxWidth - classNameDef.bbox().width)/2)
    }

    classBoxWidth += (style["margin-left"] + style["margin-right"])
    classBoxHeight += style["margin-bottom"]

    var unselectedClassBoxBorder = classGroup.rect(classBoxWidth, classBoxHeight).move(0,0)
    this.selectedClassBoxBorder = classGroup.group().hide()
    this.selectedClassBoxBorder.rect(10, 10).move(-5,-5)
    this.selectedClassBoxBorder.rect(10, 10).move((classBoxWidth/2) - 5, -5)
    this.selectedClassBoxBorder.rect(10, 10).move(classBoxWidth - 5, -5)
    this.selectedClassBoxBorder.rect(10, 10).move(classBoxWidth - 5, (classBoxHeight/2) - 5)
    this.selectedClassBoxBorder.rect(10, 10).move(classBoxWidth - 5, classBoxHeight - 5)
    this.selectedClassBoxBorder.rect(10, 10).move((classBoxWidth/2) - 5, classBoxHeight - 5)
    this.selectedClassBoxBorder.rect(10, 10).move(-5, classBoxHeight - 5)
    this.selectedClassBoxBorder.rect(10, 10).move(-5, (classBoxHeight/2) - 5)

    classGroup.use(classNameDef)
    classGroup.move(1,1)

    classGroup.line(0, line1YPos, classBoxWidth, line1YPos)

    for (var i = 0; i < attributeDefs.length; i++) {
      classGroup.use(attributeDefs[i])
    }

    classGroup.line(0, line2YPos, classBoxWidth, line2YPos)

    for (var i = 0; i < operationDefs.length; i++) {
      classGroup.use(operationDefs[i])
    }

    return classGroup
  }

  this.def = this.createDef(svg.defs(), classDescription, interactive, classboxStyle)
  if (layout.positions[classDescription.name]) {
    this.def.move(layout.positions[classDescription.name].x, layout.positions[classDescription.name].y)
  }

  this.svg = svg.use(this.def)

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

}

(function(ns) {
    ns.Diagram = UMLDiagram

    // Converts the visibility from the user string provided
    // in the input to the appropriate UML symbol for
    // visibility
    ns.visibilityStringToSymbol = function(visibility) {
        let stringToSymbolMap = {
            "public": "+ ",
            "protected": "# ",
            "private": "- "
        }
        return stringToSymbolMap[visibility]
    }

})(CodeSmithy.UMLWebWidget)
