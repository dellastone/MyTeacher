require("dotenv").config();
const express = require('express');
const cookieParser = require("cookie-parser")
const app = express();
const cors = require('cors');
const authentication = require('./authentication/authentication');
const expressSanitizer = require('express-sanitizer');
const registration = require('./authentication/userData');
const ricerca = require('./ricerca/ricerca');
const lections = require('./lections/lections')
const nblections = require('./lections/notBookedLections')
const checkLogin = require('./front_end_api/checkLogin')
const tokenchecker = require('./authentication/tokenchecker');
const prenota = require('./lections/booking');
const addLections = require('./lections/addLections');
const getConto = require('./conto/getConto')
const ricarica = require('./conto/ricarica');
const payLection = require('./conto/payLection')

//configuring expressJS middleware
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(cors());
app.use(cookieParser())

app.use('/', express.static('static',{index:'html_login.html'}));
app.use('/api/v2/checkLogin',checkLogin)
app.use('/api/v2/users/auth', authentication);
app.use('/api/v2/users', registration);
app.use('/api/v2/lection', lections);
app.use('/api/v2/notBookedLection', nblections)
app.use('/api/v2/ricerca', ricerca);
app.use('/api/v2/prenota', tokenchecker);
app.use('/api/v2/prenota', prenota);
app.use('/api/v2/lection/add', tokenchecker);
app.use('/api/v2/lection/add', addLections);
app.use('/api/v2/getConto', tokenchecker);
app.use('/api/v2/getConto', getConto);
app.use('/api/v2/ricarica', tokenchecker);
app.use('/api/v2/ricarica', ricarica);
app.use('/api/v2/payLection', tokenchecker);
app.use('/api/v2/payLection', payLection);

module.exports = app;