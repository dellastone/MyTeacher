const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const User = require('./models/user');


router.get('/:username', async (req, res) => {

    let message = "Si è verificato un errore nel recupero dei dati dell'utente, si prega di ricaricare la pagina";

    try{

        const username = req.params.username;
        if(username == null || username == undefined){
            message = "E' necessario specificare uno username valido";
            res.status(400).json({ message: message });
        }
        else{
            
            const user = await User.findOne({ username: username }, ['username','lezioni']).exec();
            console.log(user)
            if(user == null){
                //utente non trovato nel database, viene ritornato un errore all'utente
                message = "Utente non presente nel database";
                res.status(400).json({ message: message });
            }
            else{
                //lezioni ritornate all'utente
                let lez = user.lezioni;
                
                res.status(200).json(lez);
            }
    }
    }catch(err){
        console.log(err);
        res.status(500).json({ message: message });
    }
});

module.exports = router;
