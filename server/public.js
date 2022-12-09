const config = require('../config.json');

const express = require("express");
const express_static = require("express-static");
const app = express();
const port = config.express.publicport;

app.listen(port, () => {
    console.log(`[+] Serwer PUBLIC uruchomiony PORT: ${port}`);
});

app.use('/config', (req, res) => {
    res.json(config);
});

console.log(__dirname);

app.use(express.static(__dirname + "/../public"));

