const { body,validationResult } = require('express-validator');
const Users = require('../models/users')
const Posts = require('../models/posts')

// GET for creating new post
exports.new_post_get = function(req, res, next) {
    res.render('post_form', {title: "Create New Post", user: req.user})
}

exports.post_new_post = [
    body('post_text', "Error with post"),
    (req, res, next) => {
        console.log(req.body.post_text)
        console.log(req.body)
        
        const errors = validationResult(req);

        let new_post = new Posts({
            author: req.user.id,
            text: req.body.post_text, // not saving text for some reason
            timestamp: Date.now()
        })
        console.log(new_post)
        if(!errors.isEmpty()) {
            console.log(errors.array())
            res.render('post_form', {title: "Create New Post", text: req.body.post_text, errors: errors.array()})
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