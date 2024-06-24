'use strict'
require('dotenv').config()
let constant = "./config/config.js";
process.config.global_config = require(constant);

const express = require('express');
const app = express();
const { DbConnect } = require('./modules/helpers/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
DbConnect();
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   next();
// });
app.use('/public', express.static('public'));
// app.use(express.static(path.join(__dirname, './dist/zoclass')));
// app.use('/',express.static(path.join(__dirname,'./dist/zoclass')));

require('./routes')(app);

// app.get('/*',(req,res) => {
//   res.sendFile(path.join(__dirname ,'./dist/zoclass/index.html'));
// })




let port = Number(process.config.global_config.server.port);
let server = app.listen(port, function () {
    console.log('server listening on port ' + server.address().port);
});