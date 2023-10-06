'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.CustomShapes = void 0
const graph_base_js_1 = require('./graph-base.js')
class CustomShapes {
  static initalize(graphService) {
    this.graphService = graphService
    this.initalizeSequenceFeatureShape()
  }
  static initalizeSequenceFeatureShape() {
    // mxShape extensions necessary for indicators
    function SequenceFeatureShape(stencil) {
      graph_base_js_1.mx.mxShape.call(this, stencil)
    }
    this.SequenceFeatureShape = SequenceFeatureShape
    graph_base_js_1.mx.mxUtils.extend(SequenceFeatureShape, graph_base_js_1.mx.mxShape)
    let oldInit = graph_base_js_1.mx.mxShape.prototype.init
    SequenceFeatureShape.prototype.init = function (container) {
      oldInit.apply(this, arguments)
      if (this.state != null && this.state.cell.isSequenceFeatureGlyph()) {
        this.composite = new graph_base_js_1.mx.mxShape(
          graph_base_js_1.mx.mxStencilRegistry.getStencil('composite')
        )
        this.composite.dialect = this.dialect
        this.composite.init(this.node)
        this.variant = new graph_base_js_1.mx.mxShape(
          graph_base_js_1.mx.mxStencilRegistry.getStencil('variant')
        )
        this.variant.dialect = this.dialect
        this.variant.init(this.node)
        this.error = new graph_base_js_1.mx.mxShape(
          graph_base_js_1.mx.mxStencilRegistry.getStencil('error')
        )
        this.error.dialect = this.dialect
        this.error.init(this.node)
      }
    }
    let oldRedraw = graph_base_js_1.mx.mxShape.prototype.redraw
    SequenceFeatureShape.prototype.redraw = function () {
      if (this.composite != null) {
        this.composite.fill = this.fill
        this.composite.stroke = this.stroke
        this.composite.direction = this.indicatorDirection
      }
      if (this.variant != null) {
        this.variant.fill = this.stroke
        this.variant.stroke = this.stroke
        this.variant.facing = this.indicatorDirection
      }
      if (this.error != null) {
        this.error.direction = this.state.style.direction
      }
      oldRedraw.apply(this, arguments)
    }
    // who knows why they only implemented this for labels
    SequenceFeatureShape.prototype.paintComposite = function (c, x, y, w, h) {
      if (this.composite != null && CustomShapes.graphService.isComposite(this.state.cell)) {
        this.composite.bounds = this.getCompositeBounds(x, y, w, h)
        this.composite.paint(c)
      }
      if (this.variant != null && CustomShapes.graphService.isVariant(this.state.cell)) {
        this.variant.bounds = this.getVariantBounds(x, y, w, h)
        this.variant.paint(c)
      } else if (this.error != null && !CustomShapes.graphService.hasSequence(this.state.cell)) {
        this.error.bounds = this.getErrorBounds(x, y, w, h)
        this.error.paint(c)
      }
    }
    SequenceFeatureShape.prototype.getCompositeBounds = function (x, y, w, h) {
      var width = 46
      var height = 8
      x += (w - width) / 2 // align in the center
      y += h - height - 25 // align bottom, but push up a bit
      return new graph_base_js_1.mx.mxRectangle(x, y, width, height)
    }
    SequenceFeatureShape.prototype.getVariantBounds = function (x, y, w, h) {
      var width = 15
      var height = 15
      var spacing = 2
      x += (w - width) / 2 // allign in the center
      y += h - height - spacing // align bottom
      return new graph_base_js_1.mx.mxRectangle(x, y, width, height)
    }
    SequenceFeatureShape.prototype.getErrorBounds = function (x, y, w, h) {
      var width = 20
      var height = 20
      var spacing = 2
      x += (w - width) / 2
      y += h - height - spacing
      return new graph_base_js_1.mx.mxRectangle(x, y, width, height)
    }
  }
}
exports.CustomShapes = CustomShapes
