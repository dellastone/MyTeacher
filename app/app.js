require("dotenv").config();
const express = require('express');
const app = express();
const authentication = require('./authentication.js');



//configuring expressJS middleware
app.use(express.json());
app.use('/', express.static('static'));
app.use('/api/v1/authentications', authentication);
app.use(express.urlencoded({ extended: true }));
module.exports = app;