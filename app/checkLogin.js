const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require('../db_connection/models/user');



router.post('', async function (req, res) {
    try {
        const token = req.body.token;
        if (token == NULL || token == undefined) {
            return res.status(201).send({ login:false});
        }
        try {
            const decoded = jwt.verify(token, config.SUPER_SECRET);
            
            const usr = await User.findOne({
                username: decoded.username
            }).exec();
            if(!usr)
                return res.status(201).send({ login:false});
            else{
                let usrname = usr.username;
                let img = usr.image;
                return res.status(200).send({ login:true, username: usrname, image: img});
            }

        } catch (err) {
            return res.status(400).send({ message: "Token errato" });
        }
        return next();





    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Errore interno al Server.' });
    }

});



module.exports = router;