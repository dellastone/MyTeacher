const express = require('express');
const router = express.Router();
const Lection = require('../db_connection/models/lection');
const User = require('../db_connection/models/user');
const Conto = require('../db_connection/models/conto');
const Transaction = require('../db_connection/models/transaction');

/*
API per effetturare il pagamento di una lezione precedentemente prenotata da uno studente.
La transazione avviene dal conto dello studente che ha prenotato la lezione al conto del professore proprietario della lezione.

Controlli effettuati a priori:
- presenza nel DB della lezione che si vuole pagare
- se la lezione è stata prenotata (requsito fondamentale per poterla pagare)
- se la lezione è già stata pagata

Superati questi controlli, vengono prelevati dal database i conti dello studente e del professore in questione.
Prima di effettuare la transazione viene controllato che il saldo del conto dello studente sia sufficiente a pagare la lezione.

In conclusione viene effettuata la transazione:
- viene creato un nuovo oggetto transazione
- viene aggiunta la transazione al db e il suo id alla lista delle transazioni effettuate dallo studente e dal professore
- con l'aggiunta della transazione vengono aggiornati i conti dello studente e del professore
- la lezione viene aggiornata a lezione pagata

*/


router.post('', async function (req, res) {
    try {
        const lection = await Lection.findOne({
            _id: req.body.lection_id
        }).exec();
        console.log(lection)

        // controlli fatti a priori
        if (!lection) {
            return res.status(400).json({ message: 'Errore, lezione non trovata.' });

        }
        if (!lection.booked) {
            return res.status(400).json({ message: 'Errore, non ancora prenotata.' });
        }
        if (lection.paid) {
            return res.status(400).json({ message: 'Errore, lezione già pagata.' });
        }

        // vengono presi il prezzo della lezione ed i conti del professore e dello studente
        lection_price = lection.prezzo;
        const std_username = lection.student_username;
        const prof_username = lection.prof_username;
        const std_account = await User.findOne({ username: std_username }, ["conto"]).exec();
        const prf_account = await User.findOne({ username: prof_username }, ["conto"]).exec();
        let std_conto = await Conto.findOne({ _id: std_account.conto });
        let prf_conto = await Conto.findOne({ _id: prf_account.conto });

        // controllo se il saldo del conto dello studente è sufficiente a pagare la lezione
        let std_tot_conto = std_conto.totale;
        if (std_tot_conto < lection_price) {
            return res.status(400).json({ message: 'Errore, il tuo saldo non è sufficiente per pagare la lezione.' });
        }

        


        // creazione del nuovo oggetto transazione
        std_usr = await User.findOne({ username: std_username });
        prf_usr = await User.findOne({ username: prof_username });
        date = new Date();
        val = lection_price;

        let new_transaction = new Transaction({
            mittente: std_usr._id,
            username_mittente: std_username,
            ricevente: prf_usr._id,
            username_ricevente: prof_username,
            data: date,
            ricarica: false,
            valore: val,
            lezione: lection._id
        });

        // aggiunta della transazione alla lista degli id delle transazione fatti dallo studente e dal professore ed effettivo aggionramneto dei rispettivi conti
        resS = std_conto.addTransaction(new_transaction);
        resP = prf_conto.addTransaction(new_transaction);

        // controllo del corretto salvataggio dell'id della transazione nei conti del professore e dello studente
        if(!resS){
            return res.status(400).json({ message: 'Errore, transazione non salvata correttamente.' });
        }
        if(!resP){
            return res.status(400).json({ message: 'Errore, transazione non salvata correttamente.' });
        }
        
        // salvataggio dell'oggetto transazione nel DB
        await new_transaction.save();

        // aggionamento nel DB della lezione a lezione pagata
        lection.paid = true;
        await lection.save();

        res.status(200).json({
            message: "Transazione effettuata correttamente."
        });



    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Errore interno al Server.' });
    }

});

module.exports = router;