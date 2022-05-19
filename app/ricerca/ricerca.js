const express = require('express');
const mongoose = require('mongoose');
const { db, addListener } = require('../../db_connection/models/user');
const { param, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../../db_connection/models/user');

/*
ricerca nel database tutti gli utenti di tipo professore
e li restituisce all'utente in formato JSON 
*/
router.get('', async (req, res) => {
    let message = "Si è verificato un errore durante la ricerca, la preghiamo di riprovare";
    try {
        //ricerca dei professori nel database, solo i campi da ritornare vengono recuperati 
        //non viene ritornato l'_id creato da mongoDB, l'hash della password e il salt
        console.log("Ricerca professori nel database ...");

        const professors = await User.find({ professore: true }, 
        ['-_id', 'username', 'nome', 'cognome', 'indirizzo', 'email', 'phone', 'image', 'materie', 'argomenti', 'prezzo']).exec();

        console.log(professors);
        //dati ritornati all'utente
        console.log("Lista professori ritornata correttamente all'utente");
        res.status(200).json(professors);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: message });
    }
});

router.get(
    '/:name',
    [
        param('name').exists().withMessage("Specificare la parola da cercare").isAlphanumeric().withMessage("Il parametro da cercare deve essere alfanumerico")
    ], async (req, res) => {
        
        let message = "Si è verificato un errore durante la ricerca, la preghiamo di riprovare";
        console.log("Ricerca per username, nome o cognome in corso...");

        try {
            let wrong_data = false;

            //errore nel caso in cui il controllo sulla parola da cercare non vada a buon fine
            let errors = validationResult(req).array();
            if (errors.length > 0) {
                wrong_data = true;
                message = errors[0].msg;
            }
            if (!wrong_data) {
                const name = req.params.name;
                //ricerca dei professori nel database, solo i campi da ritornare vengono recuperati 
                //non viene ritornato l'_id creato da mongoDB, l'hash della password e il salt
                console.log("Ricerca professori nel database ...");

                const professors = await User.find(
                    {
                        professore: true,
                        $or: [{ username: new RegExp(name, 'i') },
                        { nome: new RegExp(name, 'i') },
                        { cognome: new RegExp(name, 'i') }]
                    },
                    ['-_id', 'username', 'nome', 'cognome', 'indirizzo', 'email', 'phone', 'image', 'materie', 'argomenti', 'prezzo']).exec();

                console.log(professors);
                //dati ritornati all'utente
                console.log("Lista professori ritornata correttamente all'utente");
                res.status(200).json(professors);
            }
            else {
                console.log("Parametro non valido")
                res.status(400).json({ message: message });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: message });
        }
    });

router.get(
    '/:name/:surname',
    [
        param('name').exists().withMessage("Specificare la parola da cercare").isAlpha().withMessage("Il parametro da cercare deve contenere solo lettere"),
        param('surname').exists().withMessage("Specificare la parola da cercare").isAlpha().withMessage("Il parametro da cercare deve contenere solo lettere")
    ], async (req, res) => {

        let message = "Si è verificato un errore durante la ricerca, la preghiamo di riprovare";
        console.log("Ricerca per nome e cognome in corso...");

        try {
            let wrong_data = false;

            //errore nel caso in cui il controllo sulle parole da cercare non vada a buon fine
            let errors = validationResult(req).array();
            if (errors.length > 0) {
                wrong_data = true;
                message = errors[0].msg;
            }
            if (!wrong_data) {
                const name = req.params.name;
                const surname = req.params.surname;

                //ricerca dei professori nel database, solo i campi da ritornare vengono recuperati 
                //non viene ritornato l'_id creato da mongoDB, l'hash della password e il salt
                console.log("Ricerca professori nel database ...");

                const professors = await User.find(
                    {
                        professore: true,
                        nome: new RegExp(name, 'i'),
                        cognome: new RegExp(surname, 'i')
                    },
                    ['-_id', 'username', 'nome', 'cognome', 'indirizzo', 'email', 'phone', 'image', 'materie', 'argomenti', 'prezzo']).exec();

                console.log(professors);
                //dati ritornati all'utente
                console.log("Lista professori ritornata correttamente all'utente");
                res.status(200).json(professors);
            }
            else {
                console.log("Parametri non validi")
                res.status(400).json({ message: message });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: message });
        }
    });



module.exports = router;