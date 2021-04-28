const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const auth = require('../config/auth');
const md5 = require('md5');
const config = require('config');

exports.registration = (request, response) => {
    console.log("registration")
    let user = new User();
    user.name = request.body.name;
    user.surname = request.body.surname;
    user.email = request.body.email;
    user.role = request.body.role;
    user.password = getHashPassword(request.body.password);
    user.save((err) => {
        if (err) {
            if (err.code === 11000) {
                response.status(409).send({message: 'Account already exists.'});
                return;
            }
            response.status(400).send(err);
            return
        }
        response.status(200).send({
            token: generationToken(user)
        })

    })
};

exports.login = (request, response) => {
    console.log("login")
    User.findOne({email: request.body.email, password: getHashPassword(request.body.password)}, (err, user) => {
        if (!user) {
            console.log("user not found")
            response.status(404).send({
                message: 'User not found.'
            });
            return;
        }
        if (err) {
            console.log("error")
            response.send(err);
            return;
        }

        response.status(200).send({
            token: generationToken(user)
        })
    })
};
let generationToken = (user) => {
    return jwt.sign({
        name: user.name,
        email: user.email,
        surname: user.surname,
        role: user.role
    }, config.get('jwtSecret'), {expiresIn: config.get('jwtExpires')});
};

let getHashPassword = (password) => {
    return md5(password);
};
