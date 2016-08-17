/**
 * Created by vadis on 30.07.16.
 */
var express = require('express');
var app = express();
var path =require('path');

//noinspection JSUnresolvedVariable
app.use('/', express.static( path.join(__dirname + '/client_src')));
app.use('/libs',  express.static(__dirname + '/libs'));

app.listen(3000, function () {
    console.log("server started at http://localhost:3000");
});
