const express = require('express');
const app = express();
const expressSanitizer = require('express-sanitizer');
const registration = require('../db_connection/registration')

//configuring expressJS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());

app.use('/api/v1/user', registration);

module.exports = app;