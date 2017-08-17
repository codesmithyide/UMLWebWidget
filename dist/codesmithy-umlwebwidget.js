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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SVGLayerSet; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SVGLayer_js__ = __webpack_require__(0);




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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ClassBox; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DiagramElement_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SVGLayerSet_js__ = __webpack_require__(1);





/** 
  A class box. 

  @extends DiagramElement
*/
class ClassBox extends __WEBPACK_IMPORTED_MODULE_0__DiagramElement_js__["a" /* DiagramElement */] {

    constructor(svg, classDescription, canMove, style) {
        super(svg)
        this.shapeLayer = this.layers.createLayer("shape")
        this.textLayer = this.layers.createLayer("text")
        this.classDescription = classDescription

        this.def = createDef(this, svg.defs(), classDescription, canMove, style)

        this.svg = svg.use(this.def)

        // List of connectors that are connected to this class box
        this.connectors = [ ]
    }

    update() {
        this.outofdate = false
    }

    move(x, y) {
        this.def.move(x, y)
    }
        
    fire(evt) {
        if (evt == "positionchanged") {
            for (let i = 0; i < this.connectors.length; i++) {
                this.connectors[i].draw()        
            }
        }
    }

}

function createDef(self, defs, classInfo, canMove, style) {
    var classGroup = defs.group().addClass("UMLClass")

    let currentDimensions = { 
        width: 0,
        height: 0
    }

    let borderAdjustment = {
        top: 1,
        left: 1
    }
    
    currentDimensions.height = style.getTopMargin("classbox")

    var classNameDef = self.textLayer.text(classInfo.name).addClass("UMLClassName").move(borderAdjustment.left + style.getLeftMargin("classbox"), borderAdjustment.top + currentDimensions.height)
    currentDimensions.width = Math.max(currentDimensions.width, classNameDef.bbox().width)
    currentDimensions.height += (classNameDef.bbox().height + style.getBottomMargin("classbox"))

    var line1YPos = currentDimensions.height
    let attributeGroupDef = addCompartment(defs, currentDimensions, style, classInfo.attributes, "UMLAttribute").dmove(borderAdjustment.left, borderAdjustment.top)
 
    var line2YPos = currentDimensions.height
    let operationGroupDef = addCompartment(defs, currentDimensions, style, classInfo.operations, "UMLOperation").dmove(borderAdjustment.left, borderAdjustment.top)

    // According to the UML standard the class name must be
    // centered so center it
    if (currentDimensions.width > classNameDef.bbox().width) {
        classNameDef.dx((currentDimensions.width - classNameDef.bbox().width)/2)
    }

    currentDimensions.width += (style.getLeftMargin("classbox") + style.getRightMargin("classbox"))
    
    classGroup.rect(currentDimensions.width, currentDimensions.height).move(borderAdjustment.left, borderAdjustment.top)
    classGroup.line(borderAdjustment.left, borderAdjustment.top + line1YPos, borderAdjustment.left + currentDimensions.width, borderAdjustment.top + line1YPos)
    classGroup.use(attributeGroupDef)
    classGroup.line(borderAdjustment.left, borderAdjustment.top + line2YPos, borderAdjustment.left + currentDimensions.width, borderAdjustment.top + line2YPos)
    classGroup.use(operationGroupDef)

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
function addCompartment(svg, currentDimensions, style, items, cssClass) {
    currentDimensions.height += style.getTopMargin("classbox")
    let compartmentDef = createAttributeOrOperationGroupDef(svg, currentDimensions, items, cssClass)
    compartmentDef.dmove(style.getLeftMargin("classbox"), 0)            
    currentDimensions.height += style.getBottomMargin("classbox")
    return compartmentDef
}

// Creates a group with all the attributes or operations
function createAttributeOrOperationGroupDef(svg, currentDimensions, items, cssClass) {
    let itemGroupDef = svg.group()
    for (var i = 0; i < items.length; i++) {
        let itemDef = createAttributeOrOperationDef(itemGroupDef, items[i], cssClass)
        itemDef.move(0, currentDimensions.height)
        currentDimensions.width = Math.max(currentDimensions.width, itemDef.bbox().width)
        currentDimensions.height += itemDef.bbox().height
        }
    return itemGroupDef
}

// Creates a single attribute or operation line
function createAttributeOrOperationDef(svg, item, cssClass) {
    let text = visibilityStringToSymbol(item.visibility) + item.name
    if (item.return) {
        text += " : " + item.return
    }
    return svg.text(text).addClass(cssClass)
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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiagramElement; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SVGLayerSet_js__ = __webpack_require__(1);





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

    /**
      This function must be called after changes were
      made to update the contents of the SVG layers.

      @virtual
    */
    update() {
    }

}




/***/ }),
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class UMLWebWidgetError extends Error {    
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UMLWebWidgetError;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UMLWebWidgetError_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Settings_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Style_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__LayoutManager_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ClassBox_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Component_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Lifeline_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Node_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Actor_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__UseCase_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__Connector_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__AssemblyConnector_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__SynchronousMessageConnector_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ReturnMessageConnector_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__UseCaseAssociationConnector_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__SVGLayer_js__ = __webpack_require__(0);



















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

        if (this.diagramDescription.classdiagram) {
            this.drawClassDiagram(svg, this.diagramDescription.classdiagram, style, layout)
        } else if (this.diagramDescription.componentdiagram) {
            this.drawComponentDiagram(svg, this.diagramDescription.componentdiagram, style, layout)
        } else if (this.diagramDescription.deploymentdiagram) {
            this.drawDeploymentDiagram(svg, this.diagramDescription.deploymentdiagram, style, layout)
        } else if (this.diagramDescription.sequencediagram) {
            this.drawSequenceDiagram(svg, this.diagramDescription.sequencediagram, style.style, layout)
        } else if (this.diagramDescription.usecasediagram) {
            this.drawUseCaseDiagram(svg, this.diagramDescription.usecasediagram, layout)
        }
    }

    drawClassDiagram(svg, classDiagram, style, layout) {
        if (layout == null) {
            layout = { }
        }
        if (layout.classboxpositions == null) {
            layout.classboxpositions = { }
        }
        if (layout.connectorpositions == null) {
            layout.connectorpositions = { }
        }

        let layoutManager = new __WEBPACK_IMPORTED_MODULE_3__LayoutManager_js__["a" /* LayoutManager */](layout)

        for (var i = 0; i < classDiagram.length; i++) {
            let item = classDiagram[i]
            if (item.class) {
                let className = item.class.name
                let newClassBox = new __WEBPACK_IMPORTED_MODULE_4__ClassBox_js__["a" /* ClassBox */](svg, item.class, this.settings.canMove, style)
                this.classboxes[className] = newClassBox
                if (layout.classboxpositions[className]) {
                    newClassBox.move(layout.classboxpositions[className].x, layout.classboxpositions[className].y)
                }
                newClassBox.layers.getLayer("text").write()
            } else if (item.relationship) {
                let classbox1
                let classbox2
                if (item.relationship.type == "inheritance") {
                    classbox1 = this.classboxes[item.relationship.baseclass]
                    classbox2 = this.classboxes[item.relationship.derivedclass] 
                } else if ((item.relationship.type == "composition") || (item.relationship.type == "aggregation")) {
                    classbox1 = this.classboxes[item.relationship.containingclass]
                    classbox2 = this.classboxes[item.relationship.containedclass]
                }
                let newConnector = createClassBoxConnector(this, svg, item.relationship.type, classbox1, classbox2, layout)
                classbox1.connectors.push(newConnector)
                classbox2.connectors.push(newConnector)
                newConnector.draw()
            }
        }
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
        if (layout == null) {
            layout = { }
        }
        if (layout.lifelinepositions == null) {
            layout.lifelinepositions = { }
        }

        let nextYPosition = 0
        for (var i = 0; i < sequenceDiagram.length; i++) {
            let item = sequenceDiagram[i]
            if (item.lifeline) {
                this.lifelines[item.lifeline.name] = new __WEBPACK_IMPORTED_MODULE_6__Lifeline_js__["a" /* Lifeline */](svg, item.lifeline, style.lifeline, layout)
                nextYPosition = Math.max(nextYPosition, this.lifelines[item.lifeline.name].svg.bbox().y + this.lifelines[item.lifeline.name].svg.bbox().height + 20)
            } else if (item.messages) {
                for (var j = 0; j < item.messages.length; j++) {
                    let message = item.messages[j]
                    let lifeline1
                    let lifeline2
                    let newConnector
                    if (message.synchronousmessage) {
                        lifeline1 = this.lifelines[message.synchronousmessage.caller]
                        lifeline2 = this.lifelines[message.synchronousmessage.callee]
                        newConnector = createLifelineConnector(this, svg, "synchronousmessage", lifeline1, lifeline2, message.synchronousmessage.name)
                    } else if (message.returnmessage) {
                        lifeline1 = this.lifelines[message.returnmessage.caller]
                        lifeline2 = this.lifelines[message.returnmessage.callee]
                        newConnector = createLifelineConnector(this, svg, "returnmessage", lifeline1, lifeline2, "")
                    }
                    lifeline1.connectors.push(newConnector)
                    lifeline2.connectors.push(newConnector)
                    newConnector.draw()
                    newConnector.move(nextYPosition)
                    nextYPosition += newConnector.svg.bbox().height
                }
            }
        }

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


function createClassBoxConnector(self, svg, type, classbox1, classbox2, layout) {
    return new __WEBPACK_IMPORTED_MODULE_10__Connector_js__["a" /* Connector */](svg, type, classbox1, classbox2, "", layout)
}

function createLifelineConnector(self, svg, type, classbox1, classbox2, name, layout) {
    if (type == "returnmessage") {
        return new __WEBPACK_IMPORTED_MODULE_13__ReturnMessageConnector_js__["a" /* ReturnMessageConnector */](svg, classbox1, classbox2, name, layout)
    } else {
        return new __WEBPACK_IMPORTED_MODULE_12__SynchronousMessageConnector_js__["a" /* SynchronousMessageConnector */](svg, classbox1, classbox2, name, layout)
    }
}

function createUseCaseConnector(self, svg, actor, usecase) {
    return new __WEBPACK_IMPORTED_MODULE_14__UseCaseAssociationConnector_js__["a" /* UseCaseAssociationConnector */](svg, actor, usecase)
}


/***/ }),
/* 8 */
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
/* 9 */
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
/* 10 */
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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BallConnector_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SocketConnector_js__ = __webpack_require__(17);





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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class Connector {

    constructor(svg, type, classbox1, classbox2, text, layout) {
        this.type = type
        this.classbox1 = classbox1
        this.classbox2 = classbox2
        this.text = text
        this.layout = layout
        this.svg = svg.group()
        if (this.type == "inheritance") {
            this.svg.addClass("UMLInheritanceRelationship")
        } else if (this.type == "composition") {
            this.svg.addClass("UMLCompositionRelationship")
        } else if (this.type == "aggregation") {
            this.svg.addClass("UMLAggregationRelationship")
        }
    }

    draw() {
        this.svg.clear()
        if (this.type == "inheritance") {
            drawInheritanceRelationship(this.svg, this.classbox1, this.classbox2, this.layout)
        } else if ((this.type == "composition") || (this.type == "aggregation")) {
            drawCompositionOrAggregationRelationship(this.svg, this.classbox1, this.classbox2, this.layout)
        }
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Connector;


// Draws an inheritance connector between two classes
function drawInheritanceRelationship(svg, baseclassbox, derivedclassbox, layout) {
    let bbox1 = baseclassbox.svg.bbox()
    let bbox2 = derivedclassbox.svg.bbox()

    let connectionPositions = getConnectionPositions(bbox1, bbox2)
    let startPoint = getConnectionPoint(connectionPositions.start, bbox2)
    let endPoint = getConnectionPoint(connectionPositions.end, bbox1)

    let connectorOrientation = getConnectorHeadOrientationFromPosition(connectionPositions.end)
    let lineConnectionPoint = drawInheritanceArrow(svg, endPoint, connectorOrientation)
    drawConnectorLine(svg, startPoint, lineConnectionPoint, connectorOrientation)
}

// Draws a composition connector between two classes
function drawCompositionOrAggregationRelationship(svg, containingclassbox, containedclassbox, layout) {
    let bbox1 = containingclassbox.svg.bbox()
    let bbox2 = containedclassbox.svg.bbox()

    let connectionPositions = getConnectionPositions(bbox1, bbox2)

    let layoutOverride = layout.connectorpositions[containedclassbox.classDescription.name + "-" + containingclassbox.classDescription.name + "-aggregation"];
    if (layoutOverride) {
        if (layoutOverride.end) {
            if (layoutOverride.end == "RightCenter") {
                connectionPositions.end = ConnectorPosition.RightCenter
            }
        }
    }

    let startPoint = getConnectionPoint(connectionPositions.start, bbox2)
    let endPoint = getConnectionPoint(connectionPositions.end, bbox1)

    let connectorOrientation = getConnectorHeadOrientationFromPosition(connectionPositions.end)
    let lineConnectionPoint = drawDiamond(svg, endPoint, connectorOrientation)
    drawConnectorLine(svg, startPoint, lineConnectionPoint, connectorOrientation)  
}

var ConnectorPosition = {
    TopCenter: 0,
    TopRight: 1,
    RightCenter: 2,
    BottomRight: 3,
    BottomCenter: 4,
    BottomLeft: 5,
    LeftCenter: 6,
    TopLeft: 7
}

function getConnectionPositions(boundingbox1, boundingbox2) {
    let result = { 
        start: ConnectorPosition.TopCenter,
        end: ConnectorPosition.TopCenter
    }

    if ((boundingbox1.y + boundingbox1.height) < boundingbox2.y) {
        result.start = ConnectorPosition.TopCenter
        result.end = ConnectorPosition.BottomCenter
    } else if ((boundingbox2.y + boundingbox2.height) < boundingbox1.y) {
        result.start = ConnectorPosition.BottomCenter
        result.end = ConnectorPosition.TopCenter
    } else if ((boundingbox1.x + boundingbox1.width) < boundingbox2.x) {
        result.start = ConnectorPosition.LeftCenter
        result.end = ConnectorPosition.RightCenter
    } else if ((boundingbox2.x + boundingbox2.width) < boundingbox1.x) {
        result.start = ConnectorPosition.RightCenter
        result.end = ConnectorPosition.LeftCenter
    }

    return result
}

// Gets one of the predefined positions for connection
// points on a bounding box.
function getConnectionPoint(position, boundingbox) {
    let result = { x: 0, y: 0 }
    switch (position) {
        case ConnectorPosition.TopCenter:
            result.x = boundingbox.cx
            result.y = boundingbox.y
            break

        case ConnectorPosition.RightCenter:
            result.x = (boundingbox.x + boundingbox.width)
            result.y = boundingbox.cy
            break

        case ConnectorPosition.BottomCenter:
            result.x = boundingbox.cx
            result.y = (boundingbox.y + boundingbox.height)
            break

        case ConnectorPosition.LeftCenter:
            result.x = boundingbox.x
            result.y = boundingbox.cy
            break
    }
    return result
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
        case ConnectorPosition.TopCenter:
            return ConnectorHeadOrientation.Down
        case ConnectorPosition.RightCenter:
            return ConnectorHeadOrientation.Left
        case ConnectorPosition.BottomCenter:
            return ConnectorHeadOrientation.Up
        case ConnectorPosition.LeftCenter:
            return ConnectorHeadOrientation.Right
    }
}

// Draws an arrow for an inheritance relationship. The arrow's tip
// is at the position gives as argument.
// It returns the point to which the line of the connector should
// be connected.
function drawInheritanceArrow(svg, position, orientation) {
    let secondPoint = { x: 0, y: 0 }
    let thirdPoint = { x: 0, y: 0 }
    let lineConnectionPoint = { x: 0, y: 0 }
    switch (orientation) {
        case ConnectorHeadOrientation.Right:
            secondPoint = { x: (position.x - 12), y: (position.y - 10) }
            thirdPoint = { x: (position.x - 12), y: (position.y + 10) }
            lineConnectionPoint = { x: (position.x - 12), y: position.y }
            break

        case ConnectorHeadOrientation.Left:
            secondPoint.x = (position.x + 12)
            secondPoint.y = (position.y - 10)
            thirdPoint.x = (position.x + 12)
            thirdPoint.y = (position.y + 10)    
            lineConnectionPoint = { x: (position.x + 12), y: position.y }
            break
            
        case ConnectorHeadOrientation.Up:
            secondPoint.x = (position.x - 10)
            secondPoint.y = (position.y + 12)
            thirdPoint.x = (position.x + 10)
            thirdPoint.y = (position.y + 12)
            lineConnectionPoint = { x: position.x, y: (position.y + 12) }
            break

        case ConnectorHeadOrientation.Down:
            secondPoint.x = (position.x - 10)
            secondPoint.y = (position.y - 12)
            thirdPoint.x = (position.x + 10)
            thirdPoint.y = (position.y - 12)
            lineConnectionPoint = { x: position.x, y: (position.y - 12) }
            break
    }
            
    let polygonDescription = "" + position.x + "," + position.y + " " +
        secondPoint.x + "," + secondPoint.y + " " +
        thirdPoint.x + "," + thirdPoint.y                
    svg.polygon(polygonDescription)

    return lineConnectionPoint
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

        return thirdPoint
    }

function drawConnectorLine(svg, startPoint, endPoint, orientation) {
    switch (orientation) {
        case ConnectorHeadOrientation.Up:
        case ConnectorHeadOrientation.Down:
            if (endPoint.x == startPoint.x) {
                svg.line(endPoint.x, endPoint.y, startPoint.x, startPoint.y)
            } else {
                let middleY = (endPoint.y + ((startPoint.y - endPoint.y)/2))
                svg.line(endPoint.x, endPoint.y, endPoint.x, middleY)
                svg.line(endPoint.x, middleY, startPoint.x, middleY)
                svg.line(startPoint.x, middleY, startPoint.x, startPoint.y)
            }
            break

        case ConnectorHeadOrientation.Left:
        case ConnectorHeadOrientation.Right:
            if (endPoint.y == startPoint.y) {
                svg.line(endPoint.x, endPoint.y, startPoint.x, startPoint.y)
            } else {
                let middleX = (endPoint.x + ((startPoint.x - endPoint.x)/2))
                svg.line(endPoint.x, endPoint.y, middleX, endPoint.y)
                svg.line(middleX, endPoint.y, middleX, startPoint.y)
                svg.line(middleX, startPoint.y, startPoint.x, startPoint.y)
            }
            break
    }
}


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/** Sets the position of the elements on the diagram. */
class LayoutManager {

    constructor(layout) {
        this.layout = layout
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = LayoutManager;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/** A lifeline on a sequence diagram. */
class Lifeline {

    constructor(svg, lifelineDescription, lifelineStyle, layout) {
        this.lifelineDescription = lifelineDescription
        this.def = createDef(svg.defs(), lifelineDescription, lifelineStyle, layout)
        this.svg = svg.use(this.def)

        // List of connectors that are connected to this lifeline
        this.connectors = [ ]
    }

    drawLine(svg) {
        let firstConnectorY = 0
        if (this.connectors.length > 0) {
            firstConnectorY = this.connectors[0].svg.bbox().y
        }
        let lastConnectorY = 0
        if (this.connectors.length > 0) {
            lastConnectorY = this.connectors[this.connectors.length - 1].svg.bbox().y + this.connectors[this.connectors.length - 1].svg.bbox().height
        }
        let lineGroup = svg.group().addClass("UMLLifeline")
        lineGroup.line(this.svg.bbox().cx, this.svg.bbox().y + this.svg.bbox().height, this.svg.bbox().cx, firstConnectorY)
        lineGroup.rect(8, (lastConnectorY - firstConnectorY)).move(this.svg.bbox().cx - 4, firstConnectorY)
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Lifeline;


function createDef(defs, lifelineDescription, style, layout) {
    var lifelineGroup = defs.group().addClass("UMLLifeline")

    let currentDimensions = { 
        width: 0,
        height: 0
    }
    
    currentDimensions.height = style["margin-top"]

    var instanceNameDef = defs.text(":" + lifelineDescription.name).addClass("UMLInstanceName").move(style["margin-left"], currentDimensions.height)
    currentDimensions.width = Math.max(currentDimensions.width, instanceNameDef.bbox().width)
    currentDimensions.height += (instanceNameDef.bbox().height + style["margin-bottom"])

    currentDimensions.width += (style["margin-left"] + style["margin-right"])
    
    lifelineGroup.rect(currentDimensions.width, currentDimensions.height).move(0,0)
    lifelineGroup.use(instanceNameDef)

    // Offset by 1 to leave some space because the border stroke width is 2
    lifelineGroup.move(1,1)

    if (layout.lifelinepositions[lifelineDescription.name]) {
        lifelineGroup.move(layout.lifelinepositions[lifelineDescription.name].x, layout.lifelinepositions[lifelineDescription.name].y)
    }

    return lifelineGroup
}


/***/ }),
/* 15 */
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
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class ReturnMessageConnector {

    constructor(svg, classbox1, classbox2, text, layout) {
        this.classbox1 = classbox1
        this.classbox2 = classbox2
        this.text = text
        this.layout = layout
        this.svg = svg.group()
        this.svg.addClass("UMLReturnMessage")
    }

    draw() {
        this.svg.clear()
        let startX = this.classbox1.svg.bbox().cx
        let endX = this.classbox2.svg.bbox().cx

        this.svg.line(startX, 6, startX + 10, 0)
        this.svg.line(startX, 6, endX, 6).attr("stroke-dasharray", "4, 4")
        this.svg.line(startX, 6, startX + 10, 12)
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
/* harmony export (immutable) */ __webpack_exports__["a"] = ReturnMessageConnector;



/***/ }),
/* 17 */
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
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class SynchronousMessageConnector {

    constructor(svg, classbox1, classbox2, text, layout) {

        this.classbox1 = classbox1
        this.classbox2 = classbox2
        this.text = text
        this.layout = layout
        this.svg = svg.group()
        this.svg.addClass("UMLSynchronousMessage")
    }

    draw() {
        this.svg.clear()
        let caller = this.classbox1
        let callee = this.classbox2
        if (caller != callee) {
            let startX = caller.svg.bbox().cx
            let endX = callee.svg.bbox().cx
            let width = (endX - startX)

            let textDef = this.svg.defs().text(this.text)
            if (textDef.bbox().width < width) {
                textDef.move((startX + ((width - textDef.bbox().width) / 2)), 0)
            }

            let y = textDef.bbox().height + 2
            this.svg.line(startX, y, endX - 12, y)
            let polygonDescription = "" + (endX - 12) + "," + (y - 6) + " " +
                endX + "," + y + " " +
                (endX - 12) + "," + (y + 6)
            this.svg.polygon(polygonDescription)
            this.svg.use(textDef)
        } else {
            let startX = caller.svg.bbox().cx
            let textDef = this.svg.defs().text(this.text).move(startX + 8, 5)
            let offsetY = textDef.bbox().y + textDef.bbox().height + 3
            this.svg.use(textDef)
            this.svg.line(startX, offsetY, startX + 30, offsetY)
            this.svg.line(startX + 30, offsetY, startX + 30, 20 + offsetY)
            this.svg.line(startX + 30, 20 + offsetY, startX, 20 + offsetY)
            let polygonDescription = "" + startX + "," + (20 + offsetY) + " " +
                (startX + 12) + "," + (20 + offsetY - 6) + " " +
                (startX + 12) + "," + (20 + offsetY + 6)
            this.svg.polygon(polygonDescription)
        }
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
/* harmony export (immutable) */ __webpack_exports__["a"] = SynchronousMessageConnector;



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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UMLWebWidgetError_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Settings_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Style_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Diagram_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__DiagramElement_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ClassBox_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__SVGLayer_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__SVGLayerSet_js__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UMLWebWidgetError", function() { return __WEBPACK_IMPORTED_MODULE_0__UMLWebWidgetError_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Settings", function() { return __WEBPACK_IMPORTED_MODULE_1__Settings_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Style", function() { return __WEBPACK_IMPORTED_MODULE_2__Style_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Diagram", function() { return __WEBPACK_IMPORTED_MODULE_3__Diagram_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "DiagramElement", function() { return __WEBPACK_IMPORTED_MODULE_4__DiagramElement_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ClassBox", function() { return __WEBPACK_IMPORTED_MODULE_5__ClassBox_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SVGLayer", function() { return __WEBPACK_IMPORTED_MODULE_6__SVGLayer_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SVGLayerSet", function() { return __WEBPACK_IMPORTED_MODULE_7__SVGLayerSet_js__["a"]; });














/***/ })
/******/ ]);
});