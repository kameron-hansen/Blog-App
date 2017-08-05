var Blog = require("../models/blog");
var middlewareObj = {};

// Check to see if a user is logged in 
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must login before you can do that...");
    res.redirect("/login");
}

// Check to see if user owns post
middlewareObj.checkPostOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                req.flash("error","Something went wrong");
                res.redirect("back");
            } else {
                if(foundBlog.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must login before you can do that...");
        res.redirect("back");
    }
};

module.exports = middlewareObj;