var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose model that desribes the user of the platform
module.exports = mongoose.model('Student', new Schema({ 
    username: String,
    nome: String,
    cognome: String,
    indirizzo: String,
    professore: Boolean,
	email: String,
    phone: String,
    image: String,
	password: String,
    materie: [String],
    argomenti: [String],
    prezzo: Number
}));