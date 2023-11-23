const serialize = require('serialize-javascript')

module.exports = {
  // returning the visbol rendering
  createRendering: (properties, hostAddress) => {
    const content = `
      <script type="text/javascript">window.__DATA_ACCURAT_VISBOL__ = ${serialize(
        properties
      )}</script>
      <script type="text/javascript" src="//${hostAddress}/visbol.js" charset="utf-8"></script>
      `

    return populateTemplate(content)
  },

  // returning an error
  createError: (error) => {
    const content = `
      Error while parsing the file for VisBOL rendering:
      <br/>
      <pre>${error.stack}</pre>
      `
    console.error(error)

    return populateTemplate(content)
  },

  createSVG: (properties, hostAddress) => {
    const content = `
      <script type="text/javascript">window.__DATA_ACCURAT_VISBOL__ = ${serialize(
        properties
      )}</script>
      <script type="text/javascript" src="//${hostAddress}/visbol.js" charset="utf-8"></script>
      <div>
         ${properties.svg}
      </div>
      `

    return populateTemplate(content)
  },
}

// template html to send
const populateTemplate = (content) =>
  `
<!doctype html>
<html>
   <head><title>VisBOL</title></head>
   <body>
      <div id="root--accurat-visbol">
        ${content}
      </div>
   </body>
</html>
`
