const config = require('../config.json');


// EXPRESS
const express = require('express');
const app = express();
const port = config.express.apiport;

//MONGODB
const dbname = config.mongodb.dbname;
const mongodblink = `mongodb://${config.mongodb.host}:${config.mongodb.port}`;
const { MongoClient } = require('mongodb');
const client = new MongoClient(mongodblink);


// CONNECT TO MONGODB
async function connect() {
    await client.connect();
    console.log(`[+] Polaczono z baza danych mongodb LINK: ${mongodblink}`);
}

connect();

// CONNECT TO EXPRESS
app.listen(port, () => {
    console.log(`[+] Serwer API uruchomiony PORT: ${port}`);
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/add', (req, res) => {
    var cytatreq = req.query.cytat;
    var autorreq = req.query.autor;

    res.send(`[+] Dodano cytat: ${cytatreq} autor: ${autorreq}`);
    console.table({ cytatreq, autorreq });

    async function add() {
        const database = client.db(dbname);
        const collection = database.collection('cytaty');
        const result = await collection.insertOne({ cytat: cytatreq, autor: autorreq });
        console.log(result);
    }

    add();
  
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});
