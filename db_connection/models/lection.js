var mongoose = require('mongoose');

// mongoose model that desribes the user of the platform
const LectionSchema = mongoose.Schema({ 
    student_username: {
        type: String,
    },
    prof_username: {
        type: String,
        required: true
    },
    starts:{
        type: Date,
        required: true
    },
    ends:{
        type: Date,
        required: true 
    },
    booked: Boolean,
    prezzo: Number,
    paid: Boolean,
    materie: [String],
    argomenti: [String],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});


module.exports = mongoose.model('Lection', LectionSchema);