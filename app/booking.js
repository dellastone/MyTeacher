const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Lection = require('../db_connection/models/lection'); // get our mongoose model
const User = require('../db_connection/models/user');



router.post('', async function (req, res) {
	try {
		
		let lection = null;
		if(mongoose.Types.ObjectId.isValid(req.body.lection_id)){
			lection = await Lection.findOne({
				_id: req.body.lection_id
			}).exec();
		}
		console.log(lection)
		const std = await User.findOne({
			username: req.loggedUser.username
		}).exec();

		if(!std){
			return res.status(400).json({ message: 'Errore, utente non trovato.' });
		}
		if(!lection){
			return res.status(400).json({ message: 'Errore, lezione non trovata.' });

		}
		if(lection.booked){
			return res.status(400).json({ message: 'Errore, lezione già prenotata.' });
		}
		if(std.professore){
			return res.status(400).json({ message: 'Errore, il professore non può prenotare la lezione.' });
		}


		if(req.body.materie != undefined)
			lection.materie = req.body.materie
		if(req.body.argomenti != undefined)
			lection.argomenti = req.body.argomenti
		lection.student_username = std.username
		lection.booked = true;
		await lection.save();

		let std_lections =  std.lezioni;
		std_lections.push(lection);
		std.lezioni = std_lections;
		await std.save();

		res.status(200).json({
			message: "lection booked"
		});



	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: 'Errore interno al Server.' });
	}

});

router.delete('', async function (req, res) {
	try {
		


		const lection = await Lection.findOne({
			_id: req.body.lection_id
		}).exec();
		
		if(!lection){
			return res.status(400).json({ message: 'Errore, lezione non trovata.' });

		}
		
		
		lection.materie = ""
		lection.argomenti = ""
		lection.student_username = ""
		lection.booked = false;
		await lection.save();


		res.status(200).json({
			message: "the lection is no longer booked"
		});



	} catch (err) {
		console.log(err)
		return res.status(500).json({ message: 'Errore interno al Server.' });
	}

});



module.exports = router;