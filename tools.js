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


const xml = `<output><fontfamily family="Arial,Helvetica"/><fontsize size="11"/><shadowcolor color="gray"/><shadowalpha alpha="1"/><shadowoffset dx="2" dy="3"/><translate dx="-254" dy="-364"/><scale scale="1"/><save/><scale scale="1"/><rect x="256" y="366" w="50" h="100"/><fillstroke/><restore/><save/><scale scale="1"/><fillcolor color="#C3D9FF"/><strokecolor color="#000000"/><strokewidth width="2"/><begin/><move x="256" y="416.5"/><line x="306" y="416.5"/><stroke/><restore/><save/><scale scale="1"/><fillcolor color="#ffffff"/><strokecolor color="#000000"/><strokewidth width="2"/><strokewidth width="3"/><linejoin join="round"/><linecap cap="round"/><begin/><move x="264.33" y="399.33"/><line x="264.33" y="416"/><line x="297.67" y="416"/><line x="297.67" y="399.33"/><close/><fillstroke/><scale scale="1"/><fillcolor color="none"/><strokecolor color="none"/><strokewidth width="1"/><fillcolor color="#ffff00"/><strokewidth width="0.11"/><strokecolor color="#000000"/><begin/><move x="288.2" y="460.24"/><line x="281" y="460.24"/><line x="273.8" y="460.24"/><line x="277.4" y="454"/><line x="281" y="447.76"/><line x="284.6" y="454"/><close/><fillstroke/><strokewidth width="0.11"/><fontsize size="8.6414"/><fontfamily family="sans-serif"/><fontfamily family=""/><text x="279.07" y="462.03" w="0" h="0" str="?" align="left" valign="bottom" wrap="0" format="" clip="0" rotation="0"/><restore/><save/><scale scale="1"/><fillcolor color="#ffffff"/><strokecolor color="#000000"/><fontsize size="14"/><text x="280.5" y="469" w="43" h="97" str="id3" align="center" valign="top" wrap="0" format="" overflow="visible" clip="0" rotation="0"/><restore/></output>`;

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
         xml: encodeURIComponent(xml)
      },
      responseType: 'stream'
   });
   const download = response.data.pipe(writer);
   download.on('finish', () => console.log('file downloaded'));
}