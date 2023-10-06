'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.IdentifiedInfo = void 0
class IdentifiedInfo {
  makeCopy() {
    const copy = new IdentifiedInfo()
    copy.description = this.description
    copy.displayId = this.displayId
    copy.name = this.name
    copy.type = this.type
    copy.uri = this.uri
    copy.version = this.version
    return copy
  }
  copyDataFrom(other) {
    this.description = other.description
    this.displayId = other.displayId
    this.name = other.name
    this.type = other.type
    this.uri = other.uri
    this.version = other.version
  }
  encode(enc) {
    let node = enc.document.createElement('IdentifiedInfo')
    if (this.description) node.setAttribute('description', this.description)
    if (this.displayId) node.setAttribute('displayID', this.displayId)
    if (this.name) node.setAttribute('name', this.name)
    if (this.type) node.setAttribute('type', this.type)
    if (this.uri) node.setAttribute('uri', this.uri)
    if (this.version) node.setAttribute('version', this.version)
    return node
  }
}
exports.IdentifiedInfo = IdentifiedInfo
