import express from 'express';


// set up server
const app = express();
const port = 5000;
const address = "localhost";

app.use(express.json());


// ACCESS: PUBLIC
// Route = /Status
app.get('/Status', (req, res) => {
   console.log('status checked');
   res.status(200).send("VisBOL plugin up and running");
});

app.listen(port, () => console.log(`VisBOL plugin listening at http://${address}:${port}`));