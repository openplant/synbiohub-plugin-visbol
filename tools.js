// functions used in server.js

const axios = require('axios')
const fs = require('fs')
const path = require('path')
const getImageOutput = require('./CanvasBuild/getImageOutput.js').default

module.exports = {
  getSBOLFromUrl: async (fileUrl) => {
    const response = await axios.get(fileUrl, {
      headers: {
        Accept: 'text/plain',
      },
    })
    return response.data
  },

  convertSBOLtoMxGraph: async (sbol) => {
    const response = await axios.post('https://sbolcanvas.org/api/convert/toMxGraph', sbol)
    return response.data
  },

  mxGraphToSVG: (mxGraph) => {
    return getImageOutput(mxGraph)
  },
}
