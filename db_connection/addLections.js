const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Lection = require('./models/lection');
const User = require('./models/user');

router.post(
    '',
    [
        body('starts').exists().withMessage("Specifica data e ora di inizio della lezione").isISO8601.withMessage("La data e l'ora inserite per l'inizio della lezione non sono valide"),
        body('ends').exists().withMessage("Specifica data e ora di fine della lezione").isISO8601().withMessage("La data e l'ora inserite per la fine della lezione non sono valide")
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

                //recupero dei dati del professore che vuole aggiungere una lezione dal database
                const professor = await User.findOne({ username: username }).exec();

                //se il professore non viene recuperato dal database si verifica un errore, altrimenti si può procedere con l'aggiunta della lezione
                if (professor == null) {
                    wrong_data = true;
                    message = "Si è verificato un problema nella ricerca del professore nel database";
                }
                else {
                    //la nuova lezione viene creata
                    newLection = new Lection({
                        prof_username: username,
                        date: starts,
                        start_time: "1",
                        end_time: "1",
                        booked: false,
                        owner: professor._id
                    });
                    console.log(newLection);

                    //il campo _id della nuova lezione viene aggiunto alla lista delle lezioni del professore
                    professor.lezioni.push(newLection._id);

                    //la nuova lezione viene aggiunta nel database
                    await newLection.save();
                    console.log("Lezione creata con successo all'interno del database");

                    await professor.save();
                    console.log("Lezione aggiunta con successo alla lista lezioni del professore con username "+ username);

                    //viene inviata all'utente una risposta con codice 201 per confermare l'avvenuta creazione della lezione
                    res.status(201).json({ location: "/api/v1/lection/" + username });
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