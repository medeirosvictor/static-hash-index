const express = require('express')
const path = require('path')
const fs = require('fs')
const generatePassword = require('password-generator')
const helpers = require("./helpers")
const initialState = require("./initialState")
const cors = require('cors')

const app = express();
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors())

const fileContent = fs.readFileSync("words.txt","utf8")
const fileContentArray = fileContent.split("\n")

// Put all API endpoints under '/api'
app.get('/api/simulation/table', (req, res) => {
    let simulationData = initialState
    simulationData = helpers.mountTables(simulationData, fileContentArray)

    res.send(simulationData.table)
    console.log(`Simulation Data sent`);
});
    
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Simulation Data API listening on ${port}`);