var express = require('express');
var router = express.Router();

const posts_controller = require('../controllers/post_controller')
const user_controller = require('../controllers/user_controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', user_controller.signup)

router.get('/login', user_controller.login)

module.exports = router;
