const router = require('express').Router();
const newsController = require('../controller/newsController');
const authController = require('../controller/authController');

router.route('/news')
    .get(newsController.getAllNewsPage);

router.route('/api/news')
    .get(newsController.getAllNews);

router.route('/news/:news_id')
    .get(newsController.getById);

router.route('/api/images/icons/:name')
    .get(newsController.getIcon);

router.route('/api/registration').post(authController.registration);
router.route('/api/login').post(authController.login);

module.exports = router;