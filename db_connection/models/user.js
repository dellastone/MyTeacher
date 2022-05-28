var mongoose = require('mongoose');
const crypto = require('crypto');
var Schema = mongoose.Schema;

// mongoose model that desribes the user of the platform
const UserSchema = mongoose.Schema({ 
    username: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    indirizzo: String,
    professore: {
        type: Boolean,
        required: true
    },
	email: {
        type: String,
        required: true
    },
    phone: String,
    image: String,
	passwordHash: String,
    salt: String,
    materie: [String],
    argomenti: [String],
    prezzo: Number,
    lezioni: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lection"
        }
    ],
    conto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conto"
    }
});

//crea un salt per la password unico per l'utente scelto, cripta la password dell'utente
UserSchema.methods.setPassword = function (password){
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); 
};

//verifica se la password inserita è uguale a quella dell'utente calcolandone l'hash
UserSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); 
    return this.passwordHash === hash; 
};
UserSchema.methods.addTransaction = function(transaction) { 
    return this.conto.addTransaction(transaction);
}; 

module.exports = mongoose.model('User', UserSchema)