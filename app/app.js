require("dotenv").config();
const express = require('express');
const app = express();
const authentication = require('./authentication.js');
const expressSanitizer = require('express-sanitizer');
const registration = require('../db_connection/registration');
const ricerca = require('./ricerca/ricerca');

//configuring expressJS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());

app.use('/', express.static('static'));
app.use('/api/v1/users/auth', authentication);
app.use('/api/v1/users', registration);
app.use('/api/v1/ricerca', ricerca);

module.exports = app;