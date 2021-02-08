const express = require('express');
const consign = require('consign');
const dotenv = require('dotenv/config');
const bodyParser = require("body-parser");
const session = require('express-session');

// Constants
const app = express();
const port = 8000;
const host = 'localhost';

// Set session configs
app.use(session({
	secret: '2C44-4D44-WppQ38S',
	resave: true,
	saveUninitialized: true
}));

// Set view configs
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Set post configs
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set as acessible directories out of src/
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

// Set global variables
global.loggedIn = false;

// Autoload scritps
consign()
	.include('src/routes')
	.then('src/routes/auth')
	.then('src/routes/goals')
	.then('src/models')
	.then('src/middlewares')
	.then('src/controllers')
	.into(app);

// Start the server
app.listen(port, () => {
	console.log(`Server listening at http://${host}:${port}`);
});
