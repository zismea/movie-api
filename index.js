const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const app = express();
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(express.static('public'));
const cors = require('cors');
app.use(cors());
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // CREATE
    app.post('/users/register',
        [
            check('Username', 'Username is required').isLength({ min: 5 }),
            check(
                'Username',
                'Username contains non alphanumeric characters - not allowed!'
            ).isAlphanumeric(),
            check('Password', 'Password is required').not().isEmpty(),
            check('Email', 'Email does not appear to be valid').isEmail(),
        ],
        async (req, res) => {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            let hashedPassword = Users.hashPassword(req.body.Password);
            await Users.findOne({ Username: req.body.Username })
                .then((user) => {
                    if (user) {
                        return res
                            .status(400)
                            .send(req.body.Username + ' already exists.');
                    } else {
                        Users.create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday,
                        })
                        .then((user) => {
                            res.status(201).json(user);
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    }
);

// UPDATE
app.put('/users/:Username',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        if (
            req.user.Username === req.params.Username ||
            req.user.Username === 'Kacper'
        ) {
        await Users.findOneAndUpdate({Username: req.params.Username},
            {$set: 
            {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            },
        },
            {new: true})
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    } else {
        return res.status(400).send('Permission denied');
    }
});

app.post('/users/:Username/favorites/:MovieID',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        if (
            req.user.Username === req.params.Username || req.user.Username === 'Kacper'
        ) {
            await Users.findOneAndUpdate(
                {Username: req.params.Username},
                {$push: {FavoriteMovies: req.params.MovieID}},
                {new: true}
            )
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
        } else {
            return res.status(400).send('Permission denied');
        }
    });

// READ
app.get('/movies',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        await Movies.find()
            .then((movies) => {
                res.json(movies);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });

app.get('/movies/:Title',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        await Movies.findOne({Title: req.params.Title})
            .then((movie) => {
                if (movie) {
                    res.json(movie);
                } else {
                    res.status(404).send('Movie with the title ' + req.params.Title + ' was not found.');
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });

app.get('/movies/genres/:genreName',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        await Movies.find({'Genre.Name': req.params.genreName})
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    });

app.get('/movies/directors/:directorName',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        await Movies.find({'Director.Name': req.params.directorName})
        .then((movies) => {
            res.json(movies);
        })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    }
);

// DELETE
app.delete('/users/:Username/favorites/:MovieID',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        if (
            req.user.Username === req.params.Username || req.user.Username === 'Kacper'
        ) {
            await Users.findOneAndUpdate(
                {Username: req.params.Username},
                {$pull: {FavoriteMovies: req.params.MovieID}},
                {new: true}
            )
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
        } else {
            return res.status(400).send('Permission denied');
        }
    });

app.delete('/users/:Username',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        if (
            req.user.Username === req.params.Username || req.user.Username === 'Kacper'
        ) {
            await Users.findOneAndDelete({Username: req.params.Username})
            .then((user) => {
                if (!user) {
                    res.status(400).send(req.params.Username + ' was not found.');
                } else {
                    res.status(200).send(req.params.Username + ' was deleted.');
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
        } else {
            return res.status(400).send('Permission denied');
        }
    }
);

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('My app is running on port ' + port);
});