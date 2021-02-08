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
			res.render("Auth/login", {alert: alert});
		}
		else {
			// Render just the view
			res.render("Auth/login");
		}
	});
}

// Autenticate an user
module.exports.loginUser = async (application, req, res) => {
	// Load the page modules
	const model = require('./../../models/model');
	const bcrypt = require('bcrypt');

	// Searchs for the user with the passed email
	var userSearch = await model.select(
		"users",
		["id", "password"],
		where={
			and: [
				["email", "=", req.body.email]
			]
		},
		limit=1
	);

	// Handle wrong login data
	const wrongLoginData = () => {
		// Creates an session with the error message
		req.session.alert = ["error", "Wrong email/password. Try again."];

		// Redirect to the login form page
		res.redirect('/login');
	};


	// Verify if user search was returned any result
	if (userSearch.length > 0) {
		// Compare the passwords
		await bcrypt.compare(req.body.password, userSearch[0].password, (err, result) => {
			// Verify the comparation result
			if (result === true) {
				// Set global.loggedIn to true
				global.loggedIn = true;

				// Set an session with the user id
				req.session.userId = userSearch[0].id;

				// Redirect to home 
				res.redirect('/');
			}
			else {
				// Execute the function to handle wrong login data
				wrongLoginData();
			}
		});
	}
	else {
		// Execute the function to handle wrong login data
		wrongLoginData();
	}
}