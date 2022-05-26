const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Lection = require('./models/lection');
const user = require('./models/user');

router.post(
    '',
    [
        body('starts').exists().withMessage("Specifica data e ora di inizio della lezione").isDate().withMessage("La data e l'ora inserite per l'inizio della lezione non sono valide"),
        body('ends').exists().withMessage("Specifica data e ora di fine della lezione").isDate().withMessage("La data e l'ora inserite per la fine della lezione non sono valide")
    ], async (req, res) => {
        let message = "Si è verificato un errore nella creazione della lezione nel calendario, la preghiamo di riprovare.";
        try {
            //se uno dei controlli non è andato a buon fine viene settato un errore
            let errors = validationResult(req).array();
            let wrong_data = false;

            if (errors.length > 0) {
                wrong_data = true;
                message = errors[0].msg;
            }

            if (!wrong_data) {
                //i dati parametri del body venogono recuperati e sanitizzati
                const starts = new Date(req.sanitize(req.body.starts));
                const ends = new Date(req.sanitize(req.body.ends));
                const username = req.loggedUser.username;
                console.log(username);
                //recupero dei dati del professore che vuole aggiungere una lezione dal database
                const professor = await Lection.findOne({ username: username }).exec();

                //se il professore non viene recuperato dal database si verifica un errore, altrimenti si può procedere con l'aggiunta della lezione
                if (professor == null) {
                    wrong_data = true;
                    message = "Si è verificato un problema nella ricerca del professore nel database";
                }
                else {
                    //la nuova lezione viene creata
                    newLection = new Lection({
                        prof_username: username,
                        starts: starts,
                        ends: ends,
                        booked: false,
                        owner: professor._id
                    });

                    //il campo _id della nuova lezione viene aggiunto alla lista delle lezioni del professore
                    professor.lezioni.push(newLection._id);

                    //la nuova lezione viene aggiunta nel database
                    await newLection.save();
                }
                if (wrong_data) {
                    console.log(message);
                    res.status(400).json({ message: message });
                }
            }
            else {
                console.log("L'utente ha inserito dei dati non validi nell'input");
                res.status(400).json({ message: message });
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: message });
        }
    });

//aggiungere id professore nel campo owner 
//aggiugnere lezione nell'array di lezioni del professore 

module.exports = router;