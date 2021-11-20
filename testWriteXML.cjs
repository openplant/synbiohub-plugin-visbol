const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();

global.window = dom.window;
global.document = window.document;
global.XMLSerializer = window.XMLSerializer;
global.navigator = window.navigator;

const mxgraph = require("mxgraph")({
   mxImageBasePath: "./src/images",
   mxBasePath: "./src"
});

const { mxGraph, mxCodec, mxUtils, mxConstants, mxSVGCanvas2D } = mxgraph;

function makeHelloWorld() {
   const graph = new mxGraph();

   var parent = graph.getDefaultParent();

   try {
      var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
      var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
      var e1 = graph.insertEdge(parent, null, '', v1, v2);
    } catch(error) {
       console.log(`error: ${error}`)
    }
    return graph;
}

const helloWorldGraph = makeHelloWorld();

function graphToXML(graph) {
   var encoder = new mxCodec();
   var result = encoder.encode(graph.getModel());
   return mxUtils.getXml(result);
}

const xml = graphToXML(helloWorldGraph);

const xml1 = 
`<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:prov="http://www.w3.org/ns/prov#" xmlns:sbol="http://sbols.org/v2#" xmlns:xsd="http://www.w3.org/2001/XMLSchema#dateTime/" xmlns:om="http://www.ontology-of-units-of-measure.org/resource/om-2/" xmlns:synbiohub="http://synbiohub.org#" xmlns:sbh="http://wiki.synbiohub.org/wiki/Terms/synbiohub#" xmlns:sybio="http://www.sybio.ncl.ac.uk#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:ncbi="http://www.ncbi.nlm.nih.gov#" xmlns:igem="http://wiki.synbiohub.org/wiki/Terms/igem#" xmlns:genbank="http://www.ncbi.nlm.nih.gov/genbank#" xmlns:gbconv="http://sbols.org/genBankConversion#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:obo="http://purl.obolibrary.org/obo/" xmlns:ns0="https://sbolcanvas.org/">
  <sbol:ModuleDefinition rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1/1">
    <sbol:persistentIdentity rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1"/>
    <sbol:displayId>module1</sbol:displayId>
    <sbol:version>1</sbol:version>
    <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1/1"/>
    <sbh:ownedBy rdf:resource="https://synbiohub.org/user/benjhatch3"/>
    <sbol:functionalComponent>
      <sbol:FunctionalComponent rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1/id6_7/1">
        <sbol:persistentIdentity rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1/id6_7"/>
        <sbol:displayId>id6_7</sbol:displayId>
        <sbol:version>1</sbol:version>
        <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1/1"/>
        <sbh:ownedBy rdf:resource="https://synbiohub.org/user/benjhatch3"/>
        <sbol:definition rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1"/>
        <sbol:access rdf:resource="http://sbols.org/v2#public"/>
        <sbol:direction rdf:resource="http://sbols.org/v2#inout"/>
      </sbol:FunctionalComponent>
    </sbol:functionalComponent>
  </sbol:ModuleDefinition>
  <sbol:ComponentDefinition rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1">
    <sbol:persistentIdentity rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6"/>
    <sbol:displayId>id6</sbol:displayId>
    <sbol:version>1</sbol:version>
    <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1"/>
    <sbh:ownedBy rdf:resource="https://synbiohub.org/user/benjhatch3"/>
    <sbol:type rdf:resource="http://www.biopax.org/release/biopax-level3.owl#DnaRegion"/>
    <sbol:role rdf:resource="http://identifiers.org/so/SO:0000110"/>
    <sbol:component>
      <sbol:Component rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/id8_1/1">
        <sbol:persistentIdentity rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/id8_1"/>
        <sbol:displayId>id8_1</sbol:displayId>
        <sbol:version>1</sbol:version>
        <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1"/>
        <sbh:ownedBy rdf:resource="https://synbiohub.org/user/benjhatch3"/>
        <sbol:definition rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8/1"/>
        <sbol:access rdf:resource="http://sbols.org/v2#public"/>
      </sbol:Component>
    </sbol:component>
    <sbol:sequenceAnnotation>
      <sbol:SequenceAnnotation rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/id6Annotation0/1">
        <sbol:persistentIdentity rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/id6Annotation0"/>
        <sbol:displayId>id6Annotation0</sbol:displayId>
        <sbol:version>1</sbol:version>
        <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1"/>
        <sbh:ownedBy rdf:resource="https://synbiohub.org/user/benjhatch3"/>
        <sbol:location>
          <sbol:GenericLocation rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/id6Annotation0/location0/1">
            <sbol:persistentIdentity rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/id6Annotation0/location0"/>
            <sbol:displayId>location0</sbol:displayId>
            <sbol:version>1</sbol:version>
            <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1"/>
            <sbh:ownedBy rdf:resource="https://synbiohub.org/user/benjhatch3"/>
            <sbol:orientation rdf:resource="http://sbols.org/v2#inline"/>
          </sbol:GenericLocation>
        </sbol:location>
        <sbol:component rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/id8_1/1"/>
      </sbol:SequenceAnnotation>
    </sbol:sequenceAnnotation>
  </sbol:ComponentDefinition>
  <sbol:ComponentDefinition rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8/1">
    <sbol:persistentIdentity rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8"/>
    <sbol:displayId>id8</sbol:displayId>
    <sbol:version>1</sbol:version>
    <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8/1"/>
    <sbh:ownedBy rdf:resource="https://synbiohub.org/user/benjhatch3"/>
    <sbol:type rdf:resource="http://www.biopax.org/release/biopax-level3.owl#DnaRegion"/>
    <sbol:role rdf:resource="http://identifiers.org/so/SO:0000804"/>
  </sbol:ComponentDefinition>
  <ns0:Layout rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1_Layout/1">
    <sbol:persistentIdentity rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1_Layout"/>
    <sbol:displayId>module1_Layout</sbol:displayId>
    <sbol:version>1</sbol:version>
    <ns0:id6_Reference rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6_Layout/1"/>
    <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1_Layout/1"/>
    <sbh:ownedBy rdf:resource="https://synbiohub.org/user/benjhatch3"/>
    <ns0:nodeGlyph>
      <ns0:NodeGlyph rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1_Layout_NodeGlyph_7/1">
        <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1_Layout/1"/>
        <ns0:displayId>id6_7</ns0:displayId>
        <ns0:height>100.0</ns0:height>
        <ns0:width>50.0</ns0:width>
        <ns0:x>224.5</ns0:x>
        <ns0:y>366.0</ns0:y>
      </ns0:NodeGlyph>
    </ns0:nodeGlyph>
    <ns0:objectRef rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/module1/1"/>
  </ns0:Layout>
  <ns0:Layout rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6_Layout/1">
    <sbol:persistentIdentity rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6_Layout"/>
    <sbol:displayId>id6_Layout</sbol:displayId>
    <sbol:version>1</sbol:version>
    <ns0:id8_Reference rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8_Layout/1"/>
    <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6_Layout/1"/>
    <sbh:ownedBy rdf:resource="https://synbiohub.org/user/benjhatch3"/>
    <ns0:nodeGlyph>
      <ns0:NodeGlyph rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6_Layout_NodeGlyph_9/1">
        <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6_Layout/1"/>
        <ns0:displayId>id8_1</ns0:displayId>
        <ns0:height>100.0</ns0:height>
        <ns0:width>50.0</ns0:width>
        <ns0:x>0.0</ns0:x>
        <ns0:y>0.0</ns0:y>
      </ns0:NodeGlyph>
    </ns0:nodeGlyph>
    <ns0:nodeGlyph>
      <ns0:NodeGlyph rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6_Layout_NodeGlyph_7/1">
        <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6_Layout/1"/>
        <ns0:displayId>container</ns0:displayId>
        <ns0:height>100.0</ns0:height>
        <ns0:width>50.0</ns0:width>
        <ns0:x>224.5</ns0:x>
        <ns0:y>366.0</ns0:y>
      </ns0:NodeGlyph>
    </ns0:nodeGlyph>
    <ns0:nodeGlyph>
      <ns0:NodeGlyph rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6_Layout_NodeGlyph_8/1">
        <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6_Layout/1"/>
        <ns0:displayId>backbone</ns0:displayId>
        <ns0:height>1.0</ns0:height>
        <ns0:width>50.0</ns0:width>
        <ns0:x>0.0</ns0:x>
        <ns0:y>50.0</ns0:y>
      </ns0:NodeGlyph>
    </ns0:nodeGlyph>
    <ns0:objectRef rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id6/1"/>
  </ns0:Layout>
  <ns0:Layout rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8_Layout/1">
    <sbol:persistentIdentity rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8_Layout"/>
    <sbol:displayId>id8_Layout</sbol:displayId>
    <sbol:version>1</sbol:version>
    <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8_Layout/1"/>
    <sbh:ownedBy rdf:resource="https://synbiohub.org/user/benjhatch3"/>
    <ns0:nodeGlyph>
      <ns0:NodeGlyph rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8_Layout_NodeGlyph_10/1">
        <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8_Layout/1"/>
        <ns0:displayId>container</ns0:displayId>
        <ns0:height>0.0</ns0:height>
        <ns0:width>0.0</ns0:width>
        <ns0:x>0.0</ns0:x>
        <ns0:y>0.0</ns0:y>
      </ns0:NodeGlyph>
    </ns0:nodeGlyph>
    <ns0:nodeGlyph>
      <ns0:NodeGlyph rdf:about="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8_Layout_NodeGlyph_11/1">
        <sbh:topLevel rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8_Layout/1"/>
        <ns0:displayId>backbone</ns0:displayId>
        <ns0:height>0.0</ns0:height>
        <ns0:width>0.0</ns0:width>
        <ns0:x>0.0</ns0:x>
        <ns0:y>0.0</ns0:y>
      </ns0:NodeGlyph>
    </ns0:nodeGlyph>
    <ns0:objectRef rdf:resource="https://synbiohub.org/user/benjhatch3/SBOLCanvasPlugin/id8/1"/>
  </ns0:Layout>
</rdf:RDF>`

const writeXML = encodeURIComponent(xml1);
console.log(writeXML);