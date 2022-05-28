require("dotenv").config();
const express = require('express');
const cookieParser = require("cookie-parser")
const app = express();
const cors = require('cors');
const authentication = require('./authentication.js');
const expressSanitizer = require('express-sanitizer');
const registration = require('../db_connection/userData');
const ricerca = require('./ricerca/ricerca');
const lections = require('./lections.js')
const nblections = require('./notBookedLections')
const checkLogin = require('./checkLogin')
const tokenchecker = require('./tokenchecker');
const prenota = require('./booking');
const addLections = require('../db_connection/addLections');

//configuring expressJS middleware
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(cors());
app.use(cookieParser())

app.use('/', express.static('static',{index:'html_login.html'}));
app.use('/api/v1/checkLogin',checkLogin)
app.use('/api/v1/users/auth', authentication);
app.use('/api/v1/users', registration);
app.use('/api/v1/lection', lections);
app.use('/api/v1/notBookedLection', nblections)
app.use('/api/v1/ricerca', ricerca);
app.use('/api/v1/prenota', tokenchecker);
app.use('/api/v1/prenota', prenota);
app.use('/api/v2/lection/add', tokenchecker);
app.use('/api/v2/lection/add', addLections);

module.exports = app;