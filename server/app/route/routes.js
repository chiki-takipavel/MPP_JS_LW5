const router = require('express').Router();
const authController = require('../controller/authController');
const passport = require('passport');
const newsController = require("../controller/newsController");

router.route('/registration').post(authController.registration);
router.route('/login').post(authController.login);
router.route('/images').get();
router.route('/images/icons/:name')
    .get(newsController.getIcon);
module.exports = router;
