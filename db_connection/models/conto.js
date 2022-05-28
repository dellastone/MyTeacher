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
        ref: "User"
    }
});


ContoSchema.methods.addTransaction = function(transazione){
    let totale = this.totale;
    if(this.owner == transazione.mittente){
        totale = totale - transazione.valore

        if(totale<0){
            totale = totale + transazione.valore
            return false
        }

    }
    else    
        totale = totale + transazione.valore
    
    this.transazioni.push(transazione._id)
    return true
    
}

module.exports = mongoose.model('Conto', ContoSchema)