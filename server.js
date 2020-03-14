// NODE.JS SERVER
const express = require('express');
const fs = require('fs');
const path = require('path');

let COLL = [];

const app = express();
app.listen(3000, () => console.log('listening on port 3000...'));

app.use(express.static(__dirname + '/'));
app.use(express.json({ limit: '1mb' }));


//read JSON files
app.get('/files', (req, res) => {
    fs.readdir('./data', (err, files) => {
        if (err) { throw err } else {
            COLL = [];
            files.forEach(file => {
                filename = file.split('.').slice(0, -1).join('.');
                COLL.push(filename);
            });
            res.json(COLL);
            res.end();
        }
    });
})


// write JSON file 
app.post('/data', (req, res) => {
    let listname = req.body.shift();
    fs.writeFile(`./data/${listname}.json`, JSON.stringify(req.body), (err) => {
        if (err) throw err;
    });
    console.log('json file updated ...');
    res.end();
});


// delete JSON file 
app.post(`/delete`, (req, res) => {
    let id = req.body[0];
    fs.unlink(`./data/${id}.json`, (err) => {
        if (err) throw err;
    });
    console.log('json file deleted ...');
    res.end();
});


// MongoDB 

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://ismay7:<1Lave%2E23%21%2Dmfg>@gwd-cluster-thyu1.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const collection = client.db("maxg").collection("Weekly Todos");
//     // perform actions on the collection object
//     client.close();
// });

