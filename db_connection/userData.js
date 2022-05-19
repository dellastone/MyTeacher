const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('./models/user');
const user = require('./models/user');

//controlla se le due password inserite dall'utente corrispondono
function checkSamePassword(pass1, pass2) {
    if (pass1 === pass2) {
        return true;
    } else {
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
/*
Lista controlli:
- controlla che lo username, il nome, il cognome, la mail, le password e il campo professore siano presenti
- controlla che la mail sia valida, che il numero di telefono sia valido (se presente)
- controlla che l'immagine sia in base64 
- controlla che il prezzo sia un numero
*/
router.post(
    '',
    [
        body('username').exists().withMessage("Scegli uno username").isAlphanumeric().withMessage("Username non valido, deve essere una stringa alfanumerica"),
        body('email').exists().withMessage("Inserisi un indirizzo email per continuare").isEmail().withMessage("L'email inserita non è valida"),
        body('nome').exists().withMessage("Inserisci il tuo nome prima di continuare").isAlpha().withMessage("Nome non valido"),
        body('cognome').exists().withMessage("Inserisci il tuo cognome prima di continuare").isAlpha().withMessage("Cognome non valido"),
        body('phone').optional().isMobilePhone().withMessage("Numero di telefono non valido"),
        body('image').optional().isBase64().withMessage("L'immagine non è stata caricata correttamente"),
        body('password').exists().withMessage("Inserisci una password prima di continuare").isStrongPassword().withMessage("La password inserita non è sicura, deve contenere almeno 8 caratteri, una lettera maiuscola, un numero e un carattere speciale"),
        body('repeatpassword').exists().withMessage("Completa il campo ripeti password per continuare"),
        body('professore').exists().withMessage("E' obbligatorio scegliere se creare un account professore o studente"),
        body('prezzo').optional().isNumeric().withMessage("Il prezzo inserito non è valido")
    ], async (req, res) => {
        //messaggio che viene ritornato all'utente in caso di errore
        let message = "Si è verificato un errore nella registrazione, la preghiamo di riprovare.";
        try{
            //se uno dei controlli non è andato a buon fine viene settato un errore
            let errors = validationResult(req).array();
            let wrong_data = false;

            if (errors.length > 0) {
                wrong_data = true;
                message = errors[0].msg;
            }
            //sanificazione dell'input
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
            if(req.body.materie != undefined){
                for (let i = 0; i < req.body.materie.length; i++) {
                    materie[i] = req.sanitize(req.body.materie[i]);

                }
            }
            let argomenti = [];
            if(req.body.argomenti != undefined){
                for (let i = 0; i < req.body.argomenti.length; i++) {
                    argomenti[i] = req.sanitize(req.body.argomenti[i]);
                }
            }
            if (!wrong_data) {
                //controlla se le due password inserite dall'utente sono uguali 
                //controlla se esite già un utente con lo stesso username o con la stessa mail
                if (checkSamePassword(password, repeatpassword)) {
                    let search_username = await User.findOne({ username: username }).exec();
                    if (search_username != null) {
                        message = "Username non disponibile";
                        wrong_data = true;
                    }
                    else {
                        let search_email = await User.findOne({ email: email }).exec();
                        if (search_email != null) {
                            message = "Esiste già un utente registrato con questo indirizzo email";
                            wrong_data = true;
                        } else {
                            //l'utente viene aggiunto al database
                            //i campi variano in base al tipo di utente: (studente o professore)
                            console.log("Adding the user to the db ...");
                            let newUser;
                            if (professor == "true") {
                                newUser = new User({
                                    username: username,
                                    nome: name,
                                    cognome: surname,
                                    indirizzo: address,
                                    professore: professor,
                                    email: email,
                                    phone: phone,
                                    image: image,
                                    materie: materie,
                                    argomenti: argomenti,
                                    prezzo: Number(price)
                                });
                            }
                            else {
                                console.log("false");
                                newUser = new User({
                                    username: username,
                                    nome: name,
                                    cognome: surname,
                                    indirizzo: address,
                                    professore: professor,
                                    email: email,
                                    phone: phone,
                                    image: image
                                });
                            }
                            //la password dell'utente viene settata calcolandone l'hash
                            newUser.setPassword(password);
                            console.log(newUser);
                            await newUser.save();
                        }
                    }
                }
                else {
                    wrong_data = true;
                    message = "Le due password inserite non corrispondono";
                }
            }
            if (wrong_data) {
                //nel caso in cui l'utente abbia inserito degli input errati gli viene inviato un codice 400 con un messaggio di errore
                console.log("L'utente ha inserito dei dati non validi nell'input");
                res.status(400).json({ message: message });
            }
            else {
                //nel caso in cui l'utente sia stato correttamente creato viene ritornato un codice 201
                console.log("Utente creato con successo e aggiunto al database");
                res.status(201).json({ location: "/api/v1/users/" + username });
            }
        }catch(err){
            //nel caso di errore del server viene ritornato un errore con codice 500
            res.status(500).json({ message: message });
        }
    });

router.get('', async (req, res) => {
    let message = "Si è verificato un errore durante la ricerca utenti, la preghiamo di riprovare";
    try{
        //ricerca drgli utenti nel database, solo i campi da ritornare vengono recuperati 
        //non viene ritornato l'_id creato da mongoDB, l'hash della password e il salt
        console.log("Ricerca utenti nel database ...");
        
        const users = await User.find({ }, ['-_id', 'username', 'nome', 'cognome', 'indirizzo', 'professore', 'email', 'phone', 'image', 'materie', 'argomenti', 'prezzo']).exec();

        //dati ritornati all'utente
        console.log("Lista utenti ritornata correttamente all'utente");
        res.status(200).json(users);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: message});
    }
});

router.get('/:username', async (req, res) => {

    let message = "Si è verificato un errore nel recupero dei dati dell'utente, si prega di ricaricare la pagina";

    try{

        const username = req.params.username;
        if(username == null || username == undefined){
            message = "E' necessario specificare uno username valido";
            res.status(400).json({ message: message });
        }
        else{
            //recupero dei dati dell'utente dal database 
            //non viene ritornato l'_id creato da mongoDB, l'hash della password e il salt
            console.log("Ricerca dell'utente con username " + username + " nel database ...");

            const user = await User.findOne({ username: username }, ['-_id', 'username', 'nome', 'cognome', 'indirizzo', 'professore', 'email', 'phone', 'image', 'materie', 'argomenti', 'prezzo']).exec();
            console.log(user);
            if(user == null){
                //utente non trovato nel database, viene ritornato un errore all'utente
                message = "Utente non presente nel database";
                res.status(400).json({ message: message });
            }
            else{
                //dati ritornati all'utente
                console.log("Dati utente recuperati correttamente");
                res.status(200).json(user);
            }
    }
    }catch(err){
        console.log(err);
        res.status(500).json({ message: message });
    }
});

module.exports = router;
