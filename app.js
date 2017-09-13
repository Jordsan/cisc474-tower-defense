var express = require('express');
var server = express();
server.use('/', express.static(__dirname + '/src'));
server.listen(8000);
