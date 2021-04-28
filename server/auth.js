const jwt = require('jsonwebtoken');
const auth = require('./app/config/auth');
const config = require('config');

module.exports.isAuthorized = (request, response, next) => {
    let token = request.headers.authorization;
    if (!token) {
        response.sendStatus(403);
        return;
    }
    try {
        jwt.verify(token, config.get('jwtSecret'));
    } catch (e) {
        response.status(403).send({
            message: 'Bad token.'
        });
        return;
    }
    return next();
};
