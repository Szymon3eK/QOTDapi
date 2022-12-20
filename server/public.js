const config = require('../config.json');
var path = require("path");

const express = require("express");
const express_static = require("express-static");
const app = express();
const port = config.express.publicport;

app.listen(port, () => {
    console.log(`[+] Serwer PUBLIC uruchomiony PORT: ${port}`);
});

app.use(express.static(__dirname + "/../public"));

app.get("*", function (req, res) {
  res.status(404).sendFile(path.resolve(__dirname + "/../html/404page/index.html"));
});
