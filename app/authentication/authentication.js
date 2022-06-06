const express = require('express');
const router = express.Router();
const User = require('../../db_connection/models/user');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens



router.post('', async function (req, res) {
	try {
		const jwtExpirySeconds = 3600;
		//Trova l'uente nel DB
		let user = await User.findOne({
			email: req.body.email
		}).exec();

		//L'utente non è stato trovato
		if (!user) {
			return res.status(400).json({ message: 'Errore, utente non trovato.' });
		}

		//controllo password
		if (!user.validPassword(req.body.password)) {
			return res.status(400).json({ message: 'Errore, password errata.' });
		}

		//crea il token per l'utente
		var payload = {
			email: user.email,
			id: user._id,
			username: user.username

		}
		var options = {
			expiresIn: jwtExpirySeconds,
		}
		var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
		//Salva token 
		res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
		//Login effettuato
		res.status(200).json({
			message: 'Login effettuato.',
			token: token,
			self: "api/v1/users/" + user.username
		});
	} catch (err) {
		return res.status(500).json({ message: 'Errore interno al Server.' });
	}

});



module.exports = router;