const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/MDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined'));

app.use(express.static('public'));

// CREATE
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users
                .create({
                    Name: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                .then((user) =>{res.status(201).json(user) })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
    });
    
    // UPDATE
    app.put('/users/:Username', async (req, res) => {
        await Users.findOneAndUpdate({ Username: req.params.Username},
            { $set:
                {
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                }
            },
            { new: true })
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })
    }); 
    
    app.post('/users/:Username/movies/:MovieID', async (req, res) => {
        await Users.findOneAndUpdate({ Username: req.params.Username}, {
            $push: { FavoriteMovies: req.params.MovieID }
        },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });   
    });
    
    // READ
    app.get('/movies', async (req, res) => {
        await Movies.find()
            .then((movies) => {
                res.status(201).json(movies);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });
    
    app.get('/movies/:title', async (req, res) => {
        await Movies.findOne({ Title: req.params.title})
            .then((movie) => {
                res.json(movie);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });
    
    app.get('/movies/genres/:genreName', async (req, res) => {
        await Movies.find({ 'Genre.Name': req.params.genreName })
            .then((movies) => {
                res.json(movies);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });
    
    app.get('/movies/directors/:directorName', async (req, res) => {
        await Movies.find({ 'Director.Name': req.params.directorName })
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
    })
    
    // DELETE
    app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
        await Users.findOneAndUpdate({ Username: req.params.Username }, {
            $pull: { FavoriteMovies: req.params.MovieID }
        },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    })
    
    app.delete('/users/:Username', async (req, res) => {
        await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });
    //listen for request
    app.listen(8080, () => {
        console.log('Your app is listening on port 8080.');
    });