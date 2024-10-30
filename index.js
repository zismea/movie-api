const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

app.use(morgan('combined'));

app.use(express.static('public'));

let movies = [
    { 
        "Title": 'Blue Velvet', 
        "Year": '1986',

      "Director": {
        "Name": 'David Lynch'},

      "Genre": {
        "Name": 'Drama'},
      },

    { 
        "Title": 'Teorema',
        "Year": '1968',

      "Director": {
        "Name": 'Pier Paolo Pasolini'},

      "Genre": {
        "Name": 'Drama'},
      },

    { 
        "Title": 'Possession', 
        "Year": '1980',

      "Director": {
        "Name": 'Andrzej Zulawski'},

      "Genre": {
        "Name": 'Horror'},
      }
];

let users = [
    {
        "id": 1,
        "name": 'Tilda Swinton',
        "favoriteMovies": ['Teorema']
    },
    {
        "id": 2,
        "name": 'Willem Dafoe',
        "favoriteMovies": ['Possession']
    },
];

app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200.).json(user);
    } else {
        res.status(400).send('no such user')
    }
});

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
});

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
});

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such gnere')
    }
});

app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
});

app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been deleted from ${id}'s array`);
    } else {
        res.status(400).send('no such user')
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id}'s has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});