const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Lection = require('./models/lection');
const User = require('./models/user');
const lection = require('./models/lection');
const { JsonWebTokenError } = require('jsonwebtoken');

//controlla se le date di inizio e fine lezione corrispondono
function checkDateCorrectness(starts, ends) {
    if (starts.getUTCDate() != ends.getUTCDate() || starts.getUTCMonth() != ends.getUTCMonth() || starts.getUTCFullYear() != ends.getUTCFullYear())
        return true;
    else
        return false;
}

//controlla che nelle date non siano specificati i secondi
function checkSecondsZero(starts, ends) {
    if (starts.getUTCSeconds() != 0 || ends.getUTCSeconds() != 0)
        return true;
    else
        return false;
}

//controlla se il professore non ha già altre lezione in quello specifico orario
async function checkNotAlreadyBusy(starts, ends, professor) {
    let toRet = false;
    for (id_lezione of professor.lezioni) {
        let lezione = await Lection.findOne({ _id: id_lezione });
        if (lezione != null) {
            console.log(lezione.starts);
            console.log(starts);
        }
        if (lezione != null && lezione.starts.getUTCFullYear() == starts.getUTCFullYear()
            && lezione.starts.getUTCMonth() == starts.getUTCMonth()
            && lezione.starts.getUTCDate() == starts.getUTCDate()) {
                if(!(ends.getTime() <= lezione.starts.getTime() || starts.getTime() >= lezione.ends.getTime()))
                    toRet = true;
        }
    } 
    console.log(toRet);
    return toRet;
}
/*
API che si occupa dell'aggiunta di una lezione al calendario di un professore 
Vengono effettuati dei controlli:
- data e ora della lezione devono essere validi e nel formato ISO8601
- la data di inzio e fine lezione devono essere le stesse 
- non devono essere specificati secondi ma solo minuti e ore

La lezione viene creata con i dati inseriti dall'utente e il campo booked viene inizializzato a false
La lezione viene aggiunta nel database con un riferimento al professore che ne è proprietario 
L'id della lezione viene aggiunto nella lista delle lezioni del professore
*/
router.post(
    '',
    [
        body('starts').exists().withMessage("Specifica data e ora di inizio della lezione").isISO8601().withMessage("La data e l'ora inserite per l'inizio della lezione non sono valide"),
        body('ends').exists().withMessage("Specifica data e ora di fine della lezione").isISO8601().withMessage("La data e l'ora inserite per la fine della lezione non sono valide")
    ], async (req, res) => {
        let message = "Si è verificato un errore nella creazione della lezione nel calendario, la preghiamo di riprovare.";
        try {
            //se uno dei controlli non è andato a buon fine viene settato un errore
            let errors = validationResult(req).array();
            let wrong_data = false;
            let overlap = false;

            if (errors.length > 0) {
                wrong_data = true;
                message = errors[0].msg;
            }

            if (!wrong_data) {
                //i dati parametri del body venogono recuperati e sanitizzati
                const starts = new Date(req.sanitize(req.body.starts));
                const ends = new Date(req.sanitize(req.body.ends));
                const username = req.loggedUser.username;
                
                //controllo per verificare se le date inserite dall'utente sono corrette
                wrong_data = checkDateCorrectness(starts, ends);
                if (wrong_data)
                    message = "Il giorno di inizio e di fine della lezione non corrispondono";
                if (!wrong_data) {
                    wrong_data = checkSecondsZero(starts, ends);
                    if (wrong_data)
                        message = "La data non deve specificare secondi";
                }
                if (!wrong_data) {
                    wrong_data = starts.getTime() >= ends.getTime();
                    if (wrong_data)
                        message = "La data di fine lezione deve essere dopo la data di inzio";
                }
                if (!wrong_data) {
                    let lection_duration = ends.getUTCHours() - starts.getUTCHours();
                    lection_duration += (ends.getUTCMinutes() - starts.getUTCMinutes()) / 60.0;

                    //recupero dei dati del professore che vuole aggiungere una lezione dal database
                    const professor = await User.findOne({ username: username }).exec();

                    //se il professore non viene recuperato dal database si verifica un errore, altrimenti si può procedere con l'aggiunta della lezione
                    if (professor == null) {
                        wrong_data = true;
                        message = "Si è verificato un problema nella ricerca del professore nel database";
                    }
                    else {
                        //controllo che la lezione non si sovrapponga con altre lezioni già presenti nel database
                        overlap = await checkNotAlreadyBusy(starts, ends, professor);
                        console.log(overlap);
                        if (!overlap) {
                            //la nuova lezione viene creata
                            newLection = new Lection({
                                prof_username: username,
                                starts: starts,
                                ends: ends,
                                booked: false,
                                prezzo: (professor.prezzo * lection_duration).toFixed(2),
                                owner: professor._id
                            });
                            console.log(newLection);

                            //il campo _id della nuova lezione viene aggiunto alla lista delle lezioni del professore
                            professor.lezioni.push(newLection._id);

                            //la nuova lezione viene aggiunta nel database
                            await newLection.save();
                            console.log("Lezione creata con successo all'interno del database");

                            //l'aggiornamento ai dati del professore viene aggiunto nel database
                            await professor.save();
                            console.log("Lezione aggiunta con successo alla lista lezioni del professore con username " + username);

                            //viene inviata all'utente una risposta con codice 201 per confermare l'avvenuta creazione della lezione
                            res.status(201).json({ location: "/api/v1/lection/" + username });
                        } else {
                            message = "L'orario scelto si sovrappone con quello di un'altra lezione";
                        }
                    }
                    if (wrong_data || overlap) {
                        //l'orario inserito per la lezione si sovrappone con quello di un'altra lezione
                        console.log(message);
                        res.status(400).json({ message: message });
                    }
                } else {
                    //i dati inseriti dall'utente non sono validi
                    console.log(message);
                    res.status(400).json({ message: message });
                }
            }
            else {
                //i dati inseriti dall'utente non sono validi
                console.log("L'utente ha inserito dei dati non validi nell'input");
                res.status(400).json({ message: message });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: message });
        }
    });

module.exports = router;