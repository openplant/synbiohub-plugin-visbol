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

const { mxGraph, mxCodec, mxUtils, mxConstants, mxSVGCanvas2D } = mxgraph;

function makeHelloWorld(xml) {
   const graph = new mxGraph();
   graph.home();

   const doc = mxUtils.parseXml(xml);
   const codec = new mxCodec(doc);
   codec.decode(doc.documentElement, graph.getModel());

   // The child of cell 1 that isn't a view cell points to the root view
   const cell1 = graph.getModel().getCell("1");
   let viewCells = graph.getModel().getChildren(cell1);
   let rootViewCell;
   if (viewCells) {
    for (let child of viewCells) {
      if (!child.isViewCell()) {
        rootViewCell = graph.getModel().getCell(child.getValue());
        graph.getModel().remove(child);
        break;
      }
    }
   }
   graph.enterGroup(rootViewCell);
   const viewStack = [];
   viewStack.push(rootViewCell);
   console.log(viewStack);
   /*
   this.selectionStack = [];

   let children = this.graph.getModel().getChildren(this.graph.getDefaultParent());
   if (children) {
     children.forEach(element => {
       if (element.isCircuitContainer())
         element.refreshCircuitContainer(this.graph);
     });
   }

   if (GraphBase.unFormatedCells.size > 0) {
     console.log("FORMATTING !!!!!!!!!!!!!!!!");
     this.autoFormat(GraphBase.unFormatedCells);
     GraphBase.unFormatedCells.clear();
   }

   // this.fitCamera();

   // this.metadataService.setComponentDefinitionMode(this.graph.getCurrentRoot().isComponentView());

   // top level compDefs may not have cells referencing them, but they still end up with view cells for other reasons
   // this.trimUnreferencedCells();

   graph.refresh(); // for some reason unformatted edges don't render correctly the first time without this

   var parent = graph.getDefaultParent();

   try {
      var v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
      var v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
      var e1 = graph.insertEdge(parent, null, '', v1, v2);
    } catch(error) {
       console.log(`error: ${error}`)
    }
    return graph;
    */
}

const testXML = `<output><fontfamily family="Arial,Helvetica"/><fontsize size="11"/><shadowcolor color="gray"/><shadowalpha alpha="1"/><shadowoffset dx="2" dy="3"/><translate dx="-254" dy="-364"/><scale scale="1"/><save/><scale scale="1"/><rect x="256" y="366" w="50" h="100"/><fillstroke/><restore/><save/><scale scale="1"/><fillcolor color="#C3D9FF"/><strokecolor color="#000000"/><strokewidth width="2"/><begin/><move x="256" y="416.5"/><line x="306" y="416.5"/><stroke/><restore/><save/><scale scale="1"/><fillcolor color="#ffffff"/><strokecolor color="#000000"/><strokewidth width="2"/><strokewidth width="3"/><linejoin join="round"/><linecap cap="round"/><begin/><move x="264.33" y="399.33"/><line x="264.33" y="416"/><line x="297.67" y="416"/><line x="297.67" y="399.33"/><close/><fillstroke/><scale scale="1"/><fillcolor color="none"/><strokecolor color="none"/><strokewidth width="1"/><fillcolor color="#ffff00"/><strokewidth width="0.11"/><strokecolor color="#000000"/><begin/><move x="288.2" y="460.24"/><line x="281" y="460.24"/><line x="273.8" y="460.24"/><line x="277.4" y="454"/><line x="281" y="447.76"/><line x="284.6" y="454"/><close/><fillstroke/><strokewidth width="0.11"/><fontsize size="8.6414"/><fontfamily family="sans-serif"/><fontfamily family=""/><text x="279.07" y="462.03" w="0" h="0" str="?" align="left" valign="bottom" wrap="0" format="" clip="0" rotation="0"/><restore/><save/><scale scale="1"/><fillcolor color="#ffffff"/><strokecolor color="#000000"/><fontsize size="14"/><text x="280.5" y="469" w="43" h="97" str="id3" align="center" valign="top" wrap="0" format="" overflow="visible" clip="0" rotation="0"/><restore/></output>`;
console.log(encodeURIComponent(testXML));
makeHelloWorld();