var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose model that desribes the user of the platform
module.exports = mongoose.model('user', new Schema({ 
    username: String,
    nome: String,
    cognome: String,
    professore: Boolean,
	email: String,
    phone: String,
    //image: Image,
	password: String,
    materie: [String],
    argomenti: [String],
    prezzo: Number
}));