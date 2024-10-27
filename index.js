const express = require('express'),
    morgan = require('morgan');

const app = express();

const movies = [
    {
        title: 'Mulholland Drive',
        director: 'David Lynch'
    },
    {
        title: 'Teorema',
        director: 'Pier Paolo Pasolini'
    },
    {
        title: 'Midsommar',
        director: 'Ari Aster'
    },
    {
        title: 'Possession',
        director: 'Andrzej Zulawski'
    },
    {
        title: 'Blue',
        director: 'Derek Jarman'
    },
    {
        title: 'Suspiria',
        director: 'Dario Argento'
    },
    {
        title: 'Good Will Hunting',
        director: 'Gus Van Sant'
    },
];

app.use(morgan('common'));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:name', (req, res) => {
    res.send('Successful GET request returning data on a single movie.');
});
app.get('/genres/:name', (req, res) => {
    res.send('Successful GET request returning data on a genre.');
});
app.get('/directors/:name', (req, res) => {
    res.send('Successful GET request returning data on a director.');
});
app.post('/users/register', (req, res) => {
    res.send('Successful POST request to register a new user.');
});
app.put('/users/:username', (req, res) => {
    res.send('Successful PUT request to update a users username.');
});
app.post('/users/:username/favorites', (req, res) => {
    res.send('Successful POST request to add a movie to a users list of favorites.');
});
app.delete('/users/:username/favorites/:movieTitle', (req, res) => {
    res.send('Successful DELETE request to remove a movie of a users list of favorites.');
});
app.delete('/users/:username', (req, res) => {
    res.send('Successful DELETE request to deregister an existing user.');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

app.listen(8080, () => {
    console.log('My app is running on port 8080.');
});