var bodyParser = require('body-parser');
var configRegulator = require('./middlewares/about-us/config-regulator')
var converter = require('./middlewares/converter')
var express = require('express');
var path = require('path');
var uploader = require('./middlewares/about-us/gcs-uploader')

var app = express();

var port = process.env.PORT || 5000;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// api
app.get('/about-us', converter, configRegulator, uploader)

// error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function() {
  console.log('GSX2JSON listening on port ' + port);
});
