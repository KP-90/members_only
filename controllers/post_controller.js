/*
    Handle all routes related to individual posts.
*/

const { body,validationResult } = require('express-validator');
const Users = require('../models/users')
const Posts = require('../models/posts')

// GET for creating new post
exports.new_post_get = function(req, res, next) {
    res.render('post_form', {title: "Create New Post", user: req.user})
}

// Handle POST route for creating a new post.
exports.post_new_post = [
    /*---------------------------------------------------------------------------------------------|
    |   Don't forget to change the post_update_post function as well if any changes are made here  |
    |______________________________________________________________________________________________|*/
    body('post_text', "Error with post").trim().notEmpty().escape(),
    (req, res, next) => {
        console.log(req.body.post_text)
        const errors = validationResult(req);
        // Save post to a variable for use in re-rendering form if need be
        let new_post = new Posts({
            author: req.user.id,
            text: req.body.post_text,
            timestamp: Date.now()
        })

        if(!errors.isEmpty()) {
            // Re-render form with input still intact.
            res.render('post_form', {title: "Create New Post", text: new_post.text, errors: errors.array()})
        }
        else {
            new_post.save(err=>{
                if(err) {
                    return next(err)
                }
                res.redirect("/")
            })
        }
    }
]

// Display GET page for updating a post
exports.get_update_post = function(req, res, next) {
    Posts.findById(req.params.id).exec(function(err, result) {
        res.render('post_form', {title: "Update post", text: result.text})
    })
}

// Hanndle POST request for UPDATE a post
exports.post_update_post = [
    /*---------------------------------------------------------------------------------------------|
    |   Don't forget to change the post_create_post function as well if any changes are made here  |
    |______________________________________________________________________________________________|*/
    body('post_text', "Error with post").trim().notEmpty().escape(),
    (req, res, next) => {
        
        const errors = validationResult(req);
        // Save post to a variable for use in re-rendering form if need be
        let new_post = new Posts({
            author: req.user.id,
            text: req.body.post_text,
            timestamp: Date.now(),
            _id: req.params.id
        })

        if(!errors.isEmpty()) {
            // Re-render form with input still intact.
            res.render('post_form', {title: "Update Post", text: new_post.text, errors: errors.array()})
        }
        else {
            Posts.findByIdAndUpdate(req.params.id, new_post, {}, function(err, result) {
                res.redirect('/')
            })
        }
    }
]

// GET delete post. Has no content for now and shouldn't be linked to at this time.
exports.get_delete_post = function(req, res, next) {
    res.send("How did you get here?")

}

// POST route for deleting a post.
exports.post_delete_post = function(req, res, next) {
    Posts.findById(req.params.id).exec(function(err, result) {
        Posts.findByIdAndRemove(req.params.id, function deleting(err) {
            res.redirect("/")
    })
    })
    
}