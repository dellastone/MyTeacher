const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../../db_connection/models/user');
const Transaction = require('../../db_connection/models/transaction');
const Conto = require('../../db_connection/models/conto');
const { ContextRunnerImpl } = require('express-validator/src/chain');

/*
API che si occupa di ricaricare il conto dell'utente 
Vengono effettuati dei controlli:
- sul fatto che il numero di carta di credito inserito rappresenti una carta di credito
- controllo che la data di scadenza sia una data 
- controllo che il cvv sia un numero
- controllo che il valore della transazione sia un numero

Il conto dell'utente viene ricaricato con la cifra specificata dall'utente
La transazione effettuata viene aggiunta al database e ne viene salvato l'id nel conto dell'utente
*/

router.post(
    '',
    [
        body('cardNumber').exists().withMessage("Inserisci il numero della tua carta di credito").isAlphanumeric().withMessage("La carta di credito inserita non esiste o è scaduta"),
        body('expirationDate').exists().withMessage("Inserisci la data di scadenza della tua carta di credito").isDate().withMessage("La data inserita non è valida"),
        body('cvv').exists().withMessage("Inserisci il tuo cvv").isNumeric().withMessage("Il cvv inserito non è valido"),
        body('amount').exists().withMessage("Inserisci la cifra che vuoi ricaricare sul tuo conto").isNumeric().withMessage("La cifra inserita deve essere un numero valido")
    ], async (req, res) => {
        let message = "Si è verificato un errore nella ricarica del conto, la preghiamo di riprovare";
        try {
            //se uno dei controlli sui dati inseriti non è andato a buon fine viene settato un errore
            let errors = validationResult(req).array();
            let wrong_data = false;

            if (errors.length > 0) {
                wrong_data = true;
                message = errors[0].msg;
            }

            //se i dati inseriti dall'utente sono validi si procede con la ricarica del conto
            if (!wrong_data) {

                const username = req.loggedUser.username;
                const cardNumber = req.sanitize(req.body.cardNumber);
                const expirationDate = req.sanitize(req.body.expirationDate);
                const cvv = req.sanitize(req.body.cvv);
                const amount = Number(req.sanitize(req.body.amount));
                const date = new Date();

                //l'utente che ha effettuato la transazione viene ricercato nel database
                const user = await User.findOne({ username: username });

                //se l'utente cercato esiste
                if (user != null) {
                    //viene creata la transazione, nel caso della ricarica l'id e username di mittente 
                    //e ricevente sono sempre quelli dello stesso utente
                    let newTransaction = new Transaction({
                        mittente: user._id,
                        username_mittente: username,
                        ricevente: user._id,
                        username_ricevente: username,
                        data: date,
                        ricarica: true,
                        valore: amount.toFixed(2)
                    });

                    //il conto dell'utente viene recuperato dal database
                    const conto = await Conto.findOne({ _id: user.conto });

                    //se il conto viene recuperato correttamente si procede con l'inserimento della transazione 
                    if (conto != null) {

                        //la transazione viene aggiunta al conto dell'utente 
                        conto.addTransaction(newTransaction);
                        //la transazione viene salvata nel database
                        await newTransaction.save();

                        console.log("La ricarica di " + amount.toFixed(2) + " euro sul suo conto è avvenuta con successo");
                        res.status(200).json({ location: "api/v2/conto" + username });
                    }
                    else {
                        //il conto dell'utente non è stato recuperato correttamente dal database
                        message = "Il suo conto non è stato trovato nei nostri database, la preghiamo di riprovare";
                        console.log(message);
                        res.status(400).json({ message: message });
                    }
                }
                else {
                    //l'utente che ha effettuato la transazione non esiste
                    message = "Il suo utente non è stato trovato nei nostri database, la preghiamo di riprovare";
                    console.log(message);
                    res.status(400).json({ message: message });
                }
            }
            else {
                //uno dei controlli sui dati inseriti dall'utente non è andato a buon fine
                console.log(message);
                res.status(400).json({ message: message });
            }
        } catch (err) {
            //si è verificato un errore durante lo svolgimento della funzione
            console.log(err);
            res.status(500).json({ message: message });
        }
    });

module.exports = router;