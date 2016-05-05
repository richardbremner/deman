var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
var Converter = require("csvtojson").Converter;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
var routes = require("./routes/routes.js")(app);

var csvConverter = new Converter();


csvConverter.on("end_parsed", function (jsonObj) {
   console.log("done parsing csv"); 
   
   var server = app.listen(3000, function () {
        console.log("Listening on port %s...", server.address().port);
   });
});

var parsedRows = [];
csvConverter.on("record_parsed", function(resultRow, rawRow, rowIndex) {
    parsedRows.push(resultRow);
});

fs.createReadStream(__dirname + "/lh-cfd.csv").pipe(csvConverter);