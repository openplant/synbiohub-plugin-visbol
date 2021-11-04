import express from 'express';


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
app.post('/Run', (req, res) => {
   const url = req.body.complete_sbol;
   const hostAddress = req.get("host");
   console.log(`Run url=${url} : host address=${hostAddress}`);
   res.status(200).send("Run VisBOL on sbol file");
});

// start server
app.listen(port, () => console.log(`VisBOL plugin listening at http://${address}:${port}`));