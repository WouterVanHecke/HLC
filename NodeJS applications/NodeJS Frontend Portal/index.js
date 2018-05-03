var http = require('http');
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res) {
    var page = url.parse(req.url).pathname;
    console.log(page);

    res.writeHead(200, {"Content-Type": "text/html"});

    if (page == '/') {
        res.write('Starting page');
    } else if (page == '/basement') {
        res.write('Welcome to my special domain');
    } else if(page == '/participant'){
        var params = querystring.parse(url.parse(req.url).query);
        res.write('Looking for participant ' + params['participant']);
    } else {
        res.write('No entrance!');
    }

    res.end();

});

server.listen(8085);