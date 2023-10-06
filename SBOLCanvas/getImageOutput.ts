import { JSDOM } from 'jsdom'
const dom = new JSDOM()

global.window = dom.window
global.document = window.document
global.XMLSerializer = window.XMLSerializer
global.navigator = window.navigator
global.DOMParser = window.DOMParser

import { GraphService } from './graph.service.js'
import { GlyphService } from './glyph.service.js'
import { MetadataService } from './metadata.service.js'

const service = new GraphService(new GlyphService(), new MetadataService())

export default function getImageOutput(xml) {
  service.setGraphToXML(xml)
  return service.exportSVG('canvasVisBOL')
}
