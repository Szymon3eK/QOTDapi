const config = require('../config.json');

const express = require("express");
const express_static = require("express-static");
const app = express();
const port = config.express.publicport;

app.listen(port, () => {
    console.log(`[+] Serwer PUBLIC uruchomiony PORT: ${port}`);
});

console.log(__dirname);

app.use(express.static(__dirname + "/../public"));

