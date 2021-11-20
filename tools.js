// functions used in server.js

import axios from "axios";
import fs from 'fs';
import path from 'path';

export async function getSBOLFromUrl(fileUrl) {
   const response = await axios.get(fileUrl, {
      headers: {
         Accept: 'text/plain',
      }
   });
   return response.data;
}

export async function convertSBOLtoMxGraph(sbol) {
   const response = await axios.post('http://localhost:8080/SBOLCanvasBackend/convert/toMxGraph', sbol);
   return response.data;
}

export async function mxGraphToPNG(mxGraph) {
   const __dirname = path.resolve();
   const localFilePath = path.resolve(__dirname, 'png', 'visbolCanvas.png');
   const writer = fs.createWriteStream(localFilePath);
   const response = await axios.post('http://localhost:8080/SBOLCanvasBackend/export', null, {
      params: {
         filename: 'visbolCanvas.png',
         format: 'png',
         bg: '#ffffff',
         w: 150,
         h: 150,
         xml: encodeURIComponent(mxGraph)
      },
      responseType: 'stream'
   });
   const download = response.data.pipe(writer);
   download.on('finish', () => console.log('file downloaded'));
}