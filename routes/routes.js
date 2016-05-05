var path = require("path");

var appRouter = function(app) {
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname + '/../views/index.html'))
    });
    
    app.get("/cfd", function(req, res) {
        var cfd = req.app.get('rawCfd');
        res.send(cfd);
    });    
}
 
module.exports = appRouter;