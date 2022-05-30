var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ContoSchema = mongoose.Schema({ 
    totale:{
        type: Number,
        default: 0
    },
    transazioni: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transazioni"
        }
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});


//data una transazione la inserisce all'interno del conto aggiornando il totale nel modo corretto
//se la transazione va a buon fine ritorna true altrimenti se l'utente mittente non ha abbastanza soldi sul conto restituisce false

ContoSchema.methods.addTransaction = function(transazione){
    let totale = this.totale;
    //se il conto è dell'utente ricevente o si tratta di una ricarica aggiorna il totale aggiungendo i fondi
    if(this.owner == transazione.ricevente || transazione.ricarica == true){
        totale = totale + transazione.valore;
    }
    else{
        //sottrai al totale il valore della transazione e se non si dispone di abbastanza denaro restituisci false e annulla la transazione
        totale = totale - transazione.valore;

        if(totale<0){
            totale = totale + transazione.valore;
            return false;
        }

    }
    //se la transazione è andata a buon fine aggiorna il totale e inserisci l'id della transazione salvando il conto
    this.totale = totale;
    this.transazioni.push(transazione._id);
    this.save();
    return true;
    
}

module.exports = mongoose.model('Conto', ContoSchema);
