var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TransactionSchema = mongoose.Schema({
    mittente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username_mittente: {
        type: String,
        required: true
    },
    ricevente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    username_ricevente: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    ricarica: {
        type: Boolean,
        required: true
    },
    valore: {
        type: Number,
        required: true
    },
    lezione: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lection"
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);