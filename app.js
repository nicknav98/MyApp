//Require assets
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const passport = require("passport");
//const req = require("express/lib/request");
const app = express();
const uri = 'mongodb+srv://dbAdmin:SuperUser69@cluster0.yu7vn.mongodb.net/myAppDB';

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


app.use('/public', express.static(__dirname + '/public'));

mongoose.connect(uri, { useNewUrlParser: true }, {useUnifiedTopology: true })

const userSchema = {
    name: String,
    email: String,
    pass: String
}

const User = mongoose.model('User', userSchema);

app.get("/signupPage", function(req,res){
        res.render('signupPage', { });

})

app.get('/index', function(req, res) {
    res.render('index', { });
})


app.get("/private/profile", isLoggedIn, function (req, res) {
    res.render("profile");
});

//Handling user login
app.post("/signupPage", passport.authenticate("local", {
    successRedirect: "/private/profile",
    failureRedirect: "/signUpPage"
}), function (req, res) {
});

//Handling user logout
app.get("/public/index", function (req, res) {
    req.logout();
    res.redirect("/index");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/signupPage");
}

app.post("/", function(req, res) {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass
    });
    newUser.save();
    res.redirect('/');

})

app.listen(3000, function() {
    console.log("server is running on 3000");
})

