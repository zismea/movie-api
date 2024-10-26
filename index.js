constmorgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

app.use(morgan('combined'));

app.use(express.static('public'));

let topMovies = [
    {title: 'Mulholland Drive'},
    {title: 'Mean Girls'},
    {title: 'Theorema'},
    {title: 'Twilight'},
    {title: 'Elephant'},
    {title: 'Possession'},
    {title: 'Nymphomaniac'},
    {title: 'Midsommar'},
    {title: 'American Psycho'},
    {title: 'Blue'}
];

app.get('/', (req, res) => {
    res.send('Welcome to my movie app!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: 'public'});
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});