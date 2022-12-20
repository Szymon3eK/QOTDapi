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

var cron = require('node-cron');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/add', (req, res) => {
    var cytatreq = req.query.cytat;
    var autorreq = req.query.autor;

    if(cytatreq == undefined || autorreq == undefined) return res.status(400), res.json({status: "ERROR", error: "Nie podano wszystkich danych"});

    console.table({ cytatreq, autorreq });

    async function add() {
        const database = client.db(dbname);
        const collection = database.collection('cytaty');
        const result = await collection.insertOne({ cytat: cytatreq, autor: autorreq });
            
        if (result.acknowledged) {
            res.status(200)
            res.json({ status: "OK", cytat: cytatreq, autor: autorreq });
        } else {
            res.status(404)
            res.json({ status: "ERROR", message: "Nie udalo sie dodac cytatu (dodawanie do bazy danych)" });
        }
    };
    add();
  
});

cron.schedule('0 00 00 * * *', () => {
    pickquote();
}, {
   scheduled: true,
   timezone: "Europe/Warsaw"    
});

pickquotewithoutcron();

async function pickquotewithoutcron() {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const database = client.db(dbname);
    const collection = database.collection('wybranecytaty');
    const result = await collection.find({ dzien: day, miesiac: month, rok: year }).toArray();

    if (hour > 0 && minute > 0) {
        if (result.length == 0) {
            console.log('Cytat nie zostal jeszcze wylosowany (cron error)')
            pickquote();
        } else {
            console.log("Cytat zostal juz wylosowany") 
        }
    }
}

function pickquote() {
    async function get() {

        console.log("Losowanie cytatu")

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();


        const database = client.db(dbname);

        const collection = database.collection('cytaty');
        const result = await collection.aggregate([{ $sample: { size: 1 } }]).toArray().then((result) => {
            const wybranecytatycollection = database.collection('wybranecytaty');
            const wybranecytatyresult = wybranecytatycollection.insertOne({ cytat: result[0].cytat, autor: result[0].autor, dzien: day, miesiac: month, rok: year });
        });

        };
        get();
}




app.get('/get', (req, res) => {
    async function get() {
            
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const database = client.db(dbname);
        const collection = database.collection('wybranecytaty');
        const result = await collection.find({ dzien: day, miesiac: month, rok: year }).toArray();

        if (result.length == 0) {
            res.status(404)
            res.json({ status: "ERROR", message: "Nie udalo sie pobrac cytatu (brak cytatu w bazie danych)" });
        } else {
            if (result.length >= 2) {
                res.status(200)
                res.json({ status: "WARNING", message: "UWAGA! W bazie danych znajduja sie wiecej lub rowne 2 cytaty na dzisiejsza date! (wybrano pierwszy)", cytat: result[0].cytat, autor: result[0].autor});
            }else if (result) {
                res.status(200)
                res.json({ status: "OK", cytat: result[0].cytat, autor: result[0].autor });
            } else {
                res.status(404)
                res.json({ status: "ERROR", message: "Nie udalo sie pobrac cytatu (pobieranie z bazy danych)" });
            }
        }




    };
    
        get();

    try {

    } catch (error) {
        res.status(404)
        res.json({ status: "ERROR", message: "Nie udalo sie pobrac cytatu (pobieranie z bazy danych)" });
    }

});


app.get('*', (req, res) => {
    res.status(404)
    res.json({ status: "ERROR", message: "Zle zapytanie do API" });
});
