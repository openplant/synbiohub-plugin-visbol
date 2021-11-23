const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();

global.window = dom.window;
global.document = window.document;
global.XMLSerializer = window.XMLSerializer;
global.navigator = window.navigator;
global.DOMParser = window.DOMParser;

const mxgraph = require("mxgraph")({
  mxImageBasePath: "./src/images",
  mxBasePath: "./src"
});

const { mxGraph, mxCodec, mxUtils, mxConstants, mxXmlCanvas2D, mxImageExport, mxGraphModel, mxGeometry, mxPoint, mxCell,
mxObjectCodec, mxCodecRegistry } = mxgraph;

function getOutput(xml) {
  const graph = new mxGraph();

  setGraphStyle(graph);

  graph.home();
  graph.getModel().clear();

  const doc = mxUtils.parseXml(xml);
  const codec = new mxCodec(doc);
  codec.decode(doc.documentElement, graph.getModel());

  const cell1 = graph.getModel().getCell("1");
  let viewCells = graph.getModel().getChildren(cell1);
  let rootViewCell;
  for (let child of viewCells) {
    console.log(child);
    if (child) {
      rootViewCell = graph.getModel().getCell(child.getValue());
      graph.getModel().remove(child);
      break;
    }
  }
  /*

  graph.enterGroup(rootViewCell);

  let children = graph.getModel().getChildren(graph.getDefaultParent());
  if (children) {
    children.forEach(element => {
      if (element.isCircuitContainer())
        element.refreshCircuitContainer(graph);
    });
  }

  let currentScale = graph.getView().getScale();
  graph.maxFitScale = currentScale;
  graph.fit();

  graph.center();

  graph.refresh();
  */

  let bg = '#ffffff';
  let scale = 1;
  let b = 1;

  let imgExport = new mxImageExport();
  let bounds = { x: 0, y: 0, width: 150, height: 150 };
  console.log(bounds);
  let vs = graph.view.scale;

  let xmlDoc = mxUtils.createXmlDocument();
  let root = xmlDoc.createElement('output');
  xmlDoc.appendChild(root);

  let xmlCanvas = new mxXmlCanvas2D(root);
  xmlCanvas.translate(Math.floor((b / scale - bounds.x) / vs), Math.floor((b / scale - bounds.y) / vs));
  xmlCanvas.scale(1 / vs);

  imgExport.drawState(graph.getView().getState(graph.getCurrentRoot()), xmlCanvas);

  let w = Math.ceil(bounds.width * scale / vs + 2 * b);
  let h = Math.ceil(bounds.height * scale / vs + 2 * b);

  let parsedXML = mxUtils.getXml(root);

  console.log(parsedXML);
}

function setGraphStyle(graph) {
  initDecodeEnv(graph);
  initExtraCellMethods(graph);
  initGroupingRules(graph);
}

function initDecodeEnv(graph) {
  window['mxGraphModel'] = mxGraphModel;
  window['mxGeometry'] = mxGeometry;
  window['mxPoint'] = mxPoint;
  window['mxCell'] = mxCell;

  graph.genericDecode = function (dec, node, into) {
    const meta = node;
    if (meta != null) {
      for (let i = 0; i < meta.attributes.length; i++) {
        const attrib = meta.attributes[i];
        if (attrib.specified == true && attrib.name != 'as') {
          into[attrib.name] = attrib.value;
        }
      }
      for (let i = 0; i < meta.children.length; i++) {
        const childNode = meta.children[i];
        into[childNode.getAttribute("as")] = dec.decode(childNode);
      }
    }
    return into;
  }

  //mxGraph uses function.name which uglifyJS breaks on production
  // Glyph info decode/encode
  Object.defineProperty(GlyphInfo, "name", { configurable: true, value: "GlyphInfo" });
  const glyphInfoCodec = new mxObjectCodec(new GlyphInfo());
  glyphInfoCodec.decode = function (dec, node, into) {
    const glyphData = new GlyphInfo();
    return genericDecode(dec, node, glyphData);
  }
  glyphInfoCodec.encode = function (enc, object) {
    return object.encode(enc);
  }
  mxCodecRegistry.register(glyphInfoCodec);
  window['GlyphInfo'] = GlyphInfo;

  // Module info encode/decode
  Object.defineProperty(ModuleInfo, "name", { configurable: true, value: "ModuleInfo" });
  const moduleInfoCodec = new mxObjectCodec(new ModuleInfo());
  moduleInfoCodec.decode = function (dec, node, into) {
    const moduleData = new ModuleInfo();
    return genericDecode(dec, node, moduleData);
  }
  moduleInfoCodec.encode = function (enc, object) {
    return object.encode(enc);
  }
  mxCodecRegistry.register(moduleInfoCodec);
  window['ModuleInfo'] = ModuleInfo;

  // Interaction info encode/decode
  Object.defineProperty(InteractionInfo, "name", { configurable: true, value: "InteractionInfo" });
  const interactionInfoCodec = new mxObjectCodec(new InteractionInfo());
  interactionInfoCodec.decode = function (dec, node, into) {
      const interactionData = new InteractionInfo();
      return genericDecode(dec, node, interactionData);
  }
  interactionInfoCodec.encode = function (enc, object) {
      return object.encode(enc);
  }
  mxCodecRegistry.register(interactionInfoCodec);
  window['InteractionInfo'] = InteractionInfo;

  // combinatorial info decode
  Object.defineProperty(CombinatorialInfo, "name", { configurable: true, value: "CombinatorialInfo" });
  const combinatorialInfoCodec = new mx.mxObjectCodec(new CombinatorialInfo());
  combinatorialInfoCodec.decode = function (dec, node, into) {
      const combinatorialData = new CombinatorialInfo();
      return genericDecode(dec, node, combinatorialData);
  }
  combinatorialInfoCodec.encode = function (enc, object) {
      return object.encode(enc);
  }
  mx.mxCodecRegistry.register(combinatorialInfoCodec);
  window['CombinatorialInfo'] = CombinatorialInfo;
}


getOutput(`<mxGraphModel><root><mxCell id="0"><Array as="value"><Array><GlyphInfo as="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1" displayID="id6" partRole="NGA (No Glyph Assigned)" partType="DNA region" uriPrefix="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin" version="1"><Array as="otherTypes"/><Array as="otherRoles"/><Array as="annotations"><CanvasAnnotation localPart="topLevel" namespaceURI="http://wiki.synbiohub.org/wiki/Terms/synbiohub#" prefix="sbh"/><CanvasAnnotation localPart="ownedBy" namespaceURI="http://wiki.synbiohub.org/wiki/Terms/synbiohub#" prefix="sbh"/></Array></GlyphInfo><GlyphInfo as="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8/1" displayID="id8" partRole="Gen (Engineered Region)" partType="DNA region" uriPrefix="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin" version="1"><Array as="otherTypes"/><Array as="otherRoles"/><Array as="annotations"><CanvasAnnotation localPart="topLevel" namespaceURI="http://wiki.synbiohub.org/wiki/Terms/synbiohub#" prefix="sbh"/><CanvasAnnotation localPart="ownedBy" namespaceURI="http://wiki.synbiohub.org/wiki/Terms/synbiohub#" prefix="sbh"/></Array></GlyphInfo><ModuleInfo as="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1/1" displayID="module1" uriPrefix="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin" version="1"/></Array><Array/><Array/></Array></mxCell><mxCell id="1" parent="0"/><mxCell id="2" parent="1" value="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1/1" vertex="1"><mxGeometry as="geometry"/></mxCell><mxCell id="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1/1" parent="1" style="moduleViewCell" vertex="1"><mxGeometry as="geometry"/></mxCell><mxCell id="3" parent="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1/1" style="circuitContainer" value="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1" vertex="1"><mxGeometry as="geometry" height="100.0" width="50.0" x="224.5" y="366.0"/></mxCell><mxCell id="5" parent="3" style="sequenceFeatureGlyph" value="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8/1" vertex="1"><mxGeometry as="geometry" height="100.0" width="50.0"/></mxCell><mxCell id="4" parent="3" style="backbone" vertex="1"><mxGeometry as="geometry"/></mxCell><mxCell id="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1" parent="1" style="componentViewCell" vertex="1"><mxGeometry as="geometry"/></mxCell><mxCell id="6" parent="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1" style="circuitContainer" value="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1" vertex="1"><mxGeometry as="geometry" height="100.0" width="50.0" x="224.5" y="366.0"/></mxCell><mxCell id="8" parent="6" style="sequenceFeatureGlyph" value="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8/1" vertex="1"><mxGeometry as="geometry" height="100.0" width="50.0"/></mxCell><mxCell id="7" parent="6" style="backbone" vertex="1"><mxGeometry as="geometry" height="1.0" width="50.0" y="50.0"/></mxCell><mxCell id="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8/1" parent="1" style="componentViewCell" vertex="1"><mxGeometry as="geometry"/></mxCell><mxCell id="9" parent="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8/1" style="circuitContainer" value="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8/1" vertex="1"><mxGeometry as="geometry"/></mxCell><mxCell id="10" parent="9" style="backbone" vertex="1"><mxGeometry as="geometry"/></mxCell></root></mxGraphModel>`);