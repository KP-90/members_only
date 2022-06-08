const { body,validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const passport = require("passport");
const async = require('async')
const Users = require('../models/users')
const Posts = require('../models/posts')

// Main page
exports.index = function(req, res) {
    Posts.find({}).sort({'timestamp': -1}).populate("author").exec(function(err, result) {
        res.render('index', { title: 'Express', user: req.user, posts: result});
    })
  
}

// User detail page
exports.get_user = function(req, res, next) {
    async.parallel({
        posts: function(callback){
            Posts.find({}).sort({'timestamp':-1}).where('author').equals(req.params.id).populate('author').exec(callback)
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
    body('username').trim().isAlphanumeric().isLength({ min: 3}).withMessage("Username must be at least 3 characters").escape().custom(async (username) => {
        return Users.findOne({username: username})
        .then(result => {
            if (result !== null) {
                return Promise.reject("Username already taken")
            }
        })
    }),
    body('password', 'Error with password').isLength({min: 5}),
    body('confirm_password').custom(async (confirm_password, {req}) => {
        if (confirm_password != req.body.password) {
            throw new Error("passwords must match")
        }
    }),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
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
    body('confirm_admin', "Incorrect password").custom((value, {req}) => {
        return value === process.env.ADMIN
    }),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render('member_signup', {errors: errors.array()})
        }
        else {
            Users.findByIdAndUpdate(req.user.id, {admin: true}).exec(function(err, result) {
                res.redirect('../user/' + req.user.id )
            })
        }
    }
]

exports.delete_account = function(req, res, next) {
    async.parallel({
        posts_to_delete: function(callback) {
            Posts.deleteMany({'author': req.params.id}).exec(callback)
        },
        user_to_delete: function(callback) {
            Users.findByIdAndDelete(req.params.id).exec(callback)
        }
    }, function(err, result) {
        if(err) next(err)
        else{
            res.render('test', {user: result.user_to_delete, posts: result.posts_to_delete})
        }
    })
}