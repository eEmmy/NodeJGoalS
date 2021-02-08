// Method to be executed if check returned false
const denied = (res) => {
	// Redirect to 404 page
	res.redirect('/404');
}

// Check for the conditions
module.exports.check = (res, callback) => {
	// Verify if global.loggedIn is equal true
	if (global.loggedIn === true) {
		callback();
	}
	else {
		denied(res);
	}
}