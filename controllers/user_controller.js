const { body,validationResult } = require('express-validator');
const Users = require('../models/users')
const Posts = require('../models/posts')


exports.signup = (req, res) => res.render('signup')

exports.login = function(req, res) {
    res.send('loggin not implemented')
}
