// NODE.JS SERVER

const express = require('express');
const app = express();
const fs = require('fs');

app.listen(3000);
app.use(express.static(__dirname + '/'));

// MongoDB 

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ismay7:<1Lave%2E23%21%2Dmfg>@gwd-cluster-thyu1.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("TodoApp").collection("_LIST");
    // perform actions on the collection object
    client.close();
});
