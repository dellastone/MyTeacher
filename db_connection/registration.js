const express = require('express');
const router = express.Router();
const user = require('./models/user');

router.post('', (req, res) =>{
    res.json({requestBody: req.body});
    
}); 
