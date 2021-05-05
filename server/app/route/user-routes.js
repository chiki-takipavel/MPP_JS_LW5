const router = require('express').Router();

const authController = require("../controller/authController");
const newsController = require("../controller/newsController");

router.route('/login')
    .post(authController.login);
router.route('/registration')
    .post(authController.registration);
router.route('/images/icons/:name')
    .get(newsController.getIcon);
module.exports = router;
