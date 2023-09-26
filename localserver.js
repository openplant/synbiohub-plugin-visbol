const express = require("express");
const { createRendering, createError, createSVG } = require("./templates.js");
const {
  getSBOLFromUrl,
  convertSBOLtoMxGraph,
  mxGraphToSVG,
} = require("./tools.js");
const { createDisplay, prepareDisplay } = require("visbol");
const path = require("path");

// set up server
const app = express();
const port = 5003;
const address = "localhost";

app.use(express.json());

// ACCESS: PUBLIC
// Route = /Status
// Returns whether plugin is up and running
app.get("/Status", (req, res) => {
  console.log("Status checked");
  res.status(200).send("VisBOL plugin up and running");
});

// ACCESS: PUBLIC
// Route = /Evaluate
// Returns whether type is compatible with plugin
// (this needs to be developed more, don't know all
// the types VisBOL is compatible with)
app.post("/Evaluate", (req, res) => {
  const type = req.body.type;
  console.log(`Evaluating ${type}`);
  if (type == "Component" || type == "ComponentDefinition" || type == "Layout")
    res
      .status(200)
      .send(`The type ${type} is compatible with the VisBOL plugin`);
  else
    res
      .status(415)
      .send(`The type ${type} is NOT compatible with the VisBOL plugin`);
});

app.get("/RunLocal", async (req, res) => {
  // let url = "https://synbiohub.org/public/SEGA/SEGA008/1/sbol";
  let url = "https://synbiohub.org/public/igem/BBa_K1033221/1/sbol";
  const type = "";
  const hostAddress = req.get("host");
  // uncomment the following 2 lines if running the plugin locally
  if (type === "Layout")
    // for local dev+
    url = url.replace("https://synbiohub.org", "http://localhost:7777");
  console.log(`Run url=${url} : host address=${hostAddress}`);

  try {
    const sbol = await getSBOLFromUrl(url);
    if (type !== "Layout") {
      const displayList = await createDisplay(sbol);
      const display = prepareDisplay(displayList);
      display.renderGlyphs();

      const properties = {
        display,
      };
      res.send(createRendering(properties, hostAddress));
    } else {
      const mxGraph = await convertSBOLtoMxGraph(sbol);
      const svg = mxGraphToSVG(mxGraph);
      const properties = {
        svg: svg.xml,
        width: svg.width,
        height: svg.height,
      };
      const createdSVG = createSVG(properties, hostAddress);
      res.send(createSVG(properties, hostAddress));
    }
  } catch (error) {
    res.send(createError(error));
  }
});

// ACCESS: PUBLIC
// Route = /Run
// Returns html for VisBOL rendering
// in a web application
app.post("/Run", async (req, res) => {
  let url = req.body.complete_sbol;
  const type = req.body.type;
  const hostAddress = req.get("host");
  // uncomment the following 2 lines if running the plugin locally
  //   if (type === "Layout")
  //for local dev+
  //  url = url.replace("https://synbiohub.org", "http://localhost:7777");
  console.log(`Run url=${url} : host address=${hostAddress}`);

  try {
    const sbol = await getSBOLFromUrl(url);
    if (type !== "Layout") {
      const displayList = await createDisplay(sbol);
      const display = prepareDisplay(displayList);
      display.renderGlyphs();

      const properties = {
        display,
      };
      res.send(createRendering(properties, hostAddress));
    } else {
      const mxGraph = await convertSBOLtoMxGraph(sbol);
      const svg = mxGraphToSVG(mxGraph);
      const properties = {
        svg: svg.xml,
        width: svg.width,
        height: svg.height,
      };
      const createdSVG = createSVG(properties, hostAddress);
      res.send(createSVG(properties, hostAddress));
    }
  } catch (error) {
    res.send(createError(error));
  }
});

// ACCESS: PUBLIC
// Route = /visbol.js
// Gets built rendering file to be sent
// to browser
app.get("/visbol.js", (req, res) => {
  const __dirname = path.resolve();
  res.sendFile(path.join(__dirname, "dist", "main.js"));
});

// start server
app.listen(port, () =>
  console.log(`VisBOL plugin listening at http://${address}:${port}`)
);
