const { body,validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const Users = require('../models/users')
const Posts = require('../models/posts')
const passport = require("passport");

// Main page
exports.index = function(req, res) {
  res.render('index', { title: 'Express', user: req.user });
}
// Get signup page
exports.signup = (req, res) => res.render('signup')

// POST signup page
exports.signup_post = [
    body('username', 'Error with username').trim().isAlphanumeric().isLength({ min: 3}).escape().custom(async (username) => {
        return Users.findOne({username: username})
        .then(result => {
            if (result !== null) {
                return Promise.reject("Username already taken")
            }
        })
    }),
    body('password', 'Error with password').escape(),
    body('confirm_password').escape().custom(async (confirm_password, {req}) => {
        if (confirm_password != req.body.password) {
            console.log("Error with password matching")
            throw new Error("passwords must match")
        }
    }),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log("error in user validation")
            console.log(errors.array())
            res.render('signup', {errors: errors.array()})
        }
        else{
            // Hash password & Save data 
            bcrypt.hash(req.body.password, 1, (err, hashed_pass) => {
                let new_user = new Users({
                    username: req.body.username,
                    password: hashed_pass
                }).save(err=>{
                    if(err) {
                        return next(err)
                    }
                    res.redirect("/")
                })
            })
        }
    }
]

// GET log in page
exports.login_get = function(req, res) {
    res.render('login')
}

// POST logging user in
exports.login_post = function(req, res, next) {
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/login'
    })(req, res, next);
}

// GET logout user
exports.logout = function(req, res, next) {
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
}