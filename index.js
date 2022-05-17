require("dotenv").config();
const app = require("./app/app");
const mongoose = require('mongoose');
const errorHandler = require("./errorHandler")

const port = process.env.PORT || 8080;

/*
connects to the mongoDB database using the URI specified in the .env file
*/

app.locals.db = mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    
    console.log("Connected to Database");
    app.listen(port, () => {
        console.log('Server listening on port ' + port);
    });
    
}).catch(err => errorHandler(err));
