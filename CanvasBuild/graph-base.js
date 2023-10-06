'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.GraphBase = exports.mx = void 0
const glyphInfo_js_1 = require('./glyphInfo.js')
const interactionInfo_js_1 = require('./interactionInfo.js')
const canvasAnnotation_js_1 = require('./canvasAnnotation.js')
const environment_js_1 = require('./environment.js')
const moduleInfo_js_1 = require('./moduleInfo.js')
const combinatorialInfo_js_1 = require('./combinatorialInfo.js')
const variableComponentInfo_js_1 = require('./variableComponentInfo.js')
const identifiedInfo_js_1 = require('./identifiedInfo.js')
const CustomShapes_js_1 = require('./CustomShapes.js')
exports.mx = require('mxgraph')({
  mxImageBasePath: 'mxgraph/images',
  mxBasePath: 'mxgraph',
})
/**
 * The base class that represents our mxGraph. Primarily contains initalizers, and core methods.
 */
class GraphBase {
  constructor(glyphService) {
    this.glyphService = glyphService
    // Boolean for keeping track of whether we are showing scars or not in the graph.
    this.showingScars = true
    // constructor code is divided into helper methods for organization,
    // but these methods aren't entirely modular; order of some of
    // these calls is important
    this.initDecodeEnv()
    this.initExtraCellMethods()
    this.initGroupingRules()
    this.graphContainer = document.createElement('div')
    this.graphContainer.id = 'graphContainer'
    this.graphContainer.style.margin = 'auto'
    this.graphContainer.style.background = 'url(assets/grid.png)'
    this.graphContainer.style.position = 'absolute'
    this.graphContainer.style.top = '0'
    this.graphContainer.style.bottom = '0'
    this.graphContainer.style.left = '0'
    this.graphContainer.style.right = '0'
    this.graphContainer.style.overflow = 'hidden'
    // mxEditor is kind of a parent to mxGraph
    // it's used mainly for 'actions', which for now means delete, later will mean undoing
    this.editor = new exports.mx.mxEditor()
    this.graph = this.editor.graph
    // edges shouldn't find the nearest common ancestor
    this.graph.getModel().maintainEdgeParent = false
    this.editor.setGraphContainer(this.graphContainer)
    this.graph.setCellsCloneable(false)
    this.graph.setConnectable(true)
    this.graph.setDisconnectOnMove(false)
    // Can't create edges without the glyph menu
    this.graph.connectionHandler.enabled = false
    // Edges are allowed to be detached
    this.graph.setAllowDanglingEdges(true)
    // slightly clearer selection highlighting
    exports.mx.mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2
    exports.mx.mxConstants.EDGE_SELECTION_STROKEWIDTH = 2
    // Enables click-and-drag selection
    new exports.mx.mxRubberband(this.graph)
    // This controls whether glyphs can be expanded without replacing the canvas
    this.graph.isCellFoldable = function (cell) {
      return false
      // to enable, use 'return cell.isSequenceFeatureGlyph();'
    }
    this.initStyles()
    this.initCustomShapes()
    this.initListeners()
    this.initEdgeValidation()
  }
  /**
   * Sets up environment variables to make decoding new graph models from xml into memory
   */
  initDecodeEnv() {
    // stuff needed for decoding
    window['mxGraphModel'] = exports.mx.mxGraphModel
    window['mxGeometry'] = exports.mx.mxGeometry
    window['mxPoint'] = exports.mx.mxPoint
    window['mxCell'] = exports.mx.mxCell
    let graphBaseRef = this // for use in overide methods where you need one of the helpers here
    let genericDecode = function (dec, node, into) {
      const meta = node
      if (meta != null) {
        for (let i = 0; i < meta.attributes.length; i++) {
          const attrib = meta.attributes[i]
          if (attrib.specified == true && attrib.name != 'as') {
            into[attrib.name] = attrib.value
          }
        }
        for (let i = 0; i < meta.children.length; i++) {
          const childNode = meta.children[i]
          into[childNode.getAttribute('as')] = dec.decode(childNode)
        }
      }
      return into
    }
    //mxGraph uses function.name which uglifyJS breaks on production
    // Glyph info decode/encode
    Object.defineProperty(glyphInfo_js_1.GlyphInfo, 'name', {
      configurable: true,
      value: 'GlyphInfo',
    })
    const glyphInfoCodec = new exports.mx.mxObjectCodec(new glyphInfo_js_1.GlyphInfo())
    glyphInfoCodec.decode = function (dec, node, into) {
      const glyphData = new glyphInfo_js_1.GlyphInfo()
      return genericDecode(dec, node, glyphData)
    }
    glyphInfoCodec.encode = function (enc, object) {
      return object.encode(enc)
    }
    exports.mx.mxCodecRegistry.register(glyphInfoCodec)
    window['GlyphInfo'] = glyphInfo_js_1.GlyphInfo
    // Module info encode/decode
    Object.defineProperty(moduleInfo_js_1.ModuleInfo, 'name', {
      configurable: true,
      value: 'ModuleInfo',
    })
    const moduleInfoCodec = new exports.mx.mxObjectCodec(new moduleInfo_js_1.ModuleInfo())
    moduleInfoCodec.decode = function (dec, node, into) {
      const moduleData = new moduleInfo_js_1.ModuleInfo()
      return genericDecode(dec, node, moduleData)
    }
    moduleInfoCodec.encode = function (enc, object) {
      return object.encode(enc)
    }
    exports.mx.mxCodecRegistry.register(moduleInfoCodec)
    window['ModuleInfo'] = moduleInfo_js_1.ModuleInfo
    // Interaction info encode/decode
    Object.defineProperty(interactionInfo_js_1.InteractionInfo, 'name', {
      configurable: true,
      value: 'InteractionInfo',
    })
    const interactionInfoCodec = new exports.mx.mxObjectCodec(
      new interactionInfo_js_1.InteractionInfo()
    )
    interactionInfoCodec.decode = function (dec, node, into) {
      const interactionData = new interactionInfo_js_1.InteractionInfo()
      return genericDecode(dec, node, interactionData)
    }
    interactionInfoCodec.encode = function (enc, object) {
      return object.encode(enc)
    }
    exports.mx.mxCodecRegistry.register(interactionInfoCodec)
    window['InteractionInfo'] = interactionInfo_js_1.InteractionInfo
    // combinatorial info decode
    Object.defineProperty(combinatorialInfo_js_1.CombinatorialInfo, 'name', {
      configurable: true,
      value: 'CombinatorialInfo',
    })
    const combinatorialInfoCodec = new exports.mx.mxObjectCodec(
      new combinatorialInfo_js_1.CombinatorialInfo()
    )
    combinatorialInfoCodec.decode = function (dec, node, into) {
      const combinatorialData = new combinatorialInfo_js_1.CombinatorialInfo()
      return genericDecode(dec, node, combinatorialData)
    }
    combinatorialInfoCodec.encode = function (enc, object) {
      return object.encode(enc)
    }
    exports.mx.mxCodecRegistry.register(combinatorialInfoCodec)
    window['CombinatorialInfo'] = combinatorialInfo_js_1.CombinatorialInfo
    // variable component info decode
    Object.defineProperty(variableComponentInfo_js_1.VariableComponentInfo, 'name', {
      configurable: true,
      value: 'VariableComponentInfo',
    })
    const variableComponentInfoCodec = new exports.mx.mxObjectCodec(
      new variableComponentInfo_js_1.VariableComponentInfo()
    )
    variableComponentInfoCodec.decode = function (dec, node, into) {
      const variableComponentData = new variableComponentInfo_js_1.VariableComponentInfo()
      return genericDecode(dec, node, variableComponentData)
    }
    exports.mx.mxCodecRegistry.register(variableComponentInfoCodec)
    window['VariableComponentInfo'] = variableComponentInfo_js_1.VariableComponentInfo
    Object.defineProperty(identifiedInfo_js_1.IdentifiedInfo, 'name', {
      configurable: true,
      value: 'IdentifiedInfo',
    })
    const identifiedInfoCodec = new exports.mx.mxObjectCodec(
      new identifiedInfo_js_1.IdentifiedInfo()
    )
    identifiedInfoCodec.decode = function (dec, node, into) {
      const identifiedData = new identifiedInfo_js_1.IdentifiedInfo()
      return genericDecode(dec, node, identifiedData)
    }
    exports.mx.mxCodecRegistry.register(identifiedInfoCodec)
    window['IdentifiedInfo'] = identifiedInfo_js_1.IdentifiedInfo
    // canvas annotation
    Object.defineProperty(canvasAnnotation_js_1.CanvasAnnotation, 'name', {
      configurable: true,
      value: 'CanvasAnnotation',
    })
    const canvasAnnotationCodec = new exports.mx.mxObjectCodec(
      new canvasAnnotation_js_1.CanvasAnnotation()
    )
    canvasAnnotationCodec.decode = function (dec, node, into) {
      const canvasAnnotation = new canvasAnnotation_js_1.CanvasAnnotation()
      return genericDecode(dec, node, canvasAnnotation)
    }
    canvasAnnotationCodec.encode = function (enc, object) {
      return object.encode(enc)
    }
    exports.mx.mxCodecRegistry.register(canvasAnnotationCodec)
    window['CanvasAnnotation'] = canvasAnnotation_js_1.CanvasAnnotation
    // For circuitContainers, the order of the children matters.
    // We want it to match the order of the children's geometries
    const defaultDecodeCell = exports.mx.mxCodec.prototype.decodeCell
    exports.mx.mxCodec.prototype.decodeCell = function (node, restoreStructures) {
      const cell = defaultDecodeCell.apply(this, arguments)
      // find cell 0 for the glyph dict
      let cell0 = cell
      while (cell0.getId() != '0') {
        cell0 = cell0.parent
      }
      let glyphDict = cell0.value[GraphBase.INFO_DICT_INDEX]
      let interactionDict = cell0.value[GraphBase.INTERACTION_DICT_INDEX]
      // check for format conditions
      if (
        ((cell.isCircuitContainer() && cell.getParent().isModuleView()) ||
          cell.isMolecularSpeciesGlyph() ||
          cell.isModule() ||
          cell.isInteractionNode()) &&
        cell.getGeometry().height == 0
      ) {
        GraphBase.unFormatedCells.add(cell.getParent().getId())
      }
      let reconstructCellStyle = false
      if (cell && cell.id > 1 && !cell.isViewCell()) {
        if (!cell.style || cell.style.length == 0) reconstructCellStyle = true
        else if (cell.getGeometry().height == 0) reconstructCellStyle = true
        else if (
          cell.style.includes(GraphBase.STYLE_SEQUENCE_FEATURE) &&
          !cell.style.includes(glyphDict[cell.value].partRole)
        )
          reconstructCellStyle = true
        else if (
          cell.style === GraphBase.STYLE_MOLECULAR_SPECIES ||
          cell.style.includes(GraphBase.STYLE_MOLECULAR_SPECIES + ';')
        )
          reconstructCellStyle = true
        else if (
          cell.style === GraphBase.STYLE_INTERACTION ||
          cell.style.includes(GraphBase.STYLE_INTERACTION + ';')
        )
          reconstructCellStyle = true
        else if (
          cell.style === GraphBase.STYLE_INTERACTION_NODE ||
          cell.style.includes(GraphBase.STYLE_INTERACTION_NODE + ';')
        )
          reconstructCellStyle = true
      }
      // reconstruct the cell style
      if (reconstructCellStyle) {
        if (glyphDict[cell.value] != null) {
          if (glyphDict[cell.value] instanceof moduleInfo_js_1.ModuleInfo) {
            // module
            if (!cell.style) {
              cell.style = GraphBase.STYLE_MODULE
            }
            cell.geometry.width = GraphBase.defaultModuleWidth
            cell.geometry.height = GraphBase.defaultModuleHeight
          } else if (
            glyphDict[cell.value] instanceof glyphInfo_js_1.GlyphInfo &&
            glyphDict[cell.value].partType === 'DNA region'
          ) {
            // sequence feature
            if (!cell.style) {
              cell.style = GraphBase.STYLE_SEQUENCE_FEATURE + glyphDict[cell.value].partRole
            } else {
              cell.style = cell.style.replace(
                GraphBase.STYLE_SEQUENCE_FEATURE,
                GraphBase.STYLE_SEQUENCE_FEATURE + glyphDict[cell.value].partRole
              )
            }
            if (cell.geometry.width == 0) cell.geometry.width = GraphBase.sequenceFeatureGlyphWidth
            if (cell.geometry.height == 0)
              cell.geometry.height = GraphBase.sequenceFeatureGlyphHeight
          } else if (glyphDict[cell.value] instanceof glyphInfo_js_1.GlyphInfo) {
            // molecular species
            if (!cell.style) cell.style = GraphBase.STYLE_MOLECULAR_SPECIES + 'macromolecule'
            else
              cell.style = cell.style.replace(
                GraphBase.STYLE_MOLECULAR_SPECIES,
                GraphBase.STYLE_MOLECULAR_SPECIES +
                  GraphBase.moleculeTypeToName(glyphDict[cell.value].partType)
              )
            cell.geometry.width = GraphBase.molecularSpeciesGlyphWidth
            cell.geometry.height = GraphBase.molecularSpeciesGlyphHeight
          }
        } else if (interactionDict[cell.value] != null) {
          let intInfo = interactionDict[cell.value]
          if (cell.isVertex()) {
            // interaction node
            let name = graphBaseRef.interactionNodeTypeToName(intInfo.interactionType)
            if (!cell.style) {
              cell.style = GraphBase.STYLE_INTERACTION_NODE + name
            } else {
              cell.style = cell.style.replace(
                GraphBase.STYLE_INTERACTION_NODE,
                GraphBase.STYLE_INTERACTION_NODE + name
              )
            }
            cell.geometry.width = GraphBase.interactionNodeGlyphWidth
            cell.geometry.height = GraphBase.interactionNodeGlyphHeight
          } else {
            // interaction
            let name = intInfo.interactionType
            if (
              name == 'Biochemical Reaction' ||
              name == 'Non-Covalent Binding' ||
              name == 'Genetic Production'
            ) {
              name = 'Process'
            }
            if (!cell.style) {
              cell.style = GraphBase.STYLE_INTERACTION + name
            } else {
              cell.style = cell.style.replace(
                GraphBase.STYLE_INTERACTION,
                GraphBase.STYLE_INTERACTION + name
              )
            }
          }
        }
      }
      if (cell && cell.isSequenceFeatureGlyph()) {
        cell.parent.children.sort(function (cellA, cellB) {
          return cellA.getGeometry().x - cellB.getGeometry().x
        })
      }
      return cell
    }
  }
  /**
   * Gives mxCells new methods related to our circuit/backbone rules
   */
  initExtraCellMethods() {
    exports.mx.mxCell.prototype.isStyle = function (styleName) {
      if (!this.style) return false
      return this.style.includes(styleName)
    }
    exports.mx.mxCell.prototype.isBackbone = function () {
      return this.isStyle(GraphBase.STYLE_BACKBONE)
    }
    exports.mx.mxCell.prototype.isMolecularSpeciesGlyph = function () {
      return this.isStyle(GraphBase.STYLE_MOLECULAR_SPECIES)
    }
    exports.mx.mxCell.prototype.isCircuitContainer = function () {
      return this.isStyle(GraphBase.STYLE_CIRCUIT_CONTAINER)
    }
    exports.mx.mxCell.prototype.isSequenceFeatureGlyph = function () {
      return this.isStyle(GraphBase.STYLE_SEQUENCE_FEATURE)
    }
    exports.mx.mxCell.prototype.isScar = function () {
      return this.isStyle(GraphBase.STYLE_SCAR)
    }
    exports.mx.mxCell.prototype.isInteractionNode = function () {
      return this.isStyle(GraphBase.STYLE_INTERACTION_NODE)
    }
    exports.mx.mxCell.prototype.isInteraction = function () {
      return this.isStyle(GraphBase.STYLE_INTERACTION)
    }
    exports.mx.mxCell.prototype.isModule = function () {
      return this.isStyle(GraphBase.STYLE_MODULE)
    }
    exports.mx.mxCell.prototype.isViewCell = function () {
      return (
        this.isStyle(GraphBase.STYLE_MODULE_VIEW) || this.isStyle(GraphBase.STYLE_COMPONENT_VIEW)
      )
    }
    exports.mx.mxCell.prototype.isModuleView = function () {
      return this.isStyle(GraphBase.STYLE_MODULE_VIEW)
    }
    exports.mx.mxCell.prototype.isComponentView = function () {
      return this.isStyle(GraphBase.STYLE_COMPONENT_VIEW)
    }
    /**
     * Returns the id of the cell's highest ancestor
     * (or the cell's own id if it has no parent)
     */
    exports.mx.mxCell.prototype.getRootId = function () {
      if (this.isSequenceFeatureGlyph()) {
        return this.parent.getId()
      } else {
        return this.getId()
      }
    }
    /**
     * Returns the backbone associated with this cell
     */
    exports.mx.mxCell.prototype.getBackbone = function () {
      if (this.isSequenceFeatureGlyph()) {
        return this.getCircuitContainer().getBackbone()
      } else if (this.isBackbone()) {
        return this
      } else if (!this.isCircuitContainer()) {
        return null
      }
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].isBackbone()) {
          return this.children[i]
        }
      }
      console.error('getBackbone(): No backbone found in circuit container!')
      return null
    }
    exports.mx.mxCell.prototype.getSequenceFeatureGlyph = function () {
      if (this.isSequenceFeatureGlyph()) {
        return this
      } else if (this.isBackbone()) {
        return this.getParent().getSequenceFeatureGlyph()
      } else if (this.isCircuitContainer()) {
        if (this.getParent().isSequenceFeatureGlyph()) {
          return this.getParent()
        } else {
          // top level circuitContainers have no containing sequenceFeatureGlyph
          return null
        }
      }
      return null
    }
    /**
     * Positions and sizes the backbone associated with this cell
     */
    exports.mx.mxCell.prototype.refreshBackbone = function (graph) {
      if (this.isBackbone()) {
        this.getCircuitContainer(graph).refreshBackbone(graph)
        return
      } else if (!this.isCircuitContainer()) {
        console.error('refreshBackbone: called on an invalid cell!')
        return
      }
      // NOTE: 'this' is the circuitContainer, not the backbone
      // (for easier access to the list of glyphs)
      // width:
      let width = 0
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].isSequenceFeatureGlyph()) {
          width += this.children[i].getGeometry().width
        }
      }
      if (width < GraphBase.sequenceFeatureGlyphWidth) {
        width = GraphBase.sequenceFeatureGlyphWidth
      }
      // Shape is a line, not rectangle, so any non-zero height is fine
      let height = 1
      this.getBackbone().replaceGeometry(
        'auto',
        GraphBase.sequenceFeatureGlyphHeight / 2,
        width,
        height,
        graph
      )
    }
    /**
     * (Re)positions the glyphs inside the circuitContainer and
     * also refreshes the backbone.
     */
    exports.mx.mxCell.prototype.refreshCircuitContainer = function (graph) {
      if (!this.isCircuitContainer()) {
        console.error('refreshCircuitContainer: called on an invalid cell!')
        return
      }
      // refresh backbone (width, height)
      this.refreshBackbone(graph)
      // verify own width, height
      this.replaceGeometry(
        'auto',
        'auto',
        this.getBackbone().getGeometry().width,
        GraphBase.sequenceFeatureGlyphHeight,
        graph
      )
      // put the backbone first in the children array so it is drawn before glyphs
      // (meaning it appears behind them)
      if (!this.children[0].isBackbone()) graph.getModel().add(this, this.getBackbone(), 0)
      // Layout all the glyphs in a horizontal line, while ignoring the backbone cell.
      const layout = new exports.mx.mxStackLayout(graph, true)
      layout.resizeParent = true
      layout.isVertexIgnored = function (vertex) {
        return vertex.isBackbone()
      }
      layout.execute(this)
    }
    exports.mx.mxCell.prototype.refreshViewCell = function (graph) {
      if (!this.isViewCell()) {
        console.error('refreshViewCell: called on an invalid cell!')
        return
      }
      // refresh all circuit containers
      if (this.children) {
        for (let child of this.children) {
          if (child.isCircuitContainer()) {
            child.refreshCircuitContainer(graph)
          }
        }
      }
    }
    /**
     * Returns the circuit container associated with this cell.
     */
    exports.mx.mxCell.prototype.getCircuitContainer = function (graph) {
      if (this.isSequenceFeatureGlyph()) {
        const children = graph.getModel().getCell(this.value).children
        for (let child of children) {
          if (child.isCircuitContainer()) {
            return child
          }
        }
      } else if (this.isCircuitContainer()) {
        return this
      } else if (this.isBackbone()) {
        return this.getParent()
      }
      return null
    }
    /**
     * Replaces this cell's geometry in an undo friendly way
     * 'graph' must be a reference to the graph
     *
     * For any other value, pass the string 'auto' to use the
     * previous geometry's value.
     *
     * It is not necessary to wrap this in (begin/end)Update() calls.
     */
    exports.mx.mxCell.prototype.replaceGeometry = function (x, y, width, height, graph) {
      const oldGeo = this.getGeometry()
      const newGeo = new exports.mx.mxGeometry(oldGeo.x, oldGeo.y, oldGeo.width, oldGeo.height)
      if (x !== 'auto') {
        newGeo.x = x
      }
      if (y !== 'auto') {
        newGeo.y = y
      }
      if (width !== 'auto') {
        newGeo.width = width
      }
      if (height !== 'auto') {
        newGeo.height = height
      }
      // to save entries on undo stack, don't call setGeometry unless necessary
      if (
        oldGeo.x === newGeo.x &&
        oldGeo.y === newGeo.y &&
        oldGeo.width === newGeo.width &&
        oldGeo.height === newGeo.height
      ) {
        return
      }
      graph.getModel().setGeometry(this, newGeo)
    }
  }
  /**
   * Sets up rules for circuits' grouping/selection behavior
   */
  initGroupingRules() {
    // Cells can be moved outside their parent's bounding box without being disowned
    exports.mx.mxGraphHandler.prototype.setRemoveCellsFromParent(false)
    exports.mx.mxGraph.prototype.setConstrainChildren(false)
    /**
     * Never act as though the backbone cell was clicked.
     * If it was, act like the circuitContainer was clicked instead.
     */
    const defaultGetInitialCellForEvent = exports.mx.mxGraphHandler.prototype.getInitialCellForEvent
    exports.mx.mxGraphHandler.prototype.getInitialCellForEvent = function (me) {
      let cell = defaultGetInitialCellForEvent.apply(this, arguments)
      if (cell.isBackbone()) {
        cell = cell.getCircuitContainer()
      }
      return cell
    }
    /**
     * For some reason, the above method doesn't work with alt-clicking.
     * This method covers that case.
     */
    const defaultSelectCellForEvent = exports.mx.mxGraph.prototype.selectCellForEvent
    exports.mx.mxGraph.prototype.selectCellForEvent = function (cell, evt) {
      if (cell.isBackbone()) cell = cell.getParent()
      defaultSelectCellForEvent.apply(this, [cell, evt])
    }
    /**
     * Some methods of selecting cells don't involve clicking directly
     * on the cell at all (for example rubberband selection).
     * This to guarantees the backbone can never be selected, no matter what.
     *
     * (The previous two methods are still necessary, or clicking on the
     * backbone would select nothing, instead of passing the click
     * event up to the circuitContainer.)
     */
    exports.mx.mxGraph.prototype.isCellSelectable = function (cell) {
      return !cell.isBackbone()
    }
  }
  /**
   * Sets up all the constant styles used by the graph.
   *
   * Can only be called before this.graph is initialized
   */
  initStyles() {
    // Main glyph settings. These are applied to sequence feature glyphs and molecular species glyphs
    this.baseMolecularSpeciesGlyphStyle = {}
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_FILLCOLOR] = '#ffffff'
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_STROKECOLOR] = '#000000'
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_NOLABEL] = false
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_VERTICAL_ALIGN] = 'top'
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_VERTICAL_LABEL_POSITION] =
      'bottom'
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_EDITABLE] = false
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_RESIZABLE] = 0
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_DIRECTION] = 'east'
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_STROKEWIDTH] = 2
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_FONTCOLOR] = '#000000'
    this.baseMolecularSpeciesGlyphStyle[exports.mx.mxConstants.STYLE_FONTSIZE] = 14
    //this.baseGlyphStyle[mx.mxConstants.DEFAULT_HOTSPOT] = 0;
    // Sequence features need almost the same styling as molecularSpecies
    this.baseSequenceFeatureGlyphStyle = exports.mx.mxUtils.clone(
      this.baseMolecularSpeciesGlyphStyle
    )
    this.baseSequenceFeatureGlyphStyle[exports.mx.mxConstants.STYLE_PORT_CONSTRAINT] = [
      exports.mx.mxConstants.DIRECTION_NORTH,
      exports.mx.mxConstants.DIRECTION_SOUTH,
    ]
    this.baseInteractionNodeGlyphStyle = exports.mx.mxUtils.clone(
      this.baseMolecularSpeciesGlyphStyle
    )
    const textBoxStyle = {}
    textBoxStyle[exports.mx.mxConstants.STYLE_SHAPE] = exports.mx.mxConstants.SHAPE_LABEL
    textBoxStyle[exports.mx.mxConstants.STYLE_FILLCOLOR] = '#ffffff'
    textBoxStyle[exports.mx.mxConstants.STYLE_STROKECOLOR] = '#000000'
    textBoxStyle[exports.mx.mxConstants.STYLE_FONTCOLOR] = '#000000'
    this.graph.getStylesheet().putCellStyle(GraphBase.STYLE_TEXTBOX, textBoxStyle)
    const moduleStyle = {}
    moduleStyle[exports.mx.mxConstants.STYLE_SHAPE] = exports.mx.mxConstants.SHAPE_RECTANGLE
    moduleStyle[exports.mx.mxConstants.STYLE_FILLCOLOR] = '#ffffff'
    moduleStyle[exports.mx.mxConstants.STYLE_STROKECOLOR] = '#000000'
    moduleStyle[exports.mx.mxConstants.STYLE_FONTCOLOR] = '#000000'
    moduleStyle[exports.mx.mxConstants.STYLE_EDITABLE] = false
    moduleStyle[exports.mx.mxConstants.STYLE_ROUNDED] = true
    this.graph.getStylesheet().putCellStyle(GraphBase.STYLE_MODULE, moduleStyle)
    const circuitContainerStyle = {}
    circuitContainerStyle[exports.mx.mxConstants.STYLE_SHAPE] =
      exports.mx.mxConstants.SHAPE_RECTANGLE
    circuitContainerStyle[exports.mx.mxConstants.STYLE_STROKECOLOR] = 'none'
    circuitContainerStyle[exports.mx.mxConstants.STYLE_FILLCOLOR] = 'none'
    circuitContainerStyle[exports.mx.mxConstants.STYLE_RESIZABLE] = 0
    circuitContainerStyle[exports.mx.mxConstants.STYLE_EDITABLE] = false
    circuitContainerStyle[exports.mx.mxConstants.STYLE_PORT_CONSTRAINT] = [
      exports.mx.mxConstants.DIRECTION_NORTH,
      exports.mx.mxConstants.DIRECTION_SOUTH,
    ]
    this.graph
      .getStylesheet()
      .putCellStyle(GraphBase.STYLE_CIRCUIT_CONTAINER, circuitContainerStyle)
    const backboneStyle = {}
    backboneStyle[exports.mx.mxConstants.STYLE_SHAPE] = exports.mx.mxConstants.SHAPE_LINE
    backboneStyle[exports.mx.mxConstants.STYLE_STROKECOLOR] = '#000000'
    backboneStyle[exports.mx.mxConstants.STYLE_STROKEWIDTH] = 2
    backboneStyle[exports.mx.mxConstants.STYLE_RESIZABLE] = 0
    backboneStyle[exports.mx.mxConstants.STYLE_EDITABLE] = false
    this.graph.getStylesheet().putCellStyle(GraphBase.STYLE_BACKBONE, backboneStyle)
    // Interaction styles
    const baseInteractionGlyphStyle = {}
    baseInteractionGlyphStyle[exports.mx.mxConstants.STYLE_STROKEWIDTH] = 2
    baseInteractionGlyphStyle[exports.mx.mxConstants.STYLE_ENDSIZE] = 10
    baseInteractionGlyphStyle[exports.mx.mxConstants.STYLE_STROKECOLOR] = '#000000'
    baseInteractionGlyphStyle[exports.mx.mxConstants.STYLE_FILLCOLOR] = '#000000'
    baseInteractionGlyphStyle[exports.mx.mxConstants.STYLE_EDITABLE] = false
    baseInteractionGlyphStyle[exports.mx.mxConstants.STYLE_EDGE] =
      exports.mx.mxConstants.EDGESTYLE_ORTHOGONAL
    baseInteractionGlyphStyle[exports.mx.mxConstants.STYLE_ENDFILL] = 0
    const interactionControlStyle = exports.mx.mxUtils.clone(baseInteractionGlyphStyle) // Inherit from the interaction defaults.
    interactionControlStyle[exports.mx.mxConstants.STYLE_ENDARROW] =
      exports.mx.mxConstants.ARROW_DIAMOND
    this.graph
      .getStylesheet()
      .putCellStyle(
        GraphBase.STYLE_INTERACTION + GraphBase.interactionControlName,
        interactionControlStyle
      )
    const interactionInhibitionStyle = exports.mx.mxUtils.clone(baseInteractionGlyphStyle)
    interactionInhibitionStyle[exports.mx.mxConstants.STYLE_ENDARROW] =
      GraphBase.interactionInhibitionName
    interactionInhibitionStyle[exports.mx.mxConstants.STYLE_ENDSIZE] = 15
    this.graph
      .getStylesheet()
      .putCellStyle(
        GraphBase.STYLE_INTERACTION + GraphBase.interactionInhibitionName,
        interactionInhibitionStyle
      )
    const interactionStimulationStyle = exports.mx.mxUtils.clone(baseInteractionGlyphStyle)
    interactionStimulationStyle[exports.mx.mxConstants.STYLE_ENDARROW] =
      exports.mx.mxConstants.ARROW_BLOCK
    this.graph
      .getStylesheet()
      .putCellStyle(
        GraphBase.STYLE_INTERACTION + GraphBase.interactionStimulationName,
        interactionStimulationStyle
      )
    const interactionProcessStyle = exports.mx.mxUtils.clone(baseInteractionGlyphStyle)
    interactionProcessStyle[exports.mx.mxConstants.STYLE_ENDARROW] =
      exports.mx.mxConstants.ARROW_BLOCK
    interactionProcessStyle[exports.mx.mxConstants.STYLE_ENDFILL] = 1
    this.graph
      .getStylesheet()
      .putCellStyle(
        GraphBase.STYLE_INTERACTION + GraphBase.interactionProcessName,
        interactionProcessStyle
      )
    const interactionDegradationStyle = exports.mx.mxUtils.clone(baseInteractionGlyphStyle)
    interactionDegradationStyle[exports.mx.mxConstants.STYLE_ENDARROW] =
      GraphBase.interactionDegradationName
    interactionDegradationStyle[exports.mx.mxConstants.STYLE_ENDSIZE] = 20
    this.graph
      .getStylesheet()
      .putCellStyle(
        GraphBase.STYLE_INTERACTION + GraphBase.interactionDegradationName,
        interactionDegradationStyle
      )
    // vertex selection border styles
    exports.mx.mxVertexHandler.prototype.getSelectionColor = function () {
      if (this.state.cell.style.startsWith(GraphBase.STYLE_CIRCUIT_CONTAINER)) {
        // circuit container selection color
        return '#0000ff'
      } else {
        // default color
        return '#00aa00'
      }
    }
    // edge selection border styles
    exports.mx.mxEdgeHandler.prototype.getSelectionColor = function () {
      return '#00aa00'
    }
  }
  /**
   * Loads glyph stencils and their names from the glyphService, and
   * saves them to mxGraph's shape registry
   * Also initalizes custom mxShapes needed for indicators
   */
  initCustomShapes() {
    // Sets up the extensions of mxShape
    CustomShapes_js_1.CustomShapes.initalize(this)
    // we need this if we intend on creating custom shapes with stencils
    let sequenceFeatureStencils = this.glyphService.getSequenceFeatureGlyphs()
    exports.mx.mxCellRenderer.prototype.createShape = function (state) {
      var shape = null
      if (state.style != null) {
        let stencilName = state.style[exports.mx.mxConstants.STYLE_SHAPE]
        var stencil = exports.mx.mxStencilRegistry.getStencil(stencilName)
        if (sequenceFeatureStencils[stencilName] != null) {
          shape = new CustomShapes_js_1.CustomShapes.SequenceFeatureShape(stencil)
        } else if (stencil != null) {
          shape = new exports.mx.mxShape(stencil)
        } else {
          var ctor = this.getShapeConstructor(state)
          shape = new ctor()
        }
      }
      return shape
    }
    // custom stencil setup
    let stencils = this.glyphService.getSequenceFeatureGlyphs()
    for (const name in stencils) {
      // Create a new copy of the stencil for the graph.
      const stencil = stencils[name][0]
      const centered = stencils[name][1]
      let customStencil = new exports.mx.mxStencil(stencil.desc) // Makes a deep copy
      // Change the copied stencil for mxgraph
      let origDrawShape = exports.mx.mxStencil.prototype.drawShape
      if (centered) {
        customStencil.drawShape = function (canvas, shape, x, y, w, h) {
          h /= 2
          y += h / 2
          origDrawShape.apply(this, [canvas, shape, x, y, w, h])
          shape.paintComposite(canvas, x, y - h / 2, w, h * 2)
        }
      } else {
        customStencil.drawShape = function (canvas, shape, x, y, w, h) {
          h = h / 2
          origDrawShape.apply(this, [canvas, shape, x, y, w, h])
          shape.paintComposite(canvas, x, y, w, h * 2)
        }
      }
      // Add the stencil to the registry and set its style.
      exports.mx.mxStencilRegistry.addStencil(name, customStencil)
      const newGlyphStyle = exports.mx.mxUtils.clone(this.baseSequenceFeatureGlyphStyle)
      newGlyphStyle[exports.mx.mxConstants.STYLE_SHAPE] = name
      this.graph
        .getStylesheet()
        .putCellStyle(GraphBase.STYLE_SEQUENCE_FEATURE + name, newGlyphStyle)
    }
    // molecularSpecies glyphs are simpler, since we don't have to morph
    // them to always be centred on the strand
    stencils = this.glyphService.getMolecularSpeciesGlyphs()
    for (const name in stencils) {
      const stencil = stencils[name][0]
      let customStencil = new exports.mx.mxStencil(stencil.desc) // Makes of deep copy of the stencil.
      exports.mx.mxStencilRegistry.addStencil(name, customStencil)
      const newGlyphStyle = exports.mx.mxUtils.clone(this.baseMolecularSpeciesGlyphStyle)
      newGlyphStyle[exports.mx.mxConstants.STYLE_SHAPE] = name
      this.graph
        .getStylesheet()
        .putCellStyle(GraphBase.STYLE_MOLECULAR_SPECIES + name, newGlyphStyle)
    }
    // interaction nodes are basically identical to molecular species
    stencils = this.glyphService.getInteractionNodeGlyphs()
    for (const name in stencils) {
      const stencil = stencils[name][0]
      let customStencil = new exports.mx.mxStencil(stencil.desc)
      exports.mx.mxStencilRegistry.addStencil(name, customStencil)
      const newGlyphStyle = exports.mx.mxUtils.clone(this.baseInteractionNodeGlyphStyle)
      newGlyphStyle[exports.mx.mxConstants.STYLE_SHAPE] = name
      this.graph
        .getStylesheet()
        .putCellStyle(GraphBase.STYLE_INTERACTION_NODE + name, newGlyphStyle)
    }
    // indicators like composit and combinatorial
    stencils = this.glyphService.getIndicatorGlyphs()
    for (const name in stencils) {
      const stencil = stencils[name][0]
      let customStencil = new exports.mx.mxStencil(stencil.desc)
      exports.mx.mxStencilRegistry.addStencil(name, customStencil)
      const newIndicatorStyle = exports.mx.mxUtils.clone(this.baseMolecularSpeciesGlyphStyle)
      newIndicatorStyle[exports.mx.mxConstants.STYLE_SHAPE] = name
      this.graph.getStylesheet().putCellStyle(GraphBase.STYLE_INDICATOR + name, newIndicatorStyle)
    }
    // *** Define custom markers for edge endpoints ***
    /**
     * Returns a function that draws an Inhibition glyph
     * @param endPoint The connection's endpoint (ie the coordinate of the anchor it's attached to)
     * @param unitX The x part of a vector specifying the connection's direction
     * @param unitY The y part of a vector specifying the connection's direction
     * @param size The size of the connection head, directly from the connection's style
     * @param source Boolean, true if this is the source endpoint, false if it is the terminal endpoint
     * @param sw The stroke width
     * @param filled Boolean, false if the connection head should have any transparency in the middle, true otherwise
     */
    let inhibitionMarkerDrawFunction = function (
      canvas,
      shape,
      type,
      endPoint,
      unitX,
      unitY,
      size,
      source,
      sw,
      filled
    ) {
      return function () {
        canvas.begin()
        canvas.moveTo(
          endPoint.x + (unitY * (size + sw)) / 2,
          endPoint.y - (unitX * (size + sw)) / 2
        )
        canvas.lineTo(
          endPoint.x - (unitY * (size + sw)) / 2,
          endPoint.y + (unitX * (size + sw)) / 2
        )
        canvas.stroke()
      }
    }
    exports.mx.mxMarker.addMarker(GraphBase.interactionInhibitionName, inhibitionMarkerDrawFunction)
    /**
     * Returns a function that draws a Process glyph
     */
    let degradationMarkerDrawFunction = function (
      canvas,
      shape,
      type,
      endPoint,
      unitX,
      unitY,
      size,
      source,
      sw,
      filled
    ) {
      const triangleTipX = endPoint.x - (unitX * (size + sw)) / 2
      const triangleTipY = endPoint.y - (unitY * (size + sw)) / 2
      const circleCenterX = endPoint.x - (unitX * size) / 4
      const circleCenterY = endPoint.y - (unitY * size) / 4
      const root2over2 = Math.sin(Math.PI / 4)
      // Changing the parameter controls how far the connection's stem is drawn
      endPoint.x = triangleTipX
      endPoint.y = triangleTipY
      return function () {
        // CIRCLE
        canvas.ellipse(circleCenterX - size / 4, circleCenterY - size / 4, size / 2, size / 2)
        canvas.stroke()
        // TRIANGLE
        canvas.begin()
        canvas.moveTo(triangleTipX, triangleTipY)
        canvas.lineTo(
          triangleTipX - (unitY * size) / 4 - (unitX * size) / 2,
          triangleTipY + (unitX * size) / 4 - (unitY * size) / 2
        )
        canvas.lineTo(
          triangleTipX + (unitY * size) / 4 - (unitX * size) / 2,
          triangleTipY - (unitX * size) / 4 - (unitY * size) / 2
        )
        canvas.close()
        canvas.fillAndStroke()
        // SLASH (line through the circle)
        canvas.begin()
        canvas.moveTo(
          circleCenterX + (root2over2 * size) / 4,
          circleCenterY - (root2over2 * size) / 4
        )
        canvas.lineTo(
          circleCenterX - (root2over2 * size) / 4,
          circleCenterY + (root2over2 * size) / 4
        )
        canvas.stroke()
        // This code makes the line rotate, but it makes more sense to always slash the same way
        // canvas.moveTo(circleCenterX + (unitY * root2over2 * size / 4) + (unitX * root2over2 * size / 4),
        //   circleCenterY - (unitX * root2over2 * size / 4) + (unitY * root2over2 * size / 4));
        // canvas.lineTo(circleCenterX - (unitX * root2over2 * size / 4) - (unitY * root2over2 * size / 4),
        //   circleCenterY + (unitX * root2over2 * size / 4) - (unitY * root2over2 * size / 4));
      }
    }
    exports.mx.mxMarker.addMarker(
      GraphBase.interactionDegradationName,
      degradationMarkerDrawFunction
    )
    let oldGetIndicatorShape = exports.mx.mxGraph.prototype.getIndicatorShape
    exports.mx.mxGraph.prototype.getIndicatorShape = function (state) {
      if (state.cell.isSequenceFeatureGlyph()) {
        return 'composite'
      } else {
        return oldGetIndicatorShape(state)
      }
    }
  }
  /**
   * Sets up logic for handling sequenceFeatureGlyph movement
   */
  initListeners() {
    // edge movement
    this.graph.addListener(
      exports.mx.mxEvent.CONNECT_CELL,
      exports.mx.mxUtils.bind(this, function (sender, evt) {
        return __awaiter(this, void 0, void 0, function* () {
          let edge = evt.getProperty('edge')
          let terminal = evt.getProperty('terminal') // The cell that's either source or dest
          let previous = evt.getProperty('previous') // The previous terminal cell
          let source = evt.getProperty('source') // boolean, true if terminal is the new source
          let cancelled = false
          try {
            sender.getModel().beginUpdate()
            // new terminal is a module, prompt for the sub part to keep track of
            let newTarget = null
            if (terminal != null && terminal.isModule()) {
              newTarget = yield this.promptChooseFunctionalComponent(terminal, source)
              if (!newTarget) {
                cancelled = true
                return
              }
            }
            let infoCopy = this.getFromInteractionDict(edge.value).makeCopy()
            // previous terminal was an interaction node, we need to decouple from it
            if (previous && previous.isInteractionNode()) {
              // remove any refinements with this edge from original
              let sourceRefinement = infoCopy.sourceRefinement[edge.getId()]
              let targetRefinement = infoCopy.targetRefinement[edge.getId()]
              delete infoCopy.sourceRefinement[edge.getId()]
              delete infoCopy.targetRefinement[edge.getId()]
              this.updateInteractionDict(infoCopy)
              infoCopy = infoCopy.makeCopy() // shouldn't modify the original copy anymore, or we mess up the history
              // remove all refinements from the copy
              infoCopy.sourceRefinement = {}
              infoCopy.targetRefinement = {}
              // add back refinements relating to ours
              if (sourceRefinement) {
                infoCopy.sourceRefinement[edge.getId()] = sourceRefinement
              }
              if (targetRefinement) {
                infoCopy.targetRefinement[edge.getId()] = targetRefinement
              }
              // make a dummy info so we can steal it's id
              let dummyInfo = new interactionInfo_js_1.InteractionInfo()
              infoCopy.displayID = dummyInfo.displayID
              // update the edges reference
              this.graph.getModel().setValue(edge, infoCopy.getFullURI())
            }
            // if the previous terminal was a module, we need to remove it's to/fromURI
            if (previous && previous.isModule()) {
              if (source) {
                delete infoCopy.fromURI[edge.getId()]
              } else {
                delete infoCopy.toURI[edge.getId()]
              }
            }
            // new terminal is an interaction node, we need to couple with it
            if (terminal && terminal.isInteractionNode()) {
              let oldURI = edge.value
              let nodeInfo = this.getFromInteractionDict(terminal.value).makeCopy()
              this.graph.getModel().setValue(edge, nodeInfo.getFullURI())
              // duplicate over the nescessary info
              // module targets
              if (infoCopy.fromURI[edge.getId()]) {
                nodeInfo.fromURI[edge.getId()] = infoCopy.fromURI[edge.getId()]
              }
              if (infoCopy.toURI[edge.getId()]) {
                nodeInfo.toURI[edge.getId()] = infoCopy.toURI[edge.getId()]
              }
              // edge refinements
              let sourceRefinement = infoCopy.sourceRefinement[edge.getId()]
              if (sourceRefinement) {
                nodeInfo.sourceRefinement[edge.getId()] = sourceRefinement
              }
              let targetRefinement = infoCopy.targetRefinement[edge.getId()]
              if (targetRefinement) {
                nodeInfo.targetRefinement[edge.getId()] = targetRefinement
              }
              // if the previous wasn't an interaction node, then we need to remove the info from the dictionary
              if (!previous || !previous.isInteractionNode()) {
                this.removeFromInteractionDict(oldURI)
              }
              infoCopy = nodeInfo
            }
            if (newTarget) {
              if (source) {
                infoCopy.fromURI[edge.getId()] = newTarget
              } else {
                infoCopy.toURI[edge.getId()] = newTarget
              }
            }
            this.updateInteractionDict(infoCopy)
          } finally {
            sender.getModel().endUpdate()
            // undo has to happen after end update
            if (cancelled) {
              this.editor.undoManager.undo()
              this.editor.undoManager.trim()
            }
          }
          evt.consume()
          this.updateAngularMetadata(this.graph.getSelectionCells())
        })
      })
    )
    // cell movement
    this.graph.addListener(
      exports.mx.mxEvent.MOVE_CELLS,
      exports.mx.mxUtils.bind(this, function (sender, evt) {
        return __awaiter(this, void 0, void 0, function* () {
          // sender is the graph
          sender.getModel().beginUpdate()
          let cancelled = false
          try {
            let movedCells = evt.getProperty('cells')
            // important note: if a parent cell is moving, none of its children
            // can appear here (even if they were also selected)
            // sort cells: processing order is important
            movedCells = movedCells.sort(function (cellA, cellB) {
              if (cellA.getRootId() !== cellB.getRootId()) {
                // cells are not related: choose arbitrary order (but still group by root)
                return cellA.getRootId() < cellB.getRootId() ? -1 : 1
              } else {
                // cells are in the same circuitContainer:
                // must be in sequence order
                let aIndex = cellA.getCircuitContainer(sender).getIndex(cellA)
                let bIndex = cellB.getCircuitContainer(sender).getIndex(cellB)
                return aIndex - bIndex
              }
            })
            // ownership change check
            let containers = new Set()
            if (sender.getCurrentRoot()) {
              let ownershipChange = false
              for (let cell of movedCells) {
                if (cell.isSequenceFeatureGlyph()) {
                  ownershipChange = true
                  containers.add(cell.getParent().getValue())
                }
              }
              for (let container of Array.from(containers.values())) {
                let glyphInfo
                if (sender.getCurrentRoot().isComponentView()) {
                  glyphInfo = this.getFromInfoDict(sender.getCurrentRoot().getId())
                } else {
                  glyphInfo = this.getFromInfoDict(container)
                }
                if (
                  ownershipChange &&
                  glyphInfo.uriPrefix != environment_js_1.environment.baseURI &&
                  !(yield this.promptMakeEditableCopy(glyphInfo.displayID))
                ) {
                  cancelled = true
                  // go check the finally block because I couldn't undo until after the end update
                  return
                }
              }
            }
            // If two adjacent sequenceFeatureGlyphs were moved, they should be adjacent after the move.
            // This loop finds all such sets of glyphs (relying on the sorted order) and sets them to
            // have the same x position so there is no chance of outside glyphs sneaking in between
            let streak
            for (let i = 0; i < movedCells.length; i += streak) {
              streak = 1
              if (!movedCells[i].isSequenceFeatureGlyph()) {
                continue
              }
              // found a sequenceFeature glyph. A streak might be starting...
              const baseX = movedCells[i].getGeometry().x
              const rootId = movedCells[i].getRootId()
              let streakWidth = movedCells[i].getGeometry().width
              while (
                i + streak < movedCells.length &&
                movedCells[i + streak].isSequenceFeatureGlyph() &&
                rootId === movedCells[i + streak].getRootId()
              ) {
                let xToContinueStreak = baseX + streakWidth
                if (xToContinueStreak === movedCells[i + streak].getGeometry().x) {
                  // The next cell continues the streak
                  movedCells[i + streak].replaceGeometry(baseX, 'auto', 'auto', 'auto', sender)
                  streakWidth += movedCells[i + streak].getGeometry().width
                  streak++
                } else {
                  // the next cell breaks the streak
                  break
                }
              }
            }
            // now all sequence feature glyphs are sorted by x position in the order
            // they should be when the move finishes.
            // (equal x position means they should stay in the order they were previously in)
            let cells = sender.getChildVertices(sender.getDefaultParent())
            for (let circuitContainer of cells.filter((cell) => cell.isCircuitContainer())) {
              this.horizontalSortBasedOnPosition(circuitContainer)
            }
            // finallly, another special case: if a circuitContainer only has one sequenceFeatureGlyph,
            // moving the glyph should move the circuitContainer
            for (const cell of movedCells) {
              if (cell.isSequenceFeatureGlyph() && cell.getParent().children.length === 2) {
                const x = cell.getParent().getGeometry().x + evt.getProperty('dx')
                const y = cell.getParent().getGeometry().y + evt.getProperty('dy')
                cell.getParent().replaceGeometry(x, y, 'auto', 'auto', sender)
              }
            }
            // sync circuit containers
            let circuitContainers = new Set()
            for (let movedCell of movedCells) {
              if (movedCell.isSequenceFeatureGlyph()) {
                circuitContainers.add(movedCell.getParent())
              }
            }
            for (let circuitContainer of Array.from(circuitContainers.values())) {
              this.syncCircuitContainer(circuitContainer)
            }
            // change ownership
            for (let container of Array.from(containers)) {
              this.changeOwnership(container)
            }
            evt.consume()
          } finally {
            sender.getModel().endUpdate()
            // undo has to happen after end update
            if (cancelled) {
              this.editor.undoManager.undo()
              this.editor.undoManager.trim()
            }
          }
        })
      })
    )
  }
  /**
   * Overrides methods necessary to prevent edge connections under certain conditions.
   */
  initEdgeValidation() {
    // We have to override this method because multiplicities only are checked when there is a source and target.
    // Multiplicities also base their type on cell.value, not cell.style
    let oldGetEdgeValidationError = exports.mx.mxGraph.prototype.getEdgeValidationError
    let validateInteractionRef = this.validateInteraction
    exports.mx.mxGraph.prototype.getEdgeValidationError = function (edge, source, target) {
      let result = oldGetEdgeValidationError.apply(this, arguments)
      // will only be null if there wasn't already a condition preventing a connection
      if (result != null) {
        return result
      }
      let styleString = edge.style.slice()
      let startIdx =
        styleString.indexOf(GraphBase.STYLE_INTERACTION) + GraphBase.STYLE_INTERACTION.length
      let endIdx = styleString.indexOf(';', startIdx)
      endIdx = endIdx > 0 ? endIdx : styleString.length
      let interactionType = styleString.slice(startIdx, endIdx)
      let validationMessage = validateInteractionRef(interactionType, source, target)
      return validationMessage
    }
  }
  validateInteraction(interactionType, source, target) {
    // edges can't connect to edges
    if ((source && source.isEdge()) || (target && target.isEdge())) {
      return 'Edges are dissallowed to connect to edges.'
    }
    // certain edge types can't connect to interaction nodes
    if (
      ((source && source.isInteractionNode()) || (target && target.isInteractionNode())) &&
      (interactionType == 'Control' ||
        interactionType == 'Inhibition' ||
        interactionType == 'Stimulation')
    ) {
      return 'Edge type dissallowed to connect to an interaction node.'
    }
    // prevent degredation from using anything as a target
    if (interactionType == 'Degradation' && target) {
      return "Degradation isn't allowed target anything."
    }
    // prevent degredation from having anything but a molecular species as a source
    if (interactionType == 'Degradation' && source && !source.isMolecularSpeciesGlyph()) {
      return 'Degredation is only allowed molecular species as a source.'
    }
    // prevent interaction nodes from chaining
    if (source && target && source.isInteractionNode() && target.isInteractionNode()) {
      return "Interaction nodes aren't allowed to connect."
    }
    return null
  }
  interactionNodeNametoType(name) {
    switch (name) {
      case 'association':
        return 'Non-Covalent Binding'
      case 'dissociation':
        return 'Dissociation'
      case 'process':
        return 'Process'
    }
  }
  interactionNodeTypeToName(type) {
    switch (type) {
      case 'Non-Covalent Binding':
        return 'association'
      case 'Dissociation':
        return 'dissociation'
      case 'Inhibition':
      case 'Stimulation':
      case 'Biochemical Reaction':
      case 'Degradation':
      case 'Genetic Production':
      case 'Control':
        return 'process'
      default:
        return 'unkown'
    }
  }
  moleculeNameToType(name) {
    switch (name) {
      case 'dsNA':
        return 'DNA molecule'
      case 'macromolecule':
        return 'Protein'
      case 'NGA (No Glyph Assigned Molecular Species)':
        return 'Protein'
      case 'small-molecule':
        return 'Small molecule'
      case 'ssNA':
        return 'RNA molecule'
      case 'replacement-glyph':
        return 'All_types'
      case 'complex':
        return 'Complex'
      default:
        return 'Protein'
    }
  }
  static moleculeTypeToName(type) {
    switch (type) {
      case 'DNA molecule':
        return 'dsNA'
      case 'Protein':
        return 'macromolecule'
      case 'Protein':
        return 'NGA (No Glyph Assigned Molecular Species)'
      case 'Small molecule':
        return 'small-molecule'
      case 'RNA molecule':
        return 'ssNA'
      case 'All_types':
        return 'replacement-glyph'
      case 'Complex':
        return 'complex'
      default:
        return 'NGA (No Glyph Assigned Molecular Species)'
    }
  }
}
exports.GraphBase = GraphBase
// static variables
// Constants
GraphBase.INFO_DICT_INDEX = 0
GraphBase.COMBINATORIAL_DICT_INDEX = 1
GraphBase.INTERACTION_DICT_INDEX = 2
GraphBase.sequenceFeatureGlyphWidth = 50
GraphBase.sequenceFeatureGlyphHeight = 100
GraphBase.interactionPortWidth = 10
GraphBase.molecularSpeciesGlyphWidth = 50
GraphBase.molecularSpeciesGlyphHeight = 50
GraphBase.interactionNodeGlyphWidth = 50
GraphBase.interactionNodeGlyphHeight = 50
GraphBase.defaultTextWidth = 120
GraphBase.defaultTextHeight = 80
GraphBase.defaultModuleWidth = 120
GraphBase.defaultModuleHeight = 50
GraphBase.defaultInteractionSize = 80
GraphBase.STYLE_CIRCUIT_CONTAINER = 'circuitContainer'
GraphBase.STYLE_BACKBONE = 'backbone'
GraphBase.STYLE_TEXTBOX = 'textBox'
GraphBase.STYLE_MODULE = 'moduleGlyph'
GraphBase.STYLE_SCAR = 'Scar (Assembly Scar)'
GraphBase.STYLE_NGA = 'NGA (No Glyph Assigned)'
GraphBase.STYLE_MOLECULAR_SPECIES = 'molecularSpeciesGlyph'
GraphBase.STYLE_SEQUENCE_FEATURE = 'sequenceFeatureGlyph'
GraphBase.STYLE_INTERACTION = 'interactionGlyph'
GraphBase.STYLE_INTERACTION_NODE = 'interactionNodeGlyph'
GraphBase.STYLE_MODULE_VIEW = 'moduleViewCell'
GraphBase.STYLE_COMPONENT_VIEW = 'componentViewCell'
GraphBase.STYLE_INDICATOR = 'indicator'
GraphBase.interactionControlName = 'Control'
GraphBase.interactionInhibitionName = 'Inhibition'
GraphBase.interactionStimulationName = 'Stimulation'
GraphBase.interactionProcessName = 'Process'
GraphBase.interactionDegradationName = 'Degradation'
// when decoding we add any unformatted view cells to this set
GraphBase.unFormatedCells = new Set()
