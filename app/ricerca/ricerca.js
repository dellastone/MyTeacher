const express = require('express');
const mongoose = require('mongoose');
const { db, addListener } = require('../../db_connection/models/user');
const router = express.Router();
const User = require('../../db_connection/models/user');

//rimuove dall'array trovato dal database i campi id, passwordHash e salt
function removePrivateInfo (dbResult){
    for(let data of dbResult){
        data.delete();
        delete data.__v;
        delete data.passwordHash;
        delete data.salt;
    }
    return dbResult;
}

/*
ricerca nel database tutti gli utenti di tipo professore
e li restituisce all'utente in formato JSON 
*/
router.get('', async (req, res) => {
    let message = "Si è verificato un errore durante la ricerca, la preghiamo di riprovare";
    try{
        //ricerca dei professori nel database
        console.log("Ricerca professori nel database ...");
        let professors = await User.find({ professore: true }).exec();

        //le informazioni private vengono rimosse dai dati recuperati
        let toReturn = removePrivateInfo(professors);
        console.log(toReturn);

        //dati ritornati all'utente
        res.status(200).json(toReturn);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: message});
    }
});

module.exports = router;