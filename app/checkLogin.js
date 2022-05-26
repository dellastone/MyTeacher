const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require('../db_connection/models/user');

//controlla lo stato di login dell'utente
router.post('', async function (req, res) {
    try {
        
        const token = req.sanitize(req.body.token);
        //se il token è vuoto l'utente non ha effettuato il login
        if (token == null || token == undefined) {
            return res.status(200).send({ login:false});
        }
        try {
            //decodifica il token
            const decoded = jwt.verify(token, process.env.SUPER_SECRET);
            //trova l'utente loggato
            const usr = await User.findOne({
                username: decoded.username
            }).exec();
            //se l'utente non esiste fai rieffettuare il login
            if(!usr)
                return res.status(200).send({ login:false});
            else{
                //ritorna username immagine e stato login a true
                let usrname = usr.username;
                let img = usr.image;
                if(img == undefined)
                    img = ""
                return res.status(200).send({ login:true, username: usrname, image: img});
            }

        } catch (err) {
            console.log(err)
            //se il token è errato restituisci errore
            return res.status(400).send({ message: "Token errato" });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Errore interno al Server.' });
    }

});



module.exports = router;