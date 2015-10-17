var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('<h1>Hello from the Frontend!</h1>');
});

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
