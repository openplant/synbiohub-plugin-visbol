'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ModuleInfo = void 0
const info_js_1 = require('./info.js')
class ModuleInfo extends info_js_1.Info {
  constructor() {
    super()
    this.displayID = 'module' + ModuleInfo.counter++
  }
  makeCopy() {
    const copy = new ModuleInfo()
    copy.displayID = this.displayID
    copy.name = this.name
    copy.description = this.description
    copy.version = this.version
    copy.uriPrefix = this.uriPrefix
    return copy
  }
  copyDataFrom(other) {
    this.displayID = other.displayID
    this.name = other.name
    this.description = other.description
    this.version = other.version
    this.uriPrefix = other.uriPrefix
  }
  getFullURI() {
    let fullURI = this.uriPrefix + '/' + this.displayID
    if (this.version && this.version.length > 0) {
      fullURI += '/' + this.version
    }
    return fullURI
  }
  encode(enc) {
    let node = enc.document.createElement('ModuleInfo')
    if (this.displayID) node.setAttribute('displayID', this.displayID)
    if (this.name && this.name.length > 0) node.setAttribute('name', this.name)
    if (this.description && this.description.length > 0)
      node.setAttribute('description', this.description)
    if (this.version && this.version.length > 0) node.setAttribute('version', this.version)
    if (this.uriPrefix) node.setAttribute('uriPrefix', this.uriPrefix)
    return node
  }
}
exports.ModuleInfo = ModuleInfo
ModuleInfo.counter = 0
