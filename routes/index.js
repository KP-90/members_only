var express = require('express');
var router = express.Router();

const posts_controller = require('../controllers/post_controller')
const user_controller = require('../controllers/user_controller')

/* GET home page. */
router.get('/', user_controller.index)

// GET route for user signup 
router.get('/signup', user_controller.signup)

// POST route for user signup
router.post('/signup', user_controller.signup_post)

// GET route for login page
router.get('/login', user_controller.login_get)

// POST & Get route for logging in and out
router.post('/login', user_controller.login_post)
router.get('/logout', user_controller.logout)

// GET & POST route for creating new post
router.get('/create', posts_controller.new_post_get)
router.post('/create', posts_controller.post_new_post)

// GET & POST routes for updating a post
router.get('/update/:id', posts_controller.get_update_post)
router.post('/update/:id', posts_controller.post_update_post)

// Routes for DELETE a post
router.get('/delete/:id', posts_controller.get_delete_post)
router.post('/delete/:id', posts_controller.post_delete_post)

module.exports = router;
