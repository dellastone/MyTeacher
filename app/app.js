require("dotenv").config();
const express = require('express');
const app = express();

//configuring expressJS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;