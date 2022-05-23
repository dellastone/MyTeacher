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
    date:{
        type: Date,
        required: true
    },
    start_time:{
        type: String,
        required: true
    },
    end_time:{
        type: String,
        required: true 
    },
    booked: Boolean,
    materie: [String],
    argomenti: [String],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});


module.exports = mongoose.model('Lection', LectionSchema)