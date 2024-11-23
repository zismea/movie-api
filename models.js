const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    MovieID: {type: Number},
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birthyear: String,
        Deathyear: String
    },
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    UserID: {type: Number},
    Username: {type: String, required: true},
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
    Email: {type: String, required: true},
    Password: {type: String, required: true},
    Birthday: Date
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;