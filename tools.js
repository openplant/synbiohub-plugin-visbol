const axios = require('axios')
const getImageOutput = require('./CanvasBuild/getImageOutput.js').default

module.exports = {
  getSBOLFromUrl: async (fileUrl) => {
    console.log(`Getting SBOL from URL...`)
    const response = await axios.get(fileUrl, {
      headers: {
        Accept: 'text/plain',
      },
    })
    const xml = response.data
    if (!xml.startsWith('<?xml')) {
      throw new Error(`Document received is not in XML format!\n${xml.slice(0, 100)}`)
    }
    console.log(`SBOL obtained with response code ${response.status}, content of ${response.data.length} bytes`)
    return xml
  },

  convertSBOLtoMxGraph: async (sbol) => {
    console.log(`Getting MxGraph from SbolCanvas...`)
    const response = await axios.post('https://sbolcanvas.org/api/convert/toMxGraph', sbol).catch((err) => {
      console.log(err.response)
    })
    console.log(`MxGraph obtained of ${response.data.length} bytes`)
    return response.data
  },

  mxGraphToSVG: (mxGraph) => {
    return getImageOutput(mxGraph)
  },
}
