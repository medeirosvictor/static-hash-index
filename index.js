const express = require('express')
const path = require('path')
const fs = require('fs')
const helpers = require("./helpers")
const initialState = require("./initialState")
const bodyParser = require('body-parser')

const app = express();
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')))
app.use(bodyParser.json())

let simulationData = initialState

fs.readFile(`./words.json`, (err, data) => {
    if (err) {
        throw err
    }

    const content = JSON.parse(data)
    simulationData.table = content.table
})


// Reading file and parsing to JSON format with my desired structure
// const fileContent = fs.readFileSync("words.txt","utf8")
// const fileContentArray = fileContent.split("\n")
// simulationData = helpers.mountTables(simulationData, fileContentArray)
// fs.writeFile("words.json", JSON.stringify(simulationData.table), 'utf8', function (err) {
//     if (err) {
//         console.log("An error occured while writing JSON Object to File.");
//         return console.log(err);
//     }
//     console.log("JSON file has been saved.");
// });

// Put all API endpoints under '/api'
app.get(`/api/simulation/table`, async (req, res) => {
    res.status(200).send({...simulationData})
    console.log(`Simulation Table Data sent`);
});

app.post('/api/simulation/pages', (req, res) => {
    console.log("Pls", req.body)
    res.json(simulationData)
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Simulation Data API listening on ${port}`)
});
