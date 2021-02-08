module.exports.index = (application, req, res) => {
	// Load an middleware
	const guest = require('./../../middlewares/guest');

	// Pass trough an middleware
	guest.check(res, () => {
		// Verify if isset an alert session
		if (req.session.alert !== undefined) {
			// Stores the section value
			var alert = req.session.alert;

			// Destroy the session
			delete req.session.alert;

			// Render the view with an alert
			res.render("Auth/register", {alert: alert});
		}
		else {
			// Render just the view
			res.render("Auth/register");
		}
	});
}

// Register an user
module.exports.registerUser = async (application, req, res) => {
	// Load the model
	const model = require('./../../models/model.js');

	// Searchs for a user with this email already registered
	var userSearch = await model.select(
		table="users",
		fields=["id"],
		where={
			and: [
				["email", "=", req.body.email]
			]
		},
		limit=1
	);

	// Verify the user search result
	if (userSearch.length > 0) {
		// Creates an session with the error message
		req.session.alert = ["error", "This email already in use by another user."];

		// Redirect to the previous page
		res.redirect('/register')
	}

	// Load bcrypt module
	const bcrypt = require('bcrypt');

	// Hash the password
	bcrypt.hash(req.body.password, 10, (err, hash) => {
		// Register the user
		console.log(hash.length, hash);
		model.create(
			"users",
			{
				name: req.body.name,
				email: req.body.email,
				password: hash
			}
		);

		// Creates an session with the success message
		req.session.alert = ["success", "User registered with success!"];

		// Redirect to the login page
		res.redirect('/login');
	});
}