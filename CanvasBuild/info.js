'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.Info = void 0
const environment_js_1 = require('./environment.js')
/**
 * Base class for GlyphInfo InteractionInfo and ModuleInfo
 */
class Info {
  constructor() {
    this.uriPrefix = environment_js_1.environment.baseURI
  }
}
exports.Info = Info
