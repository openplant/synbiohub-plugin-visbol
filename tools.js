// functions used in server.js

import axios from "axios";

export async function getSBOLFromUrl(fileUrl) {
   const response = await axios.get(fileUrl, {
      headers: {
         Accept: 'text/plain',
      }
   });
   // const sbol = await response.text();
   return response.data;
}