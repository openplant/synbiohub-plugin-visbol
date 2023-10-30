const express = require('express')
const { setSvgGlyphs, getVisbolSequence } = require('./src/lib/visbol-glyphs')
const { createRendering, createError, createSVG } = require('./templates.js')
const { getSBOLFromUrl, convertSBOLtoMxGraph, mxGraphToSVG } = require('./tools.js')
const { createDisplay, prepareDisplay } = require('visbol')
const path = require('path')

// this library is useful for checking circular references
// const util = require("util");

// set up server
const app = express()
const port = 5012
const address = '0.0.0.0'

app.use(express.json())

// ACCESS: PUBLIC
// Route = /Status
// Returns whether plugin is up and running
app.get('/Status', (req, res) => {
  console.log('Status checked')
  res.status(200).send('VisBOL plugin up and running')
})

// ACCESS: PUBLIC
// Route = /Evaluate
// Returns whether type is compatible with plugin
// (this needs to be developed more, don't know all
// the types VisBOL is compatible with)
app.post('/Evaluate', (req, res) => {
  const type = req.body.type
  console.log(`Evaluating ${type}`)
  if (type == 'Component' || type == 'ComponentDefinition' || type == 'Layout')
    res.status(200).send(`The type ${type} is compatible with the VisBOL plugin`)
  else res.status(415).send(`The type ${type} is NOT compatible with the VisBOL plugin`)
})

// ACCESS: PUBLIC
// Route = /Run
// Returns html for VisBOL rendering
// in a web application
app.post('/Run', async (req, res) => {
  let url = req.body.complete_sbol
  const type = req.body.type
  const hostAddress = 'synbiohub.accurat.io:5003' //req.get('host')
  // if (type === 'Layout') url = url.replace('https://synbiohub.org', 'http://localhost:7777')
  console.log(`Run url=${url} : host address=${hostAddress}`)

  try {
    const sbol = await getSBOLFromUrl(url)
    if (type !== 'Layout') {
      const displayList = await createDisplay(sbol)
      const visbolSequence = getVisbolSequence(displayList)
      displayList.visbolSequence = visbolSequence

      const display = prepareDisplay(displayList)
      display.renderGlyphs()

      const properties = {
        display,
        visbolSequence,
      }

      const computedProperties = setSvgGlyphs(removeCircularReferences(properties))

      res.send(createRendering(computedProperties, hostAddress))
    } else {
      const mxGraph = await convertSBOLtoMxGraph(sbol)
      const svg = mxGraphToSVG(mxGraph)
      const properties = {
        svg: svg.xml,
        width: svg.width,
        height: svg.height,
      }
      res.send(createSVG(properties, hostAddress))
    }
  } catch (error) {
    console.error(error)
    res.send(createError(error))
  }
})

// ACCESS: PUBLIC
// Route = /visbol.js
// Gets built rendering file to be sent
// to browser
app.get('/visbol.js', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'dist', 'main.js'))
})

// start server
app.listen(port, () => console.log(`VisBOL plugin listening at http://${address}:${port}`))

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#examples
// with this function you can check where are circular dependencies

function removeCircularReferences(properties) {
  properties.display.toPlace.forEach((item, i) => {
    if (item.hooks.link) {
      if (item) {
        item.hooks.link.startGlyph = '[Circular]'
        item.hooks.link.destinationGlyph.hookedTo.startGlyph = '[Circular]'
      }
    }
  })

  return properties
}
