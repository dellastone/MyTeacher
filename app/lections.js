const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const User = require('../db_connection/models/user');
const Lezione = require('../db_connection/models/lection');


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
                //id lezioni ritornate all'utente
                let lez_ids = user.lezioni;
                let elenco_lezioni = []
                for (const l_id of lez_ids){
                    let lezione = await Lezione.findOne({ _id: l_id }).exec();
                    elenco_lezioni.push(lezione)
                }

                
                res.status(200).json(elenco_lezioni);
            }
    }
    }catch(err){
        console.log(err);
        res.status(500).json({ message: message });
    }
});

module.exports = router;
