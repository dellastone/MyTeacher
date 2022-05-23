require("dotenv").config();
const express = require('express');
const cookieParser = require("cookie-parser")
const app = express();
const cors = require('cors');
const authentication = require('./authentication.js');
const expressSanitizer = require('express-sanitizer');
const registration = require('../db_connection/userData');
const ricerca = require('./ricerca/ricerca');
const tokenchecker = require('./tokenchecker');

//configuring expressJS middleware
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(cors());
app.use(cookieParser())

app.use('/', express.static('static'));
app.use('/api/v1/users/auth', authentication);
app.use('/api/v1/users', registration);
app.use('/api/v1/ricerca', tokenchecker);
app.use('/api/v1/ricerca', ricerca);

module.exports = app;