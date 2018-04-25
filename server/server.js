var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Local
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express();

// Midelware to use bodyparse json
app.use(bodyParser.json());

// POST /todos
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos,
            message: "Nice request"
        })
    }, (e) => {
        res.status(400).send(e);
    });
})

// GET /todos/{id}
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(404).send('Not valid ID');
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.status(200).send({todo, message: 'Nice request'});
    }).catch((e) => res.status(404).send());
});

// Asigne port to server
app.listen(3000, () => {
    console.log('Stared on port 3000');
});

module.exports = {app};
