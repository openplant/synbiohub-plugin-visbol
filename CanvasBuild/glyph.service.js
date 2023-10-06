'use strict'
// import { Injectable } from '@angular/core';
Object.defineProperty(exports, '__esModule', { value: true })
exports.GlyphService = void 0
const mx = require('mxgraph')({
  mxImageBasePath: 'mxgraph/images',
  mxBasePath: 'mxgraph',
})
const fs = require('fs')
const path = require('path')
// @Injectable({
//   providedIn: 'root'
// })
class GlyphService {
  constructor() {
    // TODO load list of xml files from server
    this.sequenceFeatureXMLs = [
      // Strand glyphs
      './assets/glyph_stencils/sequence_feature/engineered-region.xml',
      './assets/glyph_stencils/sequence_feature/promoter.xml',
      './assets/glyph_stencils/sequence_feature/ribosome-entry-site.xml',
      './assets/glyph_stencils/sequence_feature/cds.xml',
      './assets/glyph_stencils/sequence_feature/terminator-specification.xml',
      './assets/glyph_stencils/sequence_feature/ncrna.xml',
      './assets/glyph_stencils/sequence_feature/origin-of-replication.xml',
      './assets/glyph_stencils/sequence_feature/origin-of-transfer.xml',
      './assets/glyph_stencils/sequence_feature/primer-binding-site.xml',
      './assets/glyph_stencils/sequence_feature/five-prime-sticky-restriction-site.xml',
      './assets/glyph_stencils/sequence_feature/three-prime-sticky-restriction-site.xml',
      './assets/glyph_stencils/sequence_feature/assembly-scar.xml',
      './assets/glyph_stencils/sequence_feature/operator.xml',
      './assets/glyph_stencils/sequence_feature/insulator.xml',
      './assets/glyph_stencils/sequence_feature/blunt-restriction-site.xml',
      './assets/glyph_stencils/sequence_feature/three-prime-overhang.xml',
      './assets/glyph_stencils/sequence_feature/five-prime-overhang.xml',
      './assets/glyph_stencils/sequence_feature/aptamer.xml',
      //'assets/glyph_stencils/sequence_feature/dna-stability-element.xml',
      './assets/glyph_stencils/sequence_feature/polyA.xml',
      './assets/glyph_stencils/sequence_feature/specific-recombination-site.xml',
      './assets/glyph_stencils/sequence_feature/no-glyph-assigned.xml',
      './assets/glyph_stencils/sequence_feature/signature.xml',
      './assets/glyph_stencils/sequence_feature/location-dna.xml',
      './assets/glyph_stencils/sequence_feature/location-rna.xml',
      './assets/glyph_stencils/sequence_feature/location-protein.xml',
      './assets/glyph_stencils/sequence_feature/nuclease-site.xml',
      './assets/glyph_stencils/sequence_feature/protease-site.xml',
      './assets/glyph_stencils/sequence_feature/protein-stability-element.xml',
      './assets/glyph_stencils/sequence_feature/ribonuclease-site.xml',
      './assets/glyph_stencils/sequence_feature/rna-stability-element.xml',
      //'assets/glyph_stencils/sequence_feature/chromosomal-locus.xml',
      //'assets/glyph_stencils/sequence_feature/circular-plasmid.xml',
      './assets/glyph_stencils/sequence_feature/transcription-end.xml',
      './assets/glyph_stencils/sequence_feature/translation-end.xml',
      //'assets/glyph_stencils/sequence_feature/test.xml',
    ]
    this.molecularSpeciesXMLs = [
      // 'molecular species' glyphs aka protein?
      './assets/glyph_stencils/molecular_species/macromolecule.xml',
      './assets/glyph_stencils/molecular_species/dsNA.xml',
      './assets/glyph_stencils/molecular_species/ssNA.xml',
      './assets/glyph_stencils/molecular_species/small-molecule.xml',
      './assets/glyph_stencils/molecular_species/no-glyph-assigned-ms.xml',
      './assets/glyph_stencils/molecular_species/replacement-glyph.xml',
      './assets/glyph_stencils/molecular_species/complex.xml',
    ]
    this.interactionXMLs = [
      './assets/glyph_stencils/interactions/control.xml',
      './assets/glyph_stencils/interactions/inhibition.xml',
      './assets/glyph_stencils/interactions/stimulation.xml',
      './assets/glyph_stencils/interactions/process.xml',
      './assets/glyph_stencils/interactions/degradation.xml',
    ]
    this.interactionNodeXMLs = [
      './assets/glyph_stencils/interaction_nodes/association.xml',
      './assets/glyph_stencils/interaction_nodes/dissociation.xml',
      './assets/glyph_stencils/interaction_nodes/process.xml',
      './assets/glyph_stencils/molecular_species/replacement-glyph.xml',
    ]
    this.indicatorXMLs = [
      './assets/glyph_stencils/indicators/composite.xml',
      './assets/glyph_stencils/indicators/variant.xml',
      './assets/glyph_stencils/indicators/error.xml',
    ]
    this.utilXMLs = ['./assets/backbone.xml', './assets/textBox.xml', './assets/module.xml']
    this.sequenceFeatures = {}
    this.molecularSpecies = {}
    this.interactions = {}
    this.interactionNodes = {}
    this.indicators = {}
    this.utils = {}
    this.loadXMLs(this.sequenceFeatureXMLs, this.sequenceFeatures)
    this.loadXMLs(this.molecularSpeciesXMLs, this.molecularSpecies)
    this.loadXMLs(this.interactionNodeXMLs, this.interactionNodes)
    this.loadXMLs(this.interactionXMLs, this.interactions)
    this.loadXMLs(this.indicatorXMLs, this.indicators)
    this.loadXMLs(this.utilXMLs, this.utils)
  }
  loadXMLs(xml_list, glyph_list) {
    xml_list.forEach((filename) => {
      const __dirname = path.resolve()
      let req = mx.mxUtils.parseXml(fs.readFileSync(path.join(__dirname, 'SBOLCanvas', filename)))
      let root = req.documentElement
      let shape = root.firstChild
      while (shape != null) {
        if (shape.nodeType == mx.mxConstants.NODETYPE_ELEMENT) {
          const name = shape.getAttribute('name')
          const centered = shape.getAttribute('centered')
          const stencil = new mx.mxStencil(shape)
          glyph_list[name] = [stencil, centered && centered.toLowerCase() == 'true']
        }
        shape = shape.nextSibling
      }
    })
  }
  getElements(glyph_list) {
    const svgs = {}
    for (const name in glyph_list) {
      const stencil = glyph_list[name][0]
      let elt = document.createElement('svg')
      let canvas = new mx.mxSvgCanvas2D(elt)
      let shape = new mx.mxShape(stencil)
      canvas.setStrokeColor('#000000')
      canvas.setFillColor('none')
      stencil.drawShape(canvas, shape, 0, 0, 50, 50)
      svgs[name] = elt
    }
    return svgs
  }
  getSequenceFeatureGlyphs() {
    return this.sequenceFeatures
  }
  getMolecularSpeciesGlyphs() {
    return this.molecularSpecies
  }
  getIndicatorGlyphs() {
    return this.indicators
  }
  getInteractionNodeGlyphs() {
    return this.interactionNodes
  }
  getUtilElements() {
    return this.getElements(this.utils)
  }
  getInteractionElements() {
    return this.getElements(this.interactions)
  }
  getInteractionNodeElements() {
    return this.getElements(this.interactionNodes)
  }
  getMolecularSpeciesElements() {
    return this.getElements(this.molecularSpecies)
  }
  getSequenceFeatureElements() {
    return this.getElements(this.sequenceFeatures)
  }
}
exports.GlyphService = GlyphService
