var path = require('path');
var http = require('http');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var requireDir = require('require-dir');
var morgan = require('morgan');

app.locals.pretty = true;
app.set('port', process.env.PORT || 3002);

console.log("1. Connecting to data base ...");
// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://192.168.88.166:27017/dutytask';
// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function(err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + uristring);
    }
});

console.log("2. Config middleware ...");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

console.log("3. Config static routes ...");
app.use('/public', express.static('public'));
app.use('/bower_components', express.static('bower_components'));
app.use(morgan('combined'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

console.log("4. Config API ...");
var routes = requireDir('./api/');
for (var route in routes)
    app.use('/', routes[route]); // and uncomment this line
    // app.use('/api', routes[route]); // comment this if you want the server start as a API REST

// Para cualquier otra ruta, devuelve el archivo principal de la aplicación de Angular
app.get('*', function(req, res, next) {
    res.status(404).send("Not found.");
    // res.sendFile(path.join(__dirname, '', 'public/app.html'));
});

console.log("5. Init server ...");
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
