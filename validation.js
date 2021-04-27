const Joi = require('@hapi/joi');

const registerValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(6),
		email: Joi.string().min(6).email(),
		password: Joi.string().min(6)
	});
	return schema.validate(data);
}

const loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().min(6).email(),
		password: Joi.string().min(6)
	});
	return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;