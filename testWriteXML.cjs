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

console.log(xml);