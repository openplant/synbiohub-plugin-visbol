/**
   * Decodes the given string (xml) representation of a graph
   * and uses it to replace the current graph
   */
 export default function setGraphToXML(graphString) {
   GraphBase.unFormatedCells.clear();
   this.graph.home();
   this.graph.getModel().clear();

   const doc = mx.mxUtils.parseXml(graphString);
   const codec = new mx.mxCodec(doc);
   codec.decode(doc.documentElement, this.graph.getModel());

   // The child of cell 1 that isn't a view cell points to the root view
   const cell1 = this.graph.getModel().getCell("1");
   let viewCells = this.graph.getModel().getChildren(cell1);
   let rootViewCell;
   for (let child of viewCells) {
     if (!child.isViewCell()) {
       rootViewCell = this.graph.getModel().getCell(child.getValue());
       this.graph.getModel().remove(child);
       break;
     }
   }
   this.graph.enterGroup(rootViewCell);
   this.viewStack = [];
   this.viewStack.push(rootViewCell);
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

   this.fitCamera();

   this.metadataService.setComponentDefinitionMode(this.graph.getCurrentRoot().isComponentView());

   // top level compDefs may not have cells referencing them, but they still end up with view cells for other reasons
   this.trimUnreferencedCells();

   this.editor.undoManager.clear();

   this.graph.refresh(); // for some reason unformatted edges don't render correctly the first time without this
 }