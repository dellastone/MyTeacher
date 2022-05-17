const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('./models/user');

//controlla se le due password inserite dall'utente corrispondono
function checkSamePassword(pass1, pass2){
    if(pass1 === pass2){
        return true;
    }else{
        return false;
    }
}

/*
API che si occupa della registrazione dell'utente al database,
effettua un controllo sui campi presenti nella richiesta e
se essi sono corretti effettua la registrazione dell'utente.
Se i campi non sono corretti ritorna un errore con codice 400 
e un messaggio per spiegare all'utente quale delle informazioni inserite 
è sbagliata.
Se si verifica un errore del server o un errore nell'inserimento
nel database ritorna un errore con codice 500.
*/
router.post(
    '',
    [
        body('username').isAlphanumeric().exists().withMessage("Username non valido"),
        body('email').isEmail().withMessage("L'email inserita non è valida"),
        body('nome').exists().isAlpha().withMessage("Nome non valido"),
        body('cognome').exists().isAlpha().withMessage("Cognome non valido"),
        body('phone').optional().isMobilePhone().withMessage("Numero di telefono non valido"),
        body('password').isStrongPassword().withMessage("La password inserita non è sicura, deve contenere almeno 8 caratteri, una lettera maiuscola, un numero e un carattere speciale"),
        body('professore').exists().withMessage("E' obbligatorio scegliere se creare un account professore o studente"),
        body('prezzo').optional().isNumeric().withMessage("Il prezzo inserito non è valido")
    ], async (req, res) =>{
        var errors = validationResult(req).array();
        let message = "Si è verificato un errore nella registrazione, la preghiamo di riprovare.";
        let wrong_data = false;
        let server_error = false;

        if(errors.length>0){
            wrong_data = true;
            message = errors[0].msg;
        }

        const username = req.sanitize(req.body.username);
        const name = req.sanitize(req.body.nome);
        const surname = req.sanitize(req.body.cognome);
        const professor = req.sanitize(req.body.professore);
        const email = req.sanitize(req.body.email);
        const password = req.sanitize(req.body.password);
        const repeatpassword = req.sanitize(req.body.repeatpassword);
        const address = req.sanitize(req.body.address);
        const phone = req.sanitize(req.body.phone);
        const image = req.sanitize(req.body.image);
        const price = req.sanitize(req.body.prezzo);
        let materie = [];
        for(let i=0; i<req.body.materie.length; i++){
            materie[i] = req.sanitize(req.body.materie[i]);
            
        }
        let argomenti = [];
        for(let i=0; i<req.body.materie.argomenti; i++){
            argomenti[i] = req.sanitize(req.body.argomenti[i]);
        }

        if(!wrong_data){
            if(checkSamePassword(password, repeatpassword))
            {
                
            }
            else{
                wrong_data = true;
                message = "Le due password inserite non corrispondono";
            }
        }
        if(wrong_data){
            res.status(400).json({ message: message });
        }
        else if (server_error){
            res.status(500).json({ message: message });
        }
        else{
            res.status(201).json({ location: "/api/v1/users/" + username });
        }
    }); 

module.exports = router;
