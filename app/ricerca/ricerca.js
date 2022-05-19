const express = require('express');
const mongoose = require('mongoose');
const { db, addListener } = require('../../db_connection/models/user');
const router = express.Router();
const User = require('../../db_connection/models/user');

/*
ricerca nel database tutti gli utenti di tipo professore
e li restituisce all'utente in formato JSON 
*/
router.get('', async (req, res) => {
    let message = "Si è verificato un errore durante la ricerca, la preghiamo di riprovare";
    try{
        //ricerca dei professori nel database, solo i campi da ritornare vengono recuperati 
        //non viene ritornato l'_id creato da mongoDB, l'hash della password e il salt
        console.log("Ricerca professori nel database ...");
        
        const professors = await User.find({ professore: true }, ['-_id', 'username', 'nome', 'cognome', 'indirizzo', 'email', 'phone', 'image', 'materie', 'argomenti', 'prezzo']).exec();

        console.log(professors);
        //dati ritornati all'utente
        console.log("Lista professori ritornata correttamente all'utente");
        res.status(200).json(professors);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: message});
    }
});

module.exports = router;