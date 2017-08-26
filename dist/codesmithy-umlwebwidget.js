(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CodeSmithyUMLWebWidget"] = factory();
	else
		root["CodeSmithyUMLWebWidget"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiagramElement; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SVGLayerSet_js__ = __webpack_require__(4);




var position = Symbol()

/**
  An element of a diagram.

  @property {SVGLayerSet} this.layers - The various SVG layers
    to use to render this element.
  @property {boolean} this.uptodate - Whether the layers need 
    to be updated because of changes to the element.
*/
class DiagramElement {

    constructor(svg) {
        this.layers = new __WEBPACK_IMPORTED_MODULE_0__SVGLayerSet_js__["a" /* SVGLayerSet */](svg)
        this.uptodate = false
        this[position] = { x: 0, y: 0 }
    }

    /**
      Gets the layers of the element. This checks
      if any changes were made to the element and calls
      {@link DiagramElement#update} if necessary before
      returning the layers.
      @returns {SVGLayerSet} The SVG layers to use to draw the
        element.
    */
    getLayers() {
        if (!this.uptodate) {
            this.update()
        }
        return this.layers
    }

    get x() {
        return this[position].x
    }

    get y() {
        return this[position].y
    }

    move(x, y) {
        this.uptodate = false
        this[position].x = x
        this[position].y = y
    }

    /**
      Returns the rectangle on which connection points
      can be placed. Returns null if no connection points
      are allowed or where they can be placed can't be
      expressed as a rectangle.
    */
    getConnectionPointsRectangle() {
        if (!this.uptodate) {
            this.update()
        }
        return this.doGetConnectionPointsRectangle()
    }

    /**
      This function must be called after changes were
      made to update the contents of the SVG layers.

      @virtual
    */
    update() {
    }

    /**
       Implements the getConnectionPointsRectangle method.

      @virtual
    */
    doGetConnectionPointsRectangle() {
        return null
    }

}




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConnectionPointPosition; });


/**
  The position of a connection point. These
  are not the coordinates of the connection
  point but a description of where the 
  connection point should be relative to the
  element.
*/
class ConnectionPointPosition {

    constructor(type) {
        switch (type) {
            case "top-center":
                this.type = topCenter
                break

            case "top-right":
                this.type = topRight
                break

            case "right-center":
                this.type = rightCenter
                break

            case "bottom-right":
                this.type = bottomRight
                break

            case "bottom-center":
                this.type = bottomCenter
                break

            case "bottom-left":
                this.type = bottomLeft
                break

            case "left-center":
                this.type = leftCenter
                break

            case "top-left":
                this.type = topLeft
                break
        }
    }

    equals(other) {
        return (this.type === other.type)
    }

    static get TopCenter() {
        return staticTopCenter
    }

    static get TopRight() {
        return staticTopRight
    }

    static get RightCenter() {
        return staticRightCenter
    }

    static get BottomRight() {
        return staticBottomRight
    }

    static get BottomCenter() {
        return staticBottomCenter
    }

    static get BottomLeft() {
        return staticBottomLeft
    }

    static get LeftCenter() {
        return staticLeftCenter
    }

    static get TopLeft() {
        return staticTopLeft
    }
}

let topCenter = 0
let topRight = 1
let rightCenter = 2
let bottomRight = 3
let bottomCenter = 4
let bottomLeft = 5
let leftCenter = 6
let topLeft = 7

let staticTopCenter = new ConnectionPointPosition("top-center")
let staticTopRight = new ConnectionPointPosition("top-right")
let staticRightCenter = new ConnectionPointPosition("right-center")
let staticBottomRight = new ConnectionPointPosition("bottom-right")
let staticBottomCenter = new ConnectionPointPosition("bottom-center")
let staticBottomLeft = new ConnectionPointPosition("bottom-left")
let staticLeftCenter = new ConnectionPointPosition("left-center")
let staticTopLeft = new ConnectionPointPosition("top-left")




/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConnectionPoint; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DiagramElement_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__ = __webpack_require__(1);





/**
  <p>
    The point where an element and a connector meet.
  </p>

  <p>
    Although it derives from {@link DiagramElement} this
    element will probably be invisible to the user. 
    However it may be useful to make the connection points
    visible under some circumstances like for instance when
    the diagram is being edited.
  </p>

  @extends DiagramElement
  @property {DiagramElement} this.element - The element.
  @property {ConnectionPointPosition} this.position - The position
    of the connection point relative to the element.
*/
class ConnectionPoint extends __WEBPACK_IMPORTED_MODULE_0__DiagramElement_js__["a" /* DiagramElement */] {

    constructor(svg, element, position = __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].BottomCenter) {
        super(svg)
        this.element = element
        this.position = position
    }

    setPosition(position) {
        this.position = position

        let x = 0
        let y = 0
        let boundingbox = this.element.getConnectionPointsRectangle()

        switch (this.position) {
            case __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].TopCenter:
                x = boundingbox.cx
                y = boundingbox.y
                break

            case __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].RightCenter:
                x = (boundingbox.x + boundingbox.width)
                y = boundingbox.cy
                break

            case __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].BottomCenter:
                x = boundingbox.cx
                y = (boundingbox.y + boundingbox.height)
                break

            case __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].LeftCenter:
                x = boundingbox.x
                y = boundingbox.cy
                break
        }

        this.move(x, y)
    }

}




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SVGLayer; });


/**
  <p>
    The SVG specification has no concept of layers. The 
    order in which elements are added to the image 
    dictate which ones will be shown over the others.
    This is impractical so this class attempts to 
    provide a workaround.
  </p>

  <p>
    Drawing will be first done on several layers. The
    elements in each of the layers will then be added
    to the SVG document layer per layer.
  </p>   
*/
class SVGLayer {

    constructor(svg) {
        this.svg = svg
        this.defs = [ ]
    }

    group() {
        let groupDef = this.svg.defs().group()
        this.defs.push(groupDef)
        return groupDef
    }

    line(x1, y1, x2, y2) {
        let lineDef = this.svg.defs().line(x1, y1, x2, y2)
        this.defs.push(lineDef)
        return lineDef
    }

    rect(width, height) {
        let rectDef = this.svg.defs().rect(width, height)
        this.defs.push(rectDef)
        return rectDef
    }

    text(str) { 
        let textDef = this.svg.defs().text(str)
        this.defs.push(textDef)
        return textDef
    }

    write() {
        let self = this
        self.defs.forEach(function(def) {
            def.clone(self.svg)
            def.remove()
        })
    }

    merge(layer) {
        this.defs = this.defs.concat(layer.defs)
    }

}




/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SVGLayerSet; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SVGLayer_js__ = __webpack_require__(3);




/**
  <p>
    A set of layers.
  </p>
*/
class SVGLayerSet {

    constructor(svg) {
        this.svg = svg
        this.layers = { }
    }

    getLayer(name) {
        return this.layers[name]
    }

    createLayer(name) {
        let newLayer = new __WEBPACK_IMPORTED_MODULE_0__SVGLayer_js__["a" /* SVGLayer */](this.svg)
        this.layers[name] = newLayer
        return newLayer
    }

    /**
      Merge another set into this one. Layers
      with the same name will be merged together
      with the elements of the set given as argument
      being appended.
    */
    merge(layerSet) {
        let self = this
        let keys = Object.keys(self.layers)
        keys.forEach(function(key) {
            self.layers[key].merge(layerSet.layers[key])
        })
    }

}




/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClassBox; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DiagramElement_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SVGLayerSet_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ConnectionPoint_js__ = __webpack_require__(2);






/** 
  A class box. 

  @extends DiagramElement
  @property {ConnectionPoint[]} this.connectionPoints - The class
    keeps a list of connection points where other elements are 
    connected so they can be notified of relevant changes to the
    class box.
*/
class ClassBox extends __WEBPACK_IMPORTED_MODULE_0__DiagramElement_js__["a" /* DiagramElement */] {

    constructor(svg, id, classDescription, canMove, style) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.id = id
        this.classDescription = classDescription
        this.canMove = canMove
        this.style = style
        this.connectionPointsRectangle = null

        // List of connection points that are connected to
        // this class box
        this.connectionPoints = [ ]
    }

    /**
      Returns a connection point that can be used to connect
      a connector to this class box. The new connection
      point is added to this.connectionPoints.
    */
    createConnectionPoint(svg) {
        let newPoint = new __WEBPACK_IMPORTED_MODULE_2__ConnectionPoint_js__["a" /* ConnectionPoint */](svg, this)
        this.connectionPoints.push(newPoint)
        return newPoint
    }

    update() {
        createDef(this, this.classDescription, this.canMove, this.style)
        this.uptodate = true
    }

    doGetConnectionPointsRectangle() {
        return this.connectionPointsRectangle 
    }
        
    fire(evt) {
        if (evt == "positionchanged") {
            for (let i = 0; i < this.connectionPoints.length; i++) {
                this.connectionPoints[i].draw()        
            }
        }
    }

}

function createDef(self, classInfo, canMove, style) {
    var classGroup = self.shapeLayer.group().addClass("UMLClassBox")

    let currentDimensions = { 
        width: 0,
        height: 0
    }

    let borderAdjustment = {
        top: self.y + 1,
        left: self.x + 1
    }
    
    currentDimensions.height = style.getTopMargin("classbox")

    var classNameGroup = self.textLayer.group().addClass("UMLClassName")
    var className = classNameGroup.text(classInfo.name).move(borderAdjustment.left + style.getLeftMargin("classbox"), borderAdjustment.top + currentDimensions.height)
    currentDimensions.width = Math.max(currentDimensions.width, className.bbox().width)
    currentDimensions.height += (className.bbox().height + style.getBottomMargin("classbox"))

    var line1YPos = currentDimensions.height
    let attributeGroupDef = addCompartment(self.textLayer, currentDimensions, borderAdjustment, style, classInfo.attributes, "UMLClassAttributes")
 
    var line2YPos = currentDimensions.height
    let operationGroupDef = addCompartment(self.textLayer, currentDimensions, borderAdjustment, style, classInfo.operations, "UMLClassOperations")

    // According to the UML standard the class name must be
    // centered so center it
    if (currentDimensions.width > className.bbox().width) {
        className.dx((currentDimensions.width - className.bbox().width)/2)
    }

    currentDimensions.width += (style.getLeftMargin("classbox") + style.getRightMargin("classbox"))
    
    let rect = classGroup.rect(currentDimensions.width, currentDimensions.height).move(borderAdjustment.left, borderAdjustment.top)
    classGroup.line(borderAdjustment.left, borderAdjustment.top + line1YPos, borderAdjustment.left + currentDimensions.width, borderAdjustment.top + line1YPos)
    classGroup.line(borderAdjustment.left, borderAdjustment.top + line2YPos, borderAdjustment.left + currentDimensions.width, borderAdjustment.top + line2YPos)

    self.connectionPointsRectangle = rect.bbox()

    if (canMove) {
        classGroup.draggable(true)
        classGroup.on('dragmove.namespace', function(evt) {
            self.fire('positionchanged')
        })
        classGroup.on('dragend.namespace', function(evt) {
            self.fire('positionchanged')
        })
    }

    return classGroup
}

// Add an attribute or operation compartment and updates the current dimensions
// of the class box
function addCompartment(textLayer, currentDimensions, borderAdjustment, style, items, cssClass) {
    currentDimensions.height += style.getTopMargin("classbox")
    let compartmentDef = createAttributeOrOperationGroupDef(textLayer, currentDimensions, borderAdjustment.left + style.getLeftMargin("classbox"), borderAdjustment.top, items, cssClass)
    currentDimensions.height += style.getBottomMargin("classbox")
    return compartmentDef
}

// Creates a group with all the attributes or operations
function createAttributeOrOperationGroupDef(textLayer, currentDimensions, offsetX, offsetY, items, cssClass) {
    let itemGroupDef = textLayer.group().addClass(cssClass)
    for (var i = 0; i < items.length; i++) {
        let itemDef = createAttributeOrOperationDef(itemGroupDef, items[i])
        itemDef.move(offsetX, offsetY + currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, itemDef.bbox().width)
        currentDimensions.height += itemDef.bbox().height
        }
    return itemGroupDef
}

// Creates a single attribute or operation line
function createAttributeOrOperationDef(svg, item) {
    let text = visibilityStringToSymbol(item.visibility) + item.name
    if (item.return) {
        text += " : " + item.return
    }
    return svg.text(text)
}

// Converts the visibility from the user string provided
// in the input to the appropriate UML symbol for
// visibility
function visibilityStringToSymbol(visibility) {
    let stringToSymbolMap = {
        "public": "+ ",
        "protected": "# ",
        "private": "- "
    }
    return stringToSymbolMap[visibility]
}




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Connector; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DiagramElement_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__ = __webpack_require__(1);





/**
  Represents a connector between elements.

  @extends DiagramElement
*/
class Connector extends __WEBPACK_IMPORTED_MODULE_0__DiagramElement_js__["a" /* DiagramElement */] {

    constructor(svg, type, connectionPoint1, connectionPoint2, text) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.type = type
        this.connectionPoint1 = connectionPoint1
        this.connectionPoint2 = connectionPoint2
        this.text = text
    }

    update() {
        if (this.type == "inheritance") {
            let lineGroup = this.shapeLayer.group().addClass("UMLInheritanceRelationship")
            drawInheritanceRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == "composition") {
            let lineGroup = this.shapeLayer.group().addClass("UMLCompositionRelationship")
            drawCompositionOrAggregationRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == "aggregation") {
            let lineGroup = this.shapeLayer.group().addClass("UMLAggregationRelationship")
            drawCompositionOrAggregationRelationship(lineGroup, this.connectionPoint1, this.connectionPoint2)
        } else if (this.type == "synchronousmessage") {
            let lineGroup = this.shapeLayer.group().addClass("UMLSynchronousMessage")
            let textGroup = null
            if ((this.text != null) && (this.text != "")) {
                textGroup = this.textLayer.group()
            }
            drawSynchronousMessage(lineGroup, textGroup, this.connectionPoint1, this.connectionPoint2, this.text)
        } else if (this.type == "returnmessage") {
            let lineGroup = this.shapeLayer.group().addClass("UMLReturnMessage")
            drawReturnMessage(lineGroup, this.connectionPoint1, this.connectionPoint2)
        }
        this.uptodate = true
    }

}

// Draws an inheritance connector between two classes
function drawInheritanceRelationship(lineGroup, connectionPoint1, connectionPoint2) {
    let connectorOrientation = getConnectorHeadOrientationFromPosition(connectionPoint2.position)
    let lineConnectionPoint = getInheritanceArrowLineConnectionPoint(connectionPoint2, connectorOrientation)
    drawConnectorLine(lineGroup, connectionPoint1, lineConnectionPoint, connectorOrientation)
    drawInheritanceArrow(lineGroup, connectionPoint2, connectorOrientation)
}

// Draws a composition connector between two classes
function drawCompositionOrAggregationRelationship(lineGroup, connectionPoint1, connectionPoint2) {
    let connectorOrientation = getConnectorHeadOrientationFromPosition(connectionPoint2.position)
    let lineConnectionPoint = getDiamondLineConnectionPoint(connectionPoint2, connectorOrientation)
    drawConnectorLine(lineGroup, connectionPoint1, lineConnectionPoint, connectorOrientation)
    drawDiamond(lineGroup, connectionPoint2, connectorOrientation)
}

function drawSynchronousMessage(lineGroup, textGroup, connectionPoint1, connectionPoint2, text) {
    if (connectionPoint1.x != connectionPoint2.x) {
        if ((textGroup != null) && (text != null) && (text != "")) {
            let textElement = textGroup.text(text)
            
            let width = (connectionPoint2.x - connectionPoint1.x)
            if (textElement.bbox().width < width) {
                textElement.move((connectionPoint1.x + ((width - textElement.bbox().width) / 2)), connectionPoint1.y - textElement.bbox().height + 2)
            } else {
                textElement.move(connectionPoint1.x + 2, connectionPoint1.y - 6 - textElement.bbox().height + 2)
            }
        }

        lineGroup.line(connectionPoint1.x, connectionPoint1.y, connectionPoint2.x - 12, connectionPoint2.y)
        let polygonDescription = "" + (connectionPoint2.x - 12) + "," + (connectionPoint2.y - 6) + " " +
            connectionPoint2.x + "," + connectionPoint2.y + " " +
            (connectionPoint2.x - 12) + "," + (connectionPoint2.y + 6)
        lineGroup.polygon(polygonDescription)
    } else {
        if ((textGroup != null) && (text != null) && (text != "")) {
            let textElement = textGroup.text(text)
            textElement.move(connectionPoint1.x + 8, connectionPoint1.y - textElement.bbox().height - 3)
        }

        lineGroup.line(connectionPoint1.x, connectionPoint1.y, connectionPoint1.x + 30, connectionPoint1.y)
        lineGroup.line(connectionPoint1.x + 30, connectionPoint1.y, connectionPoint2.x + 30, connectionPoint2.y)
        lineGroup.line(connectionPoint2.x + 30, connectionPoint2.y, connectionPoint2.x + 12, connectionPoint2.y)
        let polygonDescription = "" + connectionPoint2.x + "," + connectionPoint2.y + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y - 6) + " " +
            (connectionPoint2.x + 12) + "," + (connectionPoint2.y + 6)
        lineGroup.polygon(polygonDescription)
    }
}

function drawReturnMessage(lineGroup, connectionPoint1, connectionPoint2) {
    let lineY = connectionPoint2.y + 6
    lineGroup.line(connectionPoint1.x, connectionPoint1.y + 6, connectionPoint2.x, lineY).attr("stroke-dasharray", "4, 4")
    lineGroup.line(connectionPoint2.x, lineY, connectionPoint2.x - 10, connectionPoint2.y)
    lineGroup.line(connectionPoint2.x, lineY, connectionPoint2.x - 10, connectionPoint2.y + 12)
}

// Orientation of the head (e.g. arrow or diamond)
// of a connector
var ConnectorHeadOrientation = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
}

// Get the orientiation of the head of the connector
// based on where the connector is connected
function getConnectorHeadOrientationFromPosition(position) {
    switch (position) {
        case __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].TopCenter:
            return ConnectorHeadOrientation.Down
        case __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].RightCenter:
            return ConnectorHeadOrientation.Left
        case __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].BottomCenter:
            return ConnectorHeadOrientation.Up
        case __WEBPACK_IMPORTED_MODULE_1__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].LeftCenter:
            return ConnectorHeadOrientation.Right
    }
}

function getInheritanceArrowLineConnectionPoint(position, orientation) {
    let lineConnectionPoint = { x: 0, y: 0 }
    switch (orientation) {
        case ConnectorHeadOrientation.Right:
            lineConnectionPoint = { x: (position.x - 12), y: position.y }
            break

        case ConnectorHeadOrientation.Left:
            lineConnectionPoint = { x: (position.x + 12), y: position.y }
            break
            
        case ConnectorHeadOrientation.Up:
            lineConnectionPoint = { x: position.x, y: (position.y + 12) }
            break

        case ConnectorHeadOrientation.Down:
            lineConnectionPoint = { x: position.x, y: (position.y - 12) }
            break
    }
            
    return lineConnectionPoint
}

// Draws an arrow for an inheritance relationship. The arrow's tip
// is at the position gives as argument.
// It returns the point to which the line of the connector should
// be connected.
function drawInheritanceArrow(svg, position, orientation) {
    let secondPoint = { x: 0, y: 0 }
    let thirdPoint = { x: 0, y: 0 }
    switch (orientation) {
        case ConnectorHeadOrientation.Right:
            secondPoint = { x: (position.x - 12), y: (position.y - 10) }
            thirdPoint = { x: (position.x - 12), y: (position.y + 10) }
            break

        case ConnectorHeadOrientation.Left:
            secondPoint.x = (position.x + 12)
            secondPoint.y = (position.y - 10)
            thirdPoint.x = (position.x + 12)
            thirdPoint.y = (position.y + 10)    
            break
            
        case ConnectorHeadOrientation.Up:
            secondPoint.x = (position.x - 10)
            secondPoint.y = (position.y + 12)
            thirdPoint.x = (position.x + 10)
            thirdPoint.y = (position.y + 12)
            break

        case ConnectorHeadOrientation.Down:
            secondPoint.x = (position.x - 10)
            secondPoint.y = (position.y - 12)
            thirdPoint.x = (position.x + 10)
            thirdPoint.y = (position.y - 12)
            break
    }
            
    let polygonDescription = "" + position.x + "," + position.y + " " +
        secondPoint.x + "," + secondPoint.y + " " +
        thirdPoint.x + "," + thirdPoint.y                
    svg.polygon(polygonDescription)
}

function getDiamondLineConnectionPoint(position, orientation) {
    let thirdPoint = { x: 0, y: 0 }
    switch (orientation) {
        case ConnectorHeadOrientation.Right:
            thirdPoint = { x: (position.x - 20), y: position.y }
            break

        case ConnectorHeadOrientation.Left:
            thirdPoint = { x: (position.x + 20), y: position.y }
            break

        case ConnectorHeadOrientation.Up:
            thirdPoint = { x: position.x, y: (position.y + 20) }
            break

        case ConnectorHeadOrientation.Down:
            thirdPoint = { x: position.x, y: (position.y - 20) }
            break
    }

    return thirdPoint
}

// Draws a diamond for an inheritance relationship. The arrow's tip
// is at the position gives as argument.
// It returns the point to which the line of the connector should
// be connected.
function drawDiamond(svg, position, orientation) {
    let secondPoint = { x: 0, y: 0 }
    let thirdPoint = { x: 0, y: 0 }
    let fourthPoint = { x: 0, y: 0 }
    switch (orientation) {
        case ConnectorHeadOrientation.Right:
            secondPoint = { x: (position.x - 10), y: (position.y - 8) }
            thirdPoint = { x: (position.x - 20), y: position.y }
            fourthPoint = { x: (position.x - 10), y: (position.y + 8) }
            break

        case ConnectorHeadOrientation.Left:
            secondPoint = { x: (position.x + 10), y: (position.y - 8) }
            thirdPoint = { x: (position.x + 20), y: position.y }
            fourthPoint = { x: (position.x + 10), y: (position.y + 8) }
            break

        case ConnectorHeadOrientation.Up:
            secondPoint = { x: (position.x + 8), y: (position.y + 10) }
            thirdPoint = { x: position.x, y: (position.y + 20) }
            fourthPoint = { x: (position.x - 8), y: (position.y + 10) }
            break

        case ConnectorHeadOrientation.Down:
            secondPoint = { x: (position.x + 8), y: (position.y - 10) }
            thirdPoint = { x: position.x, y: (position.y - 20) }
            fourthPoint = { x: (position.x - 8), y: (position.y - 10) }
            break
    }

    let polygonDescription = "" + position.x + "," + position.y + " " +
        secondPoint.x + "," + secondPoint.y + " " +
        thirdPoint.x + "," + thirdPoint.y + " " +
        fourthPoint.x + "," + fourthPoint.y
    svg.polygon(polygonDescription)
}

function drawConnectorLine(svg, startPoint, endPoint, orientation) {
    switch (orientation) {
        case ConnectorHeadOrientation.Up:
        case ConnectorHeadOrientation.Down:
            if (endPoint.x == startPoint.x) {
                svg.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
            } else {
                let middleY = (endPoint.y + ((startPoint.y - endPoint.y)/2))
                svg.line(startPoint.x, startPoint.y, startPoint.x, middleY)
                svg.line(startPoint.x, middleY, endPoint.x, middleY)
                svg.line(endPoint.x, middleY, endPoint.x, endPoint.y)                 
            }
            break

        case ConnectorHeadOrientation.Left:
        case ConnectorHeadOrientation.Right:
            if (endPoint.y == startPoint.y) {
                svg.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
            } else {
                let middleX = (endPoint.x + ((startPoint.x - endPoint.x)/2))
                svg.line(startPoint.x, startPoint.y, middleX, startPoint.y)
                svg.line(middleX, startPoint.y, middleX, endPoint.y)
                svg.line(middleX, endPoint.y, endPoint.x, endPoint.y)
            }
            break
    }
}




/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__ = __webpack_require__(1);




/** Sets the position of the elements on the diagram. */
class LayoutManager {

    constructor(layout) {
        this.layout = layout
        if (this.layout == null) {
            this.layout = { }
        }
        if (this.layout.classboxpositions == null) {
            this.layout.classboxpositions = { }
        }
        if (this.layout.lifelinepositions == null) {
            this.layout.lifelinepositions = { }
        }
        if (this.layout.connectorpositions == null) {
            this.layout.connectorpositions = { }
        }
    }

    setElementPosition(element) {
        if (this.layout.classboxpositions[element.id]) {
            element.move(this.layout.classboxpositions[element.id].x, this.layout.classboxpositions[element.id].y)
        } else if (this.layout.lifelinepositions[element.id]) {
            element.move(this.layout.lifelinepositions[element.id].x, this.layout.lifelinepositions[element.id].y)
        }
    }

    layoutMessages(lifelines, connectors) {
        let nextYPosition = 0
        for (var i = 0; i < lifelines.length; i++) {
            nextYPosition = Math.max(nextYPosition, lifelines[i].getLineTopPosition().x + 20)
        }
        for (var i = 0; i < connectors.length; i++) {
            let connector = connectors[i]
            connector.connectionPoint1.move(20, nextYPosition)
            connector.connectionPoint2.move(80, nextYPosition)
            nextYPosition += 30 //newConnector.svg.bbox().height
              
    /*     let startX = caller.svg.bbox().cx
        let endX = callee.svg.bbox().cx*/
        }
    }

    getConnectionPositions(boundingbox1, boundingbox2) {
        let result = { 
            start: __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].TopCenter,
            end: __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].TopCenter
        }

        if ((boundingbox2.y + boundingbox2.height) < boundingbox1.y) {
            result.start = __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].TopCenter
            result.end = __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].BottomCenter
        } else if ((boundingbox1.y + boundingbox1.height) < boundingbox2.y) {
            result.start = __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].BottomCenter
            result.end = __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].TopCenter
        } else if ((boundingbox2.x + boundingbox2.width) < boundingbox1.x) {
            result.start = __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].LeftCenter
            result.end = __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].RightCenter
        } else if ((boundingbox1.x + boundingbox1.width) < boundingbox2.x) {
            result.start = __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].RightCenter
            result.end = __WEBPACK_IMPORTED_MODULE_0__ConnectionPointPosition_js__["a" /* ConnectionPointPosition */].LeftCenter
        }

/*
    
    let layoutOverride = layout.connectorpositions[containedclassbox.classDescription.name + "-" + containingclassbox.classDescription.name + "-aggregation"];
    if (layoutOverride) {
        if (layoutOverride.end) {
            if (layoutOverride.end == "RightCenter") {
                connectionPositions.end = ConnectorPosition.RightCenter
            }
        }
    }
*/

        return result
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LayoutManager;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Lifeline; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DiagramElement_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ConnectionPoint_js__ = __webpack_require__(2);





/**
  A lifeline on a sequence diagram.

  @extends DiagramElement
*/
class Lifeline extends __WEBPACK_IMPORTED_MODULE_0__DiagramElement_js__["a" /* DiagramElement */] {

    constructor(svg, id, lifelineDescription, style) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.id = id
        this.lifelineDescription = lifelineDescription
        this.style = style
        
        // List of connection points that are connected to
        // this lifeline
        this.connectionPoints = [ ]
    }

    createConnectionPoint(svg) {
        let newPoint = new __WEBPACK_IMPORTED_MODULE_1__ConnectionPoint_js__["a" /* ConnectionPoint */](svg, this)
        this.connectionPoints.push(newPoint)
        return newPoint
    }

    getLineTopPosition() {
        return { x: 0, y: 0 }
    }

    update() {
        createDef(this, this.lifelineDescription, this.style)
        this.uptodate = true
    }

    drawLine(svg) {
      /*  let firstConnectorY = 0
        if (this.connectors.length > 0) {
            firstConnectorY = this.connectors[0].svg.bbox().y
        }
        let lastConnectorY = 0
        if (this.connectors.length > 0) {
            lastConnectorY = this.connectors[this.connectors.length - 1].svg.bbox().y + this.connectors[this.connectors.length - 1].svg.bbox().height
        }
        let lineGroup = svg.group().addClass("UMLLifeline")
        lineGroup.line(this.svg.bbox().cx, this.svg.bbox().y + this.svg.bbox().height, this.svg.bbox().cx, firstConnectorY)
        lineGroup.rect(8, (lastConnectorY - firstConnectorY)).move(this.svg.bbox().cx - 4, firstConnectorY)*/
    }

}

function createDef(self, lifelineDescription, style) {
    var lifelineGroup = self.shapeLayer.group().addClass("UMLLifeline")

    let currentDimensions = { 
        width: 0,
        height: 0
    }

    let borderAdjustment = {
        top: self.y + 1,
        left: self.x + 1
    }
    
    currentDimensions.height = style.getTopMargin("lifeline")

    var instanceNameGroup = self.textLayer.group().addClass("UMLInstanceName")
    var instanceNameDef = instanceNameGroup.text(":" + lifelineDescription.name).move(borderAdjustment.left + style.getLeftMargin("lifeline"), borderAdjustment.top + currentDimensions.height)
    currentDimensions.width = Math.max(currentDimensions.width, instanceNameDef.bbox().width)
    currentDimensions.height += (instanceNameDef.bbox().height + style.getBottomMargin("lifeline"))

    currentDimensions.width += (style.getLeftMargin("lifeline") + style.getRightMargin("lifeline"))
    
    lifelineGroup.rect(currentDimensions.width, currentDimensions.height).move(borderAdjustment.left, borderAdjustment.top)

/*
    if ((layout != null) && layout.lifelinepositions[lifelineDescription.name]) {
        lifelineGroup.move(layout.lifelinepositions[lifelineDescription.name].x, layout.lifelinepositions[lifelineDescription.name].y)
    }*/
}




/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Settings; });


/**
  Diagram settings.

  @property {int} width - The width of the diagram in pixels.
  @property {height} height - The height of the diagram in pixels.
  @property {boolean} debug - If debug is true then additional checks
    and logging will be performed. This is false by default so that
    diagrams are displayed as well as possible regardless
    of errors. It is recommended to enable debug mode when updating a
    diagram and set it back to false afterwards.
*/
class Settings {    

    /** 
      Creates a new Settings instance with each property
      having a default value or the value specified in 
      the jsonSettings argument.
      @param {json=} jsonSettings - The initial settings.
      @param {int} [jsonSettings.width=600] - The width of the diagram.
      @param {int} [jsonSettings.height=200] - The height of the diagram.
      @param {boolean} [jsonSettings.debug=false] - Debug mode.
    */
    constructor(jsonSettings) {
        this.width = 600
        this.height = 200
        this.canMove = false
        this.canResize = false
        this.debug = false

        if (jsonSettings) {
            if (jsonSettings.width) {
                this.width = jsonSettings.width
            }
            if (jsonSettings.height) {
                this.height = jsonSettings.height
            }
            if (jsonSettings.interactive) {
                if (jsonSettings.interactive.canMove) {
                    this.canMove = jsonSettings.interactive.canMove
                }
            }
        }
    }

}




/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/** Style settings. */
class Style {

    constructor() {
        this.style = {
            "defaults": {
                "margin-left": 12,
                "margin-right": 12,
                "margin-top": 9,
                "margin-bottom": 9
            },
            "lifeline": {
                "margin-left": 12,
                "margin-right": 12,
                "margin-top": 9,
                "margin-bottom": 9
            }
        }
    }

    getTopMargin(element) {
        return this.getValueOrDefault(this, element, "margin-top")
    }

    getBottomMargin(element) {
        return this.getValueOrDefault(this, element, "margin-bottom")
    }

    getLeftMargin(element) {
        return this.getValueOrDefault(this, element, "margin-left")
    }

    getRightMargin(element) {
        return this.getValueOrDefault(this, element, "margin-right")
    }

    getValueOrDefault(self, element, style) {
        if (self.style[element] && self.style[element][style]) {
            return self.style[element][style]
        } else {
            return self.style["defaults"][style]
        }
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Style;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class UMLWebWidgetError extends Error {    
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UMLWebWidgetError;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UMLWebWidgetError_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Settings_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Style_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__LayoutManager_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ClassBox_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Component_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Lifeline_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Node_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Actor_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__UseCase_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__Connector_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__AssemblyConnector_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__UseCaseAssociationConnector_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__SVGLayer_js__ = __webpack_require__(3);

















/**
  This class is the entry point for all the functionality provided
  by the CodeSmithy UMLWebWidget.
*/
class Diagram {

    constructor(settings) {
        this.settings = new __WEBPACK_IMPORTED_MODULE_1__Settings_js__["a" /* Settings */](settings)

        // The description of the UML diagram in JSON
        // format. This will then be parsed to create
        // the graphical form.
        this.diagramDescription = { }

        // The list of all UML class boxes present on the
        // diagram
        this.classboxes = { }

        // The list of all UML components present on the
        // diagram
        this.components = { }

        // The list of all UML lifelines present on the
        // diagram
        this.lifelines = { }

        // The list of all UML actors present on the
        // diagram
        this.actors = { }

        // The list of all UML use cases present on the
        // diagram
        this.usecases = { }
    }

    // Create a diagram from a div element in the HTML document.
    // The div element must contain a JSON object with the UML
    // diagram information. The contents of the div will be replaced
    // by the diagram.
    // - divId: this is the id of the div element to use, it should be the id
    //   without any '#' prefix.
    createFromDiv(divId, layout) {
        let jsonDiagramDescription = JSON.parse($('#' + divId).text())
        $('#' + divId).empty()
        var svg = SVG(divId).size(this.settings.width, this.settings.height)
        this.createFromJSON(svg, jsonDiagramDescription, layout)
    }

    createFromJSON(svg, jsonDiagramDescription, layout) {
        if (jsonDiagramDescription == null) {
            jsonDiagramDescription = { }
        }
        this.diagramDescription = jsonDiagramDescription
        let style = new __WEBPACK_IMPORTED_MODULE_2__Style_js__["a" /* Style */]()

        if (this.diagramDescription.elements) {
            this.drawClassDiagram(svg, this.diagramDescription.elements, style, layout)
        } else if (this.diagramDescription.componentdiagram) {
            this.drawComponentDiagram(svg, this.diagramDescription.componentdiagram, style, layout)
        } else if (this.diagramDescription.deploymentdiagram) {
            this.drawDeploymentDiagram(svg, this.diagramDescription.deploymentdiagram, style, layout)
        } else if (this.diagramDescription.sequencediagram) {
            this.drawSequenceDiagram(svg, this.diagramDescription.sequencediagram, style, layout)
        } else if (this.diagramDescription.usecasediagram) {
            this.drawUseCaseDiagram(svg, this.diagramDescription.usecasediagram, layout)
        }
    }

    drawClassDiagram(svg, classDiagram, style, layout) {
        let layoutManager = new __WEBPACK_IMPORTED_MODULE_3__LayoutManager_js__["a" /* LayoutManager */](layout)

        let classboxes = []
        let connectors = []

        // Construct the elements
        for (var i = 0; i < classDiagram.length; i++) {
            let item = classDiagram[i]
            if (item.class) {
                let className = item.class.name
                let newClassBox = new __WEBPACK_IMPORTED_MODULE_4__ClassBox_js__["a" /* ClassBox */](svg, className, item.class, this.settings.canMove, style)
                this.classboxes[className] = newClassBox
                classboxes.push(newClassBox)                
            } else if (item.relationship) {
                let classbox1
                let classbox2
                if (item.relationship.type == "inheritance") {
                    classbox1 = this.classboxes[item.relationship.derivedclass]
                    classbox2 = this.classboxes[item.relationship.baseclass] 
                } else if ((item.relationship.type == "composition") || (item.relationship.type == "aggregation")) {
                    classbox1 = this.classboxes[item.relationship.containedclass]
                    classbox2 = this.classboxes[item.relationship.containingclass]
                }
                let connectionPoint1 = classbox1.createConnectionPoint(svg)
                let connectionPoint2 = classbox2.createConnectionPoint(svg)
                let newConnector = new __WEBPACK_IMPORTED_MODULE_10__Connector_js__["a" /* Connector */](svg, item.relationship.type, connectionPoint1, connectionPoint2)
                connectors.push(newConnector)
            }
        }

        // Perform the layout
        for (var i = 0; i < classboxes.length; i++) {
            layoutManager.setElementPosition(classboxes[i])
        }
        for (var i = 0; i < connectors.length; i++) {
            let connectionPoint1 = connectors[i].connectionPoint1
            let connectionPoint2 = connectors[i].connectionPoint2
            let bbox1 = connectionPoint1.element.getConnectionPointsRectangle()
            let bbox2 = connectionPoint2.element.getConnectionPointsRectangle()
            let connectionPositions = layoutManager.getConnectionPositions(bbox1, bbox2)
            connectionPoint1.setPosition(connectionPositions.start)
            connectionPoint2.setPosition(connectionPositions.end)
        }

        draw(classboxes, null, connectors)
    }

    drawComponentDiagram(svg, componentDiagram, style, layout) {
        for (var i = 0; i < componentDiagram.length; i++) {
            let item = componentDiagram[i]
            if (item.component) {
                this.components[item.component.name] = new __WEBPACK_IMPORTED_MODULE_5__Component_js__["a" /* Component */](svg, item.component, style, layout)
            } else if (item.assemblyconnector) {
                let consumerComponent = this.components[item.assemblyconnector.consumer]
                let providerComponent = this.components[item.assemblyconnector.provider]
                let newConnector = new __WEBPACK_IMPORTED_MODULE_11__AssemblyConnector_js__["a" /* AssemblyConnector */](svg)
                newConnector.move(consumerComponent.getSocketConnectionPoint("").x, consumerComponent.getSocketConnectionPoint("").y, providerComponent.getBallConnectionPoint("").x, providerComponent.getBallConnectionPoint("").y)
                newConnector.draw()
            }
        } 
    }

    drawDeploymentDiagram(svg, deploymentDiagram, style, layout) {
        for (var i = 0; i < deploymentDiagram.length; i++) {
            let item = deploymentDiagram[i]
            if (item.node) {
                new __WEBPACK_IMPORTED_MODULE_7__Node_js__["a" /* Node */](svg, item.node, style, layout)
            }
        }
    }

    drawSequenceDiagram(svg, sequenceDiagram, style, layout) {
        let layoutManager = new __WEBPACK_IMPORTED_MODULE_3__LayoutManager_js__["a" /* LayoutManager */](layout)
      
        let lifelines = []
        let connectors = []

        // Construct the elements
        for (var i = 0; i < sequenceDiagram.length; i++) {
            let item = sequenceDiagram[i]
            if (item.lifeline) {
                let newLifeline = new __WEBPACK_IMPORTED_MODULE_6__Lifeline_js__["a" /* Lifeline */](svg, item.lifeline.name, item.lifeline, style)
                this.lifelines[item.lifeline.name] = newLifeline
                lifelines.push(newLifeline)
            } else if (item.messages) {
                for (var j = 0; j < item.messages.length; j++) {
                    let message = item.messages[j]
                    let lifeline1
                    let lifeline2
                    let connectionPoint1
                    let connectionPoint2
                    let newConnector
                    if (message.synchronousmessage) {
                        lifeline1 = this.lifelines[message.synchronousmessage.caller]
                        lifeline2 = this.lifelines[message.synchronousmessage.callee]
                        connectionPoint1 = lifeline1.createConnectionPoint(svg)
                        connectionPoint2 = lifeline2.createConnectionPoint(svg)
                        newConnector = new __WEBPACK_IMPORTED_MODULE_10__Connector_js__["a" /* Connector */](svg, "synchronousmessage", connectionPoint1, connectionPoint2, message.synchronousmessage.name)
                    } else if (message.returnmessage) {
                        lifeline1 = this.lifelines[message.returnmessage.caller]
                        lifeline2 = this.lifelines[message.returnmessage.callee]
                        connectionPoint1 = lifeline1.createConnectionPoint(svg)
                        connectionPoint2 = lifeline2.createConnectionPoint(svg)
                        newConnector = new __WEBPACK_IMPORTED_MODULE_10__Connector_js__["a" /* Connector */](svg, "returnmessage", connectionPoint1, connectionPoint2, "")
                    }
                    lifeline1.connectionPoints.push(connectionPoint1)
                    lifeline2.connectionPoints.push(connectionPoint2)
                    connectors.push(newConnector)
                }
            }
        }

        // Perform the layout
        for (var i = 0; i < lifelines.length; i++) {
            layoutManager.setElementPosition(lifelines[i])
        }

        layoutManager.layoutMessages(lifelines, connectors)

        draw(null, lifelines, connectors)

        for (var key in this.lifelines) {
            this.lifelines[key].drawLine(svg)
        }
    }

    drawUseCaseDiagram(svg, useCaseDiagram, layout) {
        for (var i = 0; i < useCaseDiagram.length; i++) {
            let item = useCaseDiagram[i]
            if (item.actor) {
                this.actors[item.actor.name] = new __WEBPACK_IMPORTED_MODULE_8__Actor_js__["a" /* Actor */](svg, item.actor, layout)
            } else if (item.usecase) {
                this.usecases[item.usecase.title] = new __WEBPACK_IMPORTED_MODULE_9__UseCase_js__["a" /* UseCase */](svg, item.usecase, layout)
            } else if (item.association) {
                createUseCaseConnector(this, svg, this.actors[item.association.actor], this.usecases[item.association.usecase]).draw()
            }
        }
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Diagram;


function draw(classboxes, lifelines, connectors) {
    if (classboxes != null) {
        for (var i = 0; i < classboxes.length; i++) {
            let classbox = classboxes[i]
            classbox.getLayers().getLayer("shape").write()
            classbox.getLayers().getLayer("text").write()
        }
    }
    if (lifelines != null) {
        for (var i = 0; i < lifelines.length; i++) {
            let lifeline = lifelines[i]
            lifeline.getLayers().getLayer("shape").write()
            lifeline.getLayers().getLayer("text").write()
        }
    }
    for (var i = 0; i < connectors.length; i++) {
        let connector = connectors[i]
        connector.getLayers().getLayer("shape").write()
        connector.getLayers().getLayer("text").write()
    }
}

function createUseCaseConnector(self, svg, actor, usecase) {
    return new __WEBPACK_IMPORTED_MODULE_12__UseCaseAssociationConnector_js__["a" /* UseCaseAssociationConnector */](svg, actor, usecase)
}


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class Actor {

    constructor(svg, actorDescription, layout) {
        this.actorDescription = actorDescription
        this.def = svg.group().addClass("UMLActor")
        this.draw(this.def, this.actorDescription)
        this.svg = svg.use(this.def)
    }

    draw(svg, actorDescription) {
        let textDef = svg.text(actorDescription.name).move(0, 35)
        let width = textDef.bbox().width
        let offset = ((width - 16) / 2)
        svg.circle(12).move(2 + offset, 1)
        svg.line(8 + offset, 13, 8 + offset, 26)
        svg.line(offset, 18, 16 + offset, 18)
        svg.line(8 + offset, 26, offset, 33)
        svg.line(8 + offset, 26, 16 + offset, 33)

        if (layout.actorpositions[actorDescription.name]) {
            svg.move(layout.actorpositions[actorDescription.name].x, layout.actorpositions[actorDescription.name].y)
        }

        svg.use(textDef)     
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Actor;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class AssemblyConnector {

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
/* harmony export (immutable) */ __webpack_exports__["a"] = AssemblyConnector;



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


var textDef = Symbol()

class BallConnector {

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
/* harmony export (immutable) */ __webpack_exports__["a"] = BallConnector;



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BallConnector_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SocketConnector_js__ = __webpack_require__(18);





class Stereotype {

    constructor(svgParentGroup) {
        this.svgParentGroup = svgParentGroup
        this.x = 0
        this.y = 0
        this.width = 15
        this.height = 20
    }

    move(x, y) {
        this.x = x
        this.y = y
    }

    draw() {
        let stereoTypeGroup = this.svgParentGroup.group().addClass("UMLComponentStereotype")
        stereoTypeGroup.rect(11, 15).move(4 + this.x, this.y)
        stereoTypeGroup.rect(8, 3).move(this.x, this.y + 3)
        stereoTypeGroup.rect(8, 3).move(this.x, this.y + 9)
    }

}

class Component {

    constructor(svg, componentDescription, style, layout) {
        this.componentDescription = componentDescription
        this.ballConnectors = [ ]
        this.socketConnectors = [ ]

        var componentWithConnectorsGroup = svg.group().addClass("UMLComponent")

        let offset = 0
        if (componentDescription.interfaces) {
            for (let i = 0; i < componentDescription.interfaces.length; i++) {
                let ballConnector = new __WEBPACK_IMPORTED_MODULE_0__BallConnector_js__["a" /* BallConnector */](svg.defs(), componentWithConnectorsGroup, componentDescription.interfaces[i].name)
                this.ballConnectors.push(ballConnector)
                offset = Math.max(offset, ballConnector.width)
            }
        }
        if (componentDescription.dependencies) {
            for (let i = 0; i < componentDescription.dependencies.length; i++) {
                let socketConnector = new __WEBPACK_IMPORTED_MODULE_1__SocketConnector_js__["a" /* SocketConnector */](svg.defs(), componentWithConnectorsGroup, componentDescription.dependencies[i].name)
                this.socketConnectors.push(socketConnector)
            }
        }

        var componentGroup = componentWithConnectorsGroup.group()

        let position = {
            x: 0,
            y: 0
        }

        if (layout.componentpositions[componentDescription.name]) {
            position = layout.componentpositions[componentDescription.name]
        }

        let currentDimensions = {
            width: 0,
            height: 0
        }

        currentDimensions.height = style.getTopMargin("component")

        let stereotype = new Stereotype(componentGroup)
        currentDimensions.height += stereotype.height

        var componentNameDef = componentGroup.defs().text(componentDescription.name).addClass("UMLComponentName").move(position.x + offset + style.getLeftMargin("component"), position.y + currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, componentNameDef.bbox().width)
        currentDimensions.height += (componentNameDef.bbox().height + style.getBottomMargin("component"))

        currentDimensions.width += (style.getLeftMargin("component") + style.getRightMargin("component"))
    
        componentGroup.rect(currentDimensions.width, currentDimensions.height).move(position.x + offset, position.y)
        stereotype.move(position.x + offset + (currentDimensions.width - style.getRightMargin("component") - stereotype.width), position.y + style.getTopMargin("component"))
        stereotype.draw()
        componentGroup.use(componentNameDef)

        // Offset by 1 to leave some space because the border stroke width is 2
        componentGroup.move(1, 1)

        for (let i = 0; i < this.ballConnectors.length; i++) {
            this.ballConnectors[i].moveConnectionPoint(position.x, position.y + currentDimensions.height/2)
            this.ballConnectors[i].draw()
        }

        for (let i = 0; i < this.socketConnectors.length; i++) {
            this.socketConnectors[i].moveConnectionPoint(position.x + currentDimensions.width + offset, position.y + currentDimensions.height/2)
            this.socketConnectors[i].draw()
        }
    }

    getBallConnectionPoint(name) {
        for (let i = 0; i < this.ballConnectors.length; i++) {
            return this.ballConnectors[i].getAssemblyConnectionPoint()
        }
    }

    getSocketConnectionPoint(name) {
        for (let i = 0; i < this.socketConnectors.length; i++) {
            return this.socketConnectors[i].getAssemblyConnectionPoint()
        }
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Component;



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class Node {

    constructor(svg, nodeDescription, style, layout) {
        this.nodeDescription = nodeDescription
        
        var nodeGroup = svg.group().addClass("UMLNode")
    
        let currentDimensions = { 
            width: 0,
            height: 0
        }
    
        currentDimensions.height = style.getTopMargin("node")

        var nodeNameDef = svg.defs().text(nodeDescription.name).addClass("UMLNodeName").move(style.getLeftMargin("node"), currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, nodeNameDef.bbox().width)
        currentDimensions.height += (nodeNameDef.bbox().height + style.getBottomMargin("node"))

        if (currentDimensions.width > nodeNameDef.bbox().width) {
            nodeNameDef.dx((currentDimensions.width - nodeNameDef.bbox().width)/2)
        }

        currentDimensions.width += (style.getLeftMargin("node") + style.getRightMargin("node"))
    
        nodeGroup.rect(currentDimensions.width, currentDimensions.height).move(0,0)
        nodeGroup.use(nodeNameDef)

        // Offset by 1 to leave some space because the border stroke width is 2
        nodeGroup.move(1,1)

        if (layout.nodes[nodeDescription.name]) {
            let position = layout.nodes[nodeDescription.name].position
            nodeGroup.move(position.x, position.y)
        }
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Node;



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


var textDef = Symbol()

class SocketConnector {

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
/* harmony export (immutable) */ __webpack_exports__["a"] = SocketConnector;



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class UseCase {

    constructor(svg, useCaseDescription, layout) {
        this.def = svg.group().addClass("UMLUseCase")
        let textDef = this.def.defs().text(useCaseDescription.title).move(0, 0)
        this.def.ellipse(1.2*textDef.bbox().width, 3*textDef.bbox().height)
        this.def.use(textDef).move(0.1*textDef.bbox().width, textDef.bbox().height)
        if (layout.usecasepositions[useCaseDescription.title]) {
            this.def.move(layout.usecasepositions[useCaseDescription.title].x, layout.usecasepositions[useCaseDescription.title].y)
        }
        this.svg = svg.use(this.def)
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = UseCase;



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class UseCaseAssociationConnector {

    constructor(svg, classbox1, classbox2, text, layout) {
        this.classbox1 = classbox1
        this.classbox2 = classbox2
        this.text = text
        this.layout = layout
        this.svg = svg.group()
        this.svg.addClass("UMLUseCaseAssociation")
    }

    draw() {
        this.svg.clear()
        this.svg.line(this.classbox1.svg.bbox().x + this.classbox1.svg.bbox().width, this.classbox1.svg.bbox().cy, this.classbox2.svg.bbox().x, this.classbox2.svg.bbox().cy)
    }
      
    move(y) {
        this.svg.each(function(i, children) {
            this.dy(y)
        })
    }

    hide() {
        this.svg.hide()
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = UseCaseAssociationConnector;



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UMLWebWidgetError_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Settings_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Style_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Diagram_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ConnectionPoint_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ConnectionPointPosition_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__DiagramElement_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Connector_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__LayoutManager_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ClassBox_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__Lifeline_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__SVGLayer_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__SVGLayerSet_js__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UMLWebWidgetError", function() { return __WEBPACK_IMPORTED_MODULE_0__UMLWebWidgetError_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Settings", function() { return __WEBPACK_IMPORTED_MODULE_1__Settings_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Style", function() { return __WEBPACK_IMPORTED_MODULE_2__Style_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Diagram", function() { return __WEBPACK_IMPORTED_MODULE_3__Diagram_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "DiagramElement", function() { return __WEBPACK_IMPORTED_MODULE_6__DiagramElement_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Connector", function() { return __WEBPACK_IMPORTED_MODULE_7__Connector_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionPoint", function() { return __WEBPACK_IMPORTED_MODULE_4__ConnectionPoint_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionPointPosition", function() { return __WEBPACK_IMPORTED_MODULE_5__ConnectionPointPosition_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutManager", function() { return __WEBPACK_IMPORTED_MODULE_8__LayoutManager_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ClassBox", function() { return __WEBPACK_IMPORTED_MODULE_9__ClassBox_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Lifeline", function() { return __WEBPACK_IMPORTED_MODULE_10__Lifeline_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SVGLayer", function() { return __WEBPACK_IMPORTED_MODULE_11__SVGLayer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SVGLayerSet", function() { return __WEBPACK_IMPORTED_MODULE_12__SVGLayerSet_js__["a"]; });



















/***/ })
/******/ ]);
});