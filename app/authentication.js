const express = require('express');
const router = express.Router();
const User = require('../db_connection/models/user'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


router.post('', async function(req, res) {
	
	// find the user
	let user = await User.findOne({
		email: req.body.email
	}).exec();
	
	// user not found
	if (!user) {
		//test
		const User = require("../db_connection/models/user")
		let user = new User({
			username: "marioR",
			nome: "Mario",
			cognome: "Rossi",
			professore: false,
			email: req.body.email,
			phone: "3122222112",
			//image: Image,
			password: req.body.password,
			materie: [""],
			argomenti: [""],
			prezzo: 0
		});
		user = await user.save();
		//test
		return res.json({ success: false, message: 'Errore, utente non trovato!' });
	}
	
	// check if password matches
	if (user.password != req.body.password) {
		return res.json({ success: false, message: 'Errore, password errata!' });
	}
	
	// if user is found and password is right create a token
	var payload = {
		email: user.email,
		id: user._id
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		email: user.email,
		id: user._id,
		self: "api/v1/" + user._id
	});

});



module.exports = router;