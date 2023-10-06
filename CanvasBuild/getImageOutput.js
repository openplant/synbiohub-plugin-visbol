'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const jsdom_1 = require('jsdom')
const dom = new jsdom_1.JSDOM()
global.window = dom.window
global.document = window.document
global.XMLSerializer = window.XMLSerializer
global.navigator = window.navigator
global.DOMParser = window.DOMParser
const graph_service_js_1 = require('./graph.service.js')
const glyph_service_js_1 = require('./glyph.service.js')
const metadata_service_js_1 = require('./metadata.service.js')
const service = new graph_service_js_1.GraphService(
  new glyph_service_js_1.GlyphService(),
  new metadata_service_js_1.MetadataService()
)
function getImageOutput(xml) {
  service.setGraphToXML(xml)
  return service.exportSVG('canvasVisBOL')
}
exports.default = getImageOutput
