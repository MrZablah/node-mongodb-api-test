const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Local
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express();
const port = process.env.PORT || 3000;

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

// DELETE /todos/{id}
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(404).send('Not valid ID');
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.status(200).send({todo, message: 'Nice request'});
    }).catch((e) => res.status(404).send());
});

// Update/Patch /todos/{id}
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)){
        res.status(404).send('Not valid ID');
    }
    
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({todo, message: 'Nice request'});
    }).catch((e) => {
        res.status(400).send();
    });
});

// Asigne port to server
app.listen(port, () => {
    console.log(`Stared on port ${port}`);
});

module.exports = {app};
