const {Router} = require('express')
const config = require('config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation')
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const router = Router()

router.post("/register", jsonParser, async (request, response) => {
	const { error } = registerValidation(request.body);
	if (error) {
		return response.status(400).send(error.details[0].message);
	} else {
		const emailExists = await User.findOne({email: request.body.email});
		console.log(request.body.email);
		if (emailExists) {
			return response.status(400).send('Email already exists');
		} else {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(request.body.password, salt);
			const user = new User({
				name: request.body.name,
				email: request.body.email,
				password: hashedPassword
			});
			try {
				const savedUser = await user.save();
				response.send(200).send("User created");
			} catch (err) {
				response.status(400).send(err);
			}
		}
	}
});

router.post('/login', jsonParser, function(request, response) {
	const { error } = loginValidation(request.body);
	if (error) {
		return response.status(400).send(error.details[0].message);
	} else {
		const user = User.findOne({email: request.body.email});
		if (!user) {
			return response.status(400).send('Email or password is wrong.');
		} else {
			const validPassword = bcrypt.compare(request.body.password, user.password);
			if (!validPassword){
				return response.status(400).send('Password is wrong');
			} else {
				const token = jwt.sign({_id: user._id}, config.get('jwtToken'));
				request.session.token = token;
				response.redirect('/');
			}
		}
	}
});

module.exports = router