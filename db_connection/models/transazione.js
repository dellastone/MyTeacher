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
    id_destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    usr_mittente: String,
    usr_destinatario: String,
    ricarica: Boolean,
    data: Date,
    lezione:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lection"
    },
    
});



module.exports = mongoose.model('Transazione', TransazioneSchema)