//Require assets
const express = require('express');
const app = express();
const mongoose = require('mongoose');
let port = 3000;

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://dbAdmin:SuperUser@cluster0.yu7vn.mongodb.net/myApp?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
    const collection = client.db('myApp').collection('users');
    // perform actions on the collection object
    client.close();
});

mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    pass: String
})

var userDataS = mongoose.model('User', userSchema);

//Load index page using endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/loginPage.html');
});

//Post using endpoint
app.post('/users', (req, res) => {
    var userData = {
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass
    }
    new userDataS(userData)
        .save()
        .then(result => { // note the use of a different variable name
            res.send(result); // also, you generally want to send *something* down that lets the user know what was saved.  Maybe not the whole object, but this is illustrative and the client will at least need to know something (e.g. the id) to refer to the object by in the future.
        })
        .catch(err => {
            res.status(400).send('unable to save to database');
        });
});


//Listen on port 3000
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});

