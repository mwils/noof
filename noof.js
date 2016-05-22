#!/usr/bin/env node

'use strict';

var http = require('http');
var fs = require('fs');
var path = require('path');
var os = require('os');
var port = 2000;
var args = process.argv;
var inputFile = args[2];
var fileName = path.basename(inputFile);
var filePath = path.join(__dirname, inputFile);
var ifaces = os.networkInterfaces();
var contentType = 'application/octet-stream';
var interfaces = [];
var ip;

console.log(args[2])

Object.keys(ifaces).forEach(function (ifname) {

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    interfaces.push({ip: iface.address});
  });
});

ip = interfaces[0];

http.createServer(function(req, res) {
  
  fs.readFile(filePath, function (err, content) {
    if(err) {
      return console.log(err);
    }

    res.writeHead(200, {'Content-Type': contentType, 'Content-Disposition': 'attachment;filename=' + fileName});
    res.end(content, 'utf-8');
  });

}).listen(port);

console.log('Your file is available at: http://localhost:' + port + '/' + fileName);
