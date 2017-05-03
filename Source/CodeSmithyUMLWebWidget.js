function addClassDef(defs, classInfo, style) {
  var classGroup = defs.group().addClass("UMLClass")

  var classBoxWidth = 0
  var classBoxHeight = style["margin-top"]

  var classNameDef = defs.text(classInfo.name).move(style["margin-left"], classBoxHeight)
  classBoxWidth = Math.max(classBoxWidth, classNameDef.bbox().width)
  classBoxHeight += (classNameDef.bbox().height + style["margin-bottom"])

  var line1YPos = classBoxHeight;
 
  classBoxHeight += style["margin-top"]

  var attributeDefs = []
  for (var i = 0; i < classInfo.attributes.length; i++) {
    var attrItem = classInfo.attributes[i]
    var attrText = visibilityStringToSymbol(attrItem.visibility) + attrItem.name
    var attributeDef = defs.text(attrText).move(style["margin-left"], classBoxHeight)
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
    var operationDef = defs.text(opText).move(style["margin-left"], classBoxHeight)
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

  var classBoxRect = classGroup.rect(classBoxWidth, classBoxHeight).move(0,0)

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

// Converts the visibility from the user string provided
// in the input to the appropriate UML symbol for
// visibility
function visibilityStringToSymbol(visibility) {
  var symbol = ""
  if (visibility == "public") {
    symbol = "+ "
  } else if (visibility == "protected") {
    symbol = "# "
  } else if (visibility == "private") {
    symbol = "- "
  }
  return symbol
}
