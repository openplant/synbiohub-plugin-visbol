const express = require('express')
const { getVisbolSequence } = require('./src/lib/visbol-glyphs')
const { createRendering, createError } = require('./templates.js')
const { getSBOLFromUrl } = require('./tools.js')
const { createDisplay, prepareDisplay } = require('visbol')
const { readFile } = require('fs/promises')
const path = require('path')

// this library is useful for checking circular references
// const util = require("util");

// set up server
const app = express()
const port = 5012
const address = '0.0.0.0'

app.use(express.json())

// ACCESS: PUBLIC
// Returns whether plugin is up and running
app.get('/Status', (req, res) => {
  console.log('Status checked')
  res.status(200).send('VisBOL plugin up and running')
})

// ACCESS: PUBLIC
// Endpoint used to test the /Run POST endpoint with several inputs.
app.get('/test', (req, res) => {
  readFile(path.join(path.resolve(), './templates/test.html'), 'utf-8').then(html => {
    res.status(200).send(html)
  })
})

// ACCESS: PUBLIC
// Endpoint used to get sample datasets for the /Test page.
app.get('/test/sample-data/:file/:anything', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'sample-data', req.params.file + '.xml'))
})

// ACCESS: PUBLIC
// Returns whether type is compatible with plugin
// (this needs to be developed more, don't know all
// the types VisBOL is compatible with)
app.post('/Evaluate', (req, res) => {
  const type = req.body.type
  console.log(`Evaluating ${type}`)
  if (type == 'Component' || type == 'ComponentDefinition')
    res.status(200).send(`The type ${type} is compatible with the VisBOL plugin`)
  else res.status(415).send(`The type ${type} is NOT compatible with the VisBOL plugin`)
})

// ACCESS: PUBLIC
// Returns html for VisBOL rendering
// in a web application
app.post('/Run', async (req, res) => {
  const url = req.body.complete_sbol
  const type = req.body.type
  const hostAddress = req.get('host')
  console.log(`Run url=${url} // hostAddress=${hostAddress} // type=${type}`)

  try {
    const sbol = await getSBOLFromUrl(url)
    const displayList = await createDisplay(sbol)
    const visbolSequence = getVisbolSequence(displayList)
    displayList.visbolSequence = visbolSequence

    const display = prepareDisplay(displayList)
    display.renderGlyphs()

    const properties = {
      display,
      visbolSequence,
    }

    const computedProperties = /* setSvgGlyphs */(removeCircularReferences(properties))

    res.send(createRendering({
      visbolSequence: computedProperties.visbolSequence,
    }, hostAddress))
  } catch (error) {
    console.error(error)
    res.send(createError(error))
  }
})

// ACCESS: PUBLIC
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
