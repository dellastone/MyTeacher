var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TransazioneSchema = mongoose.Schema({ 
    valore:{
        type: Number,
        required: true
    },
    mittente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    ricarica: Boolean,
    lezione:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lection"
    },
    
});



module.exports = mongoose.model('Transazione', TransazioneSchema)