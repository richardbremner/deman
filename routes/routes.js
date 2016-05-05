var appRouter = function(app) {
    app.get("/", function(req, res) {
        res.send("Hello World");
    });
    
    app.get("/cfd", function(req, res) {
        var cfd = req.app.get('rawCfd');
        res.send(cfd);
    });
}
 
module.exports = appRouter;