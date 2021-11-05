// functions used in server.js

export function getSBOLFromFile(fileUrl, request) {
   return new Promise((resolve, reject) => {
      request.get(fileUrl, (error, response, body) => {
         if (error || response.statusCode !== 200) {
            console.log(`Error in getting SBOL: ${error}`)
            return reject(error);
         }
         return resolve(body);
      })
   });
}