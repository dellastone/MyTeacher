const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const User = require('../db_connection/models/user');
const Lezione = require('../db_connection/models/lection');
const Conto = require('../db_connection/models/conto');
let Transazione = require('../db_connection/models/transazione');


router.get('/:username', async (req, res) => {

    let message = "Si è verificato un errore nel recupero dei dati dell'utente, si prega di ricaricare la pagina";

    try{

        const username = req.params.username;
        if(username == null || username == undefined){
            message = "E' necessario specificare uno username valido";
            res.status(400).json({ message: message });
        }
        if(username != req.loggedUser.username){
            message = "E' necessario effettuare il login con l'utente di cui si richiede il conto";
            res.status(400).json({ message: message });
        }
        else{
            
            const user = await User.findOne({ username: username }, ["conto"]).exec();
            if(user == null){
                //utente non trovato nel database, viene ritornato un errore all'utente
                message = "Utente non presente nel database";
                res.status(400).json({ message: message });
            }
            else{
                let conto = await Conto.findOne({ _id: user.conto }).exec();
                if(conto == null){
                     //utente non trovato nel database, viene ritornato un errore all'utente
                    message = "Conto non presente nel database";
                    return res.status(400).json({ message: message });
                }
                let transazioni_ids = conto.transazioni;
                let totale = conto.totale;
                let elenco_transazioni = []
                for (const t_id of transazioni_ids){
                    let transazione = await Transazione.findOne({ _id: t_id }).exec();
                    elenco_transazioni.push(transazione)
                }
                res.status(200).json({"elenco_transazioni": elenco_transazioni,"totale": totale});
                
            }
    }
    }catch(err){
        console.log(err);
        res.status(500).json({ message: message });
    }
});

module.exports = router;