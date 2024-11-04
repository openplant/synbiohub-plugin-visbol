const React = require('react')
const { render } = require('react-dom')
const Renderer = require('visbol-react').default
const { VisbolRenderer } = require('./VisbolRenderer.jsx')

const data = window.__DATA_ACCURAT_VISBOL__

console.log('__DATA_ACCURAT_VISBOL__', data)

if (data.svg) {
  render(
    <Renderer svg={data.svg} width={data.width} height={data.height} />,
    document.getElementById('root--accurat-visbol')
  )
} else {
  render(
    <VisbolRenderer display={data.display} visbolSequence={data.visbolSequence} />,
    document.getElementById('root--accurat-visbol')
  )
}
