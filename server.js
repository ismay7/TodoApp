// NODE.JS SERVER
const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs');

app.listen(3000, () => console.log('listening on port 3000...'));

app.use(express.static(__dirname + '/'));
app.use(express.json({ limit: '1mb' }));


// rewrite JSON file when changes are invoked
app.post('/data', (request, response) => {
    fs.writeFile('./data/todos.json', JSON.stringify(request.body), (err) => {
        if (err) throw err;
    });
    console.log('json file updated ...');
    response.end();
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

