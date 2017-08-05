var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    flash            = require("connect-flash"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    User             = require("./models/user"),
    Blog             = require("./models/blog");
    
// Requiring Routes
var blogRoutes       = require("./routes/blog"),
    indexRoutes      = require("./routes/index");
    

var url = process.env.DATABASEURL || "mongodb://localhost/blog";    
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Blog Application",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);


// app.listen
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running...");
});

