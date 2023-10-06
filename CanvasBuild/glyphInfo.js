'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.GlyphInfo = void 0
const info_js_1 = require('./info.js')
class GlyphInfo extends info_js_1.Info {
  constructor(partType) {
    super()
    this.displayID = 'id' + GlyphInfo.counter++
    if (partType) {
      this.partType = partType
    } else {
      this.partType = 'DNA region'
    }
  }
  makeCopy() {
    const copy = new GlyphInfo()
    copy.partType = this.partType
    copy.otherTypes = this.otherTypes ? this.otherTypes.slice() : null
    copy.partRole = this.partRole
    copy.otherRoles = this.otherRoles ? this.otherRoles.slice() : null
    copy.partRefine = this.partRefine
    copy.displayID = this.displayID
    copy.name = this.name
    copy.description = this.description
    copy.version = this.version
    copy.sequence = this.sequence
    copy.sequenceURI = this.sequenceURI
    copy.uriPrefix = this.uriPrefix
    copy.annotations = this.annotations ? this.annotations.slice() : null
    copy.derivedFroms = this.derivedFroms ? this.derivedFroms.slice() : null
    copy.generatedBys = this.generatedBys ? this.generatedBys.slice() : null
    return copy
  }
  copyDataFrom(other) {
    this.partType = other.partType
    this.otherTypes = other.otherTypes ? other.otherTypes.slice() : null
    this.partRole = other.partRole
    this.otherRoles = other.otherRoles ? other.otherRoles.slice() : null
    this.partRefine = other.partRefine
    this.displayID = other.displayID
    this.name = other.name
    this.description = other.description
    this.version = other.version
    this.sequence = other.sequence
    this.sequenceURI = other.sequenceURI
    this.uriPrefix = other.uriPrefix
    this.annotations = other.annotations ? other.annotations.slice() : null
    this.derivedFroms = other.derivedFroms ? other.derivedFroms.slice() : null
    this.generatedBys = other.generatedBys ? other.generatedBys.slice() : null
  }
  getFullURI() {
    let fullURI = this.uriPrefix + '/' + this.displayID
    if (this.version && this.version.length > 0) {
      fullURI += '/' + this.version
    }
    return fullURI
  }
  encode(enc) {
    let node = enc.document.createElement('GlyphInfo')
    if (this.partType) node.setAttribute('partType', this.partType)
    if (this.otherTypes) {
      let otherTypesNode = enc.encode(this.otherTypes)
      otherTypesNode.setAttribute('as', 'otherTypes')
      node.appendChild(otherTypesNode)
    }
    if (this.partRole) node.setAttribute('partRole', this.partRole)
    if (this.otherRoles) {
      let otherRolesNode = enc.encode(this.otherRoles)
      otherRolesNode.setAttribute('as', 'otherRoles')
      node.appendChild(otherRolesNode)
    }
    if (this.partRefine) node.setAttribute('partRefine', this.partRefine)
    if (this.displayID) node.setAttribute('displayID', this.displayID)
    if (this.name && this.name.length > 0) node.setAttribute('name', this.name)
    if (this.description && this.description.length > 0)
      node.setAttribute('description', this.description)
    if (this.version && this.version.length > 0) node.setAttribute('version', this.version)
    if (this.sequence && this.sequence.length > 0) node.setAttribute('sequence', this.sequence)
    if (this.sequenceURI && this.sequenceURI.length > 0)
      node.setAttribute('sequenceURI', this.sequenceURI)
    if (this.uriPrefix) node.setAttribute('uriPrefix', this.uriPrefix)
    if (this.annotations) {
      let annotationsNode = enc.encode(this.annotations)
      annotationsNode.setAttribute('as', 'annotations')
      node.appendChild(annotationsNode)
    }
    if (this.derivedFroms) {
      let derivedFromsNode = enc.encode(this.derivedFroms)
      derivedFromsNode.setAttribute('as', 'derivedFroms')
      node.appendChild(derivedFromsNode)
    }
    if (this.generatedBys) {
      let generatedBysNode = enc.encode(this.generatedBys)
      generatedBysNode.setAttribute('as', 'generatedBys')
      node.appendChild(generatedBysNode)
    }
    return node
  }
}
exports.GlyphInfo = GlyphInfo
// Remember that when you change this you need to change the encode function in graph service
GlyphInfo.counter = 0
