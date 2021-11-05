import express from 'express';
import { createRendering, createError } from './templates.js';
import { getSBOLFromUrl } from './tools.js';
import { createDisplay, prepareDisplay } from 'visbol';

// set up server
const app = express();
const port = 5000;
const address = "localhost";

app.use(express.json());


// ACCESS: PUBLIC
// Route = /Status
app.get('/Status', (req, res) => {
   console.log('Status checked');
   res.status(200).send("VisBOL plugin up and running");
});

// ACCESS: PUBLIC
// Route = /Evaluate
app.post('/Evaluate', (req, res) => {
   const type = req.body.type;
   console.log(`Evaluating ${type}`);
   res.status(200).send("Type is compatible with the VisBOL plugin");
});

// ACCESS: PUBLIC
//  Route = /Run
app.post('/Run', async (req, res) => {
   const url = req.body.complete_sbol;
   const hostAddress = req.get("host");
   console.log(`Run url=${url} : host address=${hostAddress}`);
   try {
      const sbol = await getSBOLFromUrl(url);
      const displayList = await createDisplay(sbol);
      const preparedDisplay = prepareDisplay(displayList);
      
      res.send(createRendering(properties, hostAddress));
   }
   catch (error) {
      res.send(createError(error));
   }
});

// start server
app.listen(port, () => console.log(`VisBOL plugin listening at http://${address}:${port}`));