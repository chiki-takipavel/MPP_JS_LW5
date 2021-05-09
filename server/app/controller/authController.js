const User = require('../model/userModel');
const passport = require('passport');
const authenticate = require('../auth/authenticate');

exports.registration = (req, res) => {
    console.log("register", req.body);
    User.register(new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        role: "user"
    }), req.body.password, (err, user) => {
        console.log("inside reg register");

        if (err) {
            console.log(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        } else {
            passport.authenticate('local')(req, res, () => {
                const token = authenticate.generateToken({
                    _id: req.user._id,
                    name: req.user.name,
                    email: req.user.email
                });
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({token: token, status: 'Successfully Logged In'});
            });
        }
    });
};

exports.login = (req, res) => {
    console.log("we are in login")
    passport.authenticate('local')(req, res, () => {
        const token = authenticate.generateToken({_id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role});
        console.log(token);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({token: token, status: 'Successfully Logged In'});
    });
};