const { body,validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const Users = require('../models/users')
const Posts = require('../models/posts')
const passport = require("passport");
const async = require('async')

// Main page
exports.index = function(req, res) {
    Posts.find({}).populate("author").exec(function(err, result) {
        res.render('index', { title: 'Express', user: req.user, posts: result});
    })
  
}

// User detail page
exports.get_user = function(req, res, next) {
    async.parallel({
        posts: function(callback){
            Posts.find({}).where('author').equals(req.params.id).exec(callback)
        },
        user: function(callback) {
            Users.findById(req.params.id).exec(callback)
        }
    }, function(err, results) {
        if (err) next(err)
        res.render('user_detail', {posts: results.posts, user: results.user})
    })
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

// GET signup page
exports.get_member_signup = function(req, res) {
    res.render('member_signup', {title: "Become a Member"})
}

// Handle POST route for member signup
exports.post_member_signup = [
    body("confirm_member", "Please check the box.").isAlphanumeric(),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log("error in validation")
            console.log(errors.array())
            res.render('member_signup', {errors: errors.array()})
        }
        else {

            Users.findByIdAndUpdate(req.user.id, {member: true}).exec(function(err, result) {
                res.redirect('user/' + req.user.id )
            })
        }
    }
]

exports.post_admin_signup = [
    body('confirm_admin', "incorrect password").custom((value, {req}) => {
        return value === process.env.ADMIN
    }),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            console.log("error in admin")
            console.log(errors.array())
            res.render('member_signup', {errors: errors.array()})
        }
        else {
            Users.findByIdAndUpdate(req.user.id, {admin: true}).exec(function(err, result) {
                res.redirect('../user/' + req.user.id )
            })
        }
    }
]