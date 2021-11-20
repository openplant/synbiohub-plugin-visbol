export default function exportSVG() {
   var background = '#ffffff';
   var scale = 1;
   var border = 1;

   var imgExport = new mx.mxImageExport();
   var bounds = this.graph.getGraphBounds();
   var vs = this.graph.view.scale;

   // Prepares SVG document that holds the output
   var svgDoc = mx.mxUtils.createXmlDocument();
   var root = (svgDoc.createElementNS != null) ?
      svgDoc.createElementNS(mx.mxConstants.NS_SVG, 'svg') : svgDoc.createElement('svg');

   if (background != null) {
      if (root.style != null) {
         root.style.backgroundColor = background;
      } else {
         root.setAttribute('style', 'background-color:' + background);
      }
   }

   if (svgDoc.createElementNS == null) {
      root.setAttribute('xmlns', mx.mxConstants.NS_SVG);
      root.setAttribute('xmlns:xlink', mx.mxConstants.NS_XLINK);
   } else {
      // KNOWN: Ignored in IE9-11, adds namespace for each image element instead. No workaround.
      root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', mx.mxConstants.NS_XLINK);
   }

   root.setAttribute('width', (Math.ceil(bounds.width * scale / vs) + 2 * border) + 'px');
   root.setAttribute('height', (Math.ceil(bounds.height * scale / vs) + 2 * border) + 'px');
   root.setAttribute('version', '1.1');

   // Adds group for anti-aliasing via transform
   var group = (svgDoc.createElementNS != null) ? svgDoc.createElementNS(mx.mxConstants.NS_SVG, 'g') : svgDoc.createElement('g');
   group.setAttribute('transform', 'translate(0.5,0.5)');
   root.appendChild(group);
   svgDoc.appendChild(root);

   // Renders graph. Offset will be multiplied with state's scale when painting state.
   var svgCanvas = new mx.mxSvgCanvas2D(group);
   svgCanvas.translate(Math.floor((border / scale - bounds.x) / vs), Math.floor((border / scale - bounds.y) / vs));
   svgCanvas.scale(scale / vs);

   // Displayed if a viewer does not support foreignObjects (which is needed to HTML output)
   svgCanvas.foAltText = '[Not supported by viewer]';
   imgExport.drawState(this.graph.getView().getState(this.graph.getCurrentRoot()), svgCanvas);

   var xml = encodeURIComponent(mx.mxUtils.getXml(root));
   new mx.mxXmlRequest('http://localhost:8080/SBOLCanvasBackend/echo', 'filename=' + filename + '.svg&format=svg' + '&xml=' + xml).simulate(document, '_blank');
}