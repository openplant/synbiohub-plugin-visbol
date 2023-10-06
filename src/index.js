const React = require('react')
const { render } = require('react-dom')
const Renderer = require('visbol-react').default
const { VisbolRenderer } = require('./VisbolRenderer.jsx')

const data = window.__INITIAL_STATE__

if (data.svg) {
  render(
    <Renderer svg={data.svg} width={data.width} height={data.height} />,
    document.getElementById('plugin-visual-visbol')
  )
} else {
  render(
    <VisbolRenderer display={data.display} visbolSequence={data.visbolSequence} />,
    document.getElementById('plugin-visual-visbol')
  )
}
