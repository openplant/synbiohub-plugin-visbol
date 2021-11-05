// functions used in server.js

const axios = require("axios");

async function getSBOLFromUrl(fileUrl) {
   const response = await axios.get(fileUrl);
   return response.data;
}

module.exports = { getSBOLFromUrl };