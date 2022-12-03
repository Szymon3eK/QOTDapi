const config = require('../config.json');


// EXPRESS
const express = require('express');
const app = express();
const port = config.express.port;

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




app.get('/', (req, res) => {
    res.send('Hello World!');
});
