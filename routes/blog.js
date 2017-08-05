var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");
var Blog = require("../models/blog");

// INDEX List all blogs
router.get("/", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs}); 
        }
    });
});

// NEW Show new blog form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("new");
});

// CREATE create new blog, then redirect it
router.post("/", middleware.isLoggedIn, function(req, res){
    var title = req.body.blog.title;
    var image = req.body.blog.image;
    var body = req.body.blog.body;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBlog = {title: title, image: image, body: body, author:author};
    
    Blog.create(newBlog, function(err, newBlog){
        if(err){
            req.flash("error", "An error occurred, blog could not be created.");
            res.redirect("back");
        } else {
            console.log(newBlog);
            req.flash("success", "Blog successfully posted.");
            res.redirect("/blogs");
        }
    });
});

// SHOW show info about one specific blog
router.get("/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT show edit form for one specific blog
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");     
        } else {
            res.render("edit",{blog: foundBlog});       
        }
    });
});

// UPDATE a selected blog
router.put("/:id", middleware.checkPostOwnership, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE remove a blog
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

module.exports = router;