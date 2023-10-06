'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.StyleInfo = void 0
const mx = require('mxgraph')({
  mxImageBasePath: 'mxgraph/images',
  mxBasePath: 'mxgraph',
})
// object used as an enum to identify glyph types
const elementTypes = {
  BACKBONE: '0',
  TEXT_BOX: '1',
  SEQUENCE_FEATURE: '2',
  MOLECULAR_SPECIES: '3',
  INTERACTION: '4',
}
/**
 * A class for relaying style information between the graph and the design menu
 */
class StyleInfo {
  constructor(selection, graph) {
    this.selectionTypes = new Set()
    this.styles = {}
    // filter out the circuit containers
    // have to make a copy, as the selection array given will affect other calls to graph.getSelectionCells
    selection = selection.slice()
    for (let i = 0; i < selection.length; i++) {
      if (selection[i].isCircuitContainer()) {
        selection[i] = selection[i].getBackbone()
      }
    }
    for (const cell of selection) {
      if (cell.isSequenceFeatureGlyph()) {
        this.selectionTypes.add(elementTypes.SEQUENCE_FEATURE)
      } else if (cell.isMolecularSpeciesGlyph()) {
        this.selectionTypes.add(elementTypes.MOLECULAR_SPECIES)
      } else if (cell.isInteraction()) {
        this.selectionTypes.add(elementTypes.INTERACTION)
      } else if (cell.isBackbone()) {
        this.selectionTypes.add(elementTypes.BACKBONE)
      } else {
        // otherwise assume textbox
        this.selectionTypes.add(elementTypes.TEXT_BOX)
      }
    }
    // load the current cell style mask
    if (selection.length > 0) {
      let currentStyle = graph.getCellStyle(selection[0])
      if (this.hasBendStyle()) {
        this.styles[mx.mxConstants.STYLE_ROUNDED] = currentStyle[mx.mxConstants.STYLE_ROUNDED]
        this.styles[mx.mxConstants.STYLE_CURVED] = currentStyle[mx.mxConstants.STYLE_CURVED]
      }
      if (this.hasEdgeStyle()) {
        let currentEdgeStyle = currentStyle[mx.mxConstants.STYLE_EDGE]
        this.styles[mx.mxConstants.STYLE_EDGE] = currentEdgeStyle ? currentEdgeStyle : 'diagonal'
      }
      if (this.hasEndSize()) {
        this.styles[mx.mxConstants.STYLE_ENDSIZE] = currentStyle[mx.mxConstants.STYLE_ENDSIZE]
      }
      if (this.hasFillColor()) {
        this.styles[mx.mxConstants.STYLE_FILLCOLOR] = currentStyle[mx.mxConstants.STYLE_FILLCOLOR]
      }
      if (this.hasFillOpacity()) {
        let currentFillOpacity = currentStyle[mx.mxConstants.STYLE_FILL_OPACITY]
        this.styles[mx.mxConstants.STYLE_FILL_OPACITY] = currentFillOpacity
          ? currentFillOpacity
          : 100
      }
      if (this.hasFontColor()) {
        this.styles[mx.mxConstants.STYLE_FONTCOLOR] = currentStyle[mx.mxConstants.STYLE_FONTCOLOR]
      }
      if (this.hasFontOpacity()) {
        let currentFontOpacity = currentStyle[mx.mxConstants.STYLE_TEXT_OPACITY]
        this.styles[mx.mxConstants.STYLE_TEXT_OPACITY] = currentFontOpacity
          ? currentFontOpacity
          : 100
      }
      if (this.hasFontSize()) {
        let currentFontSize = currentStyle[mx.mxConstants.STYLE_FONTSIZE]
        this.styles[mx.mxConstants.STYLE_FONTSIZE] = currentFontSize ? currentFontSize : 11
      }
      if (this.hasSourceSpacing()) {
        let currentSourceSpacing = currentStyle[mx.mxConstants.STYLE_SOURCE_PERIMETER_SPACING]
        this.styles[mx.mxConstants.STYLE_SOURCE_PERIMETER_SPACING] = currentSourceSpacing
          ? currentSourceSpacing
          : 0
      }
      if (this.hasStrokeColor()) {
        this.styles[mx.mxConstants.STYLE_STROKECOLOR] =
          currentStyle[mx.mxConstants.STYLE_STROKECOLOR]
      }
      if (this.hasStrokeOpacity()) {
        let currentStrokeOpacity = currentStyle[mx.mxConstants.STYLE_STROKE_OPACITY]
        this.styles[mx.mxConstants.STYLE_STROKE_OPACITY] = currentStrokeOpacity
          ? currentStrokeOpacity
          : 100
      }
      if (this.hasStrokeWidth()) {
        let currentStrokeWidth = currentStyle[mx.mxConstants.STYLE_STROKEWIDTH]
        this.styles[mx.mxConstants.STYLE_STROKEWIDTH] = currentStrokeWidth ? currentStrokeWidth : 1
      }
      if (this.hasTargetSpacing()) {
        this.styles[mx.mxConstants.STYLE_TARGET_PERIMETER_SPACING] =
          currentStyle[mx.mxConstants.STYLE_TARGET_PERIMETER_SPACING]
      }
    }
  }
  hasStrokeColor() {
    // all cell types have a strokeColor
    return this.selectionTypes.size > 0
  }
  currentStrokeColor() {
    return this.styles[mx.mxConstants.STYLE_STROKECOLOR]
  }
  setStrokeColor(newValue) {
    this.styles[mx.mxConstants.STYLE_STROKECOLOR] = newValue
  }
  hasStrokeOpacity() {
    return this.selectionTypes.size > 0
  }
  currentStrokeOpacity() {
    return this.styles[mx.mxConstants.STYLE_STROKE_OPACITY]
  }
  setStrokeOpacity(newValue) {
    this.styles[mx.mxConstants.STYLE_STROKE_OPACITY] = newValue
  }
  hasStrokeWidth() {
    return (
      this.selectionTypes.size > 0 &&
      !this.selectionTypes.has(elementTypes.SEQUENCE_FEATURE) &&
      !this.selectionTypes.has(elementTypes.MOLECULAR_SPECIES)
    )
  }
  currentStrokeWidth() {
    return this.styles[mx.mxConstants.STYLE_STROKEWIDTH]
  }
  setStrokeWidth(newValue) {
    this.styles[mx.mxConstants.STYLE_STROKEWIDTH] = newValue
  }
  hasFillColor() {
    // no interactions allowed
    // (even ones that look filled should use the same color as their stroke)
    return this.selectionTypes.size > 0 && !this.selectionTypes.has(elementTypes.INTERACTION)
  }
  currentFillColor() {
    return this.styles[mx.mxConstants.STYLE_FILLCOLOR]
  }
  setFillColor(newValue) {
    this.styles[mx.mxConstants.STYLE_FILLCOLOR] = newValue
  }
  hasFillOpacity() {
    return this.selectionTypes.size > 0 && !this.selectionTypes.has(elementTypes.INTERACTION)
  }
  currentFillOpacity() {
    return this.styles[mx.mxConstants.STYLE_FILL_OPACITY]
  }
  setFillOpacity(newValue) {
    this.styles[mx.mxConstants.STYLE_FILL_OPACITY] = newValue
  }
  hasBendStyle() {
    // must only have interactions
    return this.selectionTypes.has(elementTypes.INTERACTION) && this.selectionTypes.size === 1
  }
  currentBendStyle() {
    let rounded = this.styles[mx.mxConstants.STYLE_ROUNDED]
    let curved = this.styles[mx.mxConstants.STYLE_CURVED]
    if (curved) {
      return 'curved'
    } else {
      return rounded ? 'rounded' : 'sharp'
    }
  }
  setBendStyle(newValue) {
    switch (newValue) {
      case 'sharp':
        this.styles[mx.mxConstants.STYLE_ROUNDED] = 0
        this.styles[mx.mxConstants.STYLE_CURVED] = 0
        break
      case 'rounded':
        this.styles[mx.mxConstants.STYLE_ROUNDED] = 1
        this.styles[mx.mxConstants.STYLE_CURVED] = 0
        break
      case 'curved':
        this.styles[mx.mxConstants.STYLE_ROUNDED] = 0
        this.styles[mx.mxConstants.STYLE_CURVED] = 1
        break
    }
  }
  hasEndSize() {
    // must only have interactions
    return this.selectionTypes.has(elementTypes.INTERACTION) && this.selectionTypes.size === 1
  }
  currentEndSize() {
    return this.styles[mx.mxConstants.STYLE_ENDSIZE]
  }
  setEndSize(newValue) {
    this.styles[mx.mxConstants.STYLE_ENDSIZE] = newValue
  }
  hasEdgeStyle() {
    // must only have interactions
    return this.selectionTypes.has(elementTypes.INTERACTION) && this.selectionTypes.size === 1
  }
  currentEdgeStyle() {
    return this.styles[mx.mxConstants.STYLE_EDGE]
  }
  setEdgeStyle(newValue) {
    this.styles[mx.mxConstants.STYLE_EDGE] = newValue
  }
  hasSourceSpacing() {
    // must only have interactions
    return this.selectionTypes.has(elementTypes.INTERACTION) && this.selectionTypes.size === 1
  }
  currentSourceSpacing() {
    return this.styles[mx.mxConstants.STYLE_SOURCE_PERIMETER_SPACING]
  }
  setSourceSpacing(newValue) {
    this.styles[mx.mxConstants.STYLE_SOURCE_PERIMETER_SPACING] = newValue
  }
  hasTargetSpacing() {
    // must only have interactions
    return this.selectionTypes.has(elementTypes.INTERACTION) && this.selectionTypes.size === 1
  }
  currentTargetSpacing() {
    return this.styles[mx.mxConstants.STYLE_TARGET_PERIMETER_SPACING]
  }
  setTargetSpacing(newValue) {
    this.styles[mx.mxConstants.STYLE_TARGET_PERIMETER_SPACING] = newValue
  }
  hasFontColor() {
    // can only have text boxes, glyphs, and molecular species
    return (
      this.selectionTypes.size > 0 &&
      !this.selectionTypes.has(elementTypes.BACKBONE) &&
      !this.selectionTypes.has(elementTypes.INTERACTION)
    )
  }
  currentFontColor() {
    return this.styles[mx.mxConstants.STYLE_FONTCOLOR]
  }
  setFontColor(newValue) {
    this.styles[mx.mxConstants.STYLE_FONTCOLOR] = newValue
  }
  hasFontOpacity() {
    return (
      this.selectionTypes.size > 0 &&
      !this.selectionTypes.has(elementTypes.BACKBONE) &&
      !this.selectionTypes.has(elementTypes.INTERACTION)
    )
  }
  currentFontOpacity() {
    return this.styles[mx.mxConstants.STYLE_TEXT_OPACITY]
  }
  setFontOpacity(newValue) {
    this.styles[mx.mxConstants.STYLE_TEXT_OPACITY] = newValue
  }
  hasFontSize() {
    return (
      this.selectionTypes.size > 0 &&
      !this.selectionTypes.has(elementTypes.BACKBONE) &&
      !this.selectionTypes.has(elementTypes.INTERACTION)
    )
  }
  currentFontSize() {
    return this.styles[mx.mxConstants.STYLE_FONTSIZE]
  }
  setFontSize(newValue) {
    this.styles[mx.mxConstants.STYLE_FONTSIZE] = newValue
  }
}
exports.StyleInfo = StyleInfo
