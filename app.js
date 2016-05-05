var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
var Converter = require("csvtojson").Converter;

app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
var routes = require("./routes/routes.js")(app);

var parsedRows = [];
var csvConverter = new Converter();

csvConverter.on("end_parsed", function (jsonObj) {
   console.log("done parsing csv"); 
   
   app.set('rawCfd', parsedRows);
   
   var server = app.listen(3000, function () {
        console.log("Listening on port %s...", server.address().port);
   });
});

csvConverter.on("record_parsed", function(resultRow, rawRow, rowIndex) {
    resultRow.Projection = 0;
    
    var windowSizeInDays = 20;
    
    if (rowIndex >= windowSizeInDays) {
        var done = resultRow.Production;
        var scope = resultRow.Scope;
        var lastDone = parsedRows[rowIndex-windowSizeInDays].Production;
        var delta = done - lastDone;
        var perDay = delta / windowSizeInDays;
        var remaining = scope - done;
        
        if (perDay === 0) {
            resultRow.Projection = parsedRows[rowIndex-1].Projection;   
        } else {
            resultRow.Projection = Math.round(remaining / perDay);    
        }
    }
    
    parsedRows.push(resultRow);
});

fs.createReadStream(__dirname + "/lh-cfd.csv").pipe(csvConverter);