var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TransazioneSchema = mongoose.Schema({ 
    valore:{
        type: Number,
        required: true
    },
    id_mittente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    id_ricevente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username_mittente: String,
    username_ricevente: String,
    ricarica: Boolean,
    data: Date,
    lezione:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lection"
    },
    
});



module.exports = mongoose.model('Transazione', TransazioneSchema)