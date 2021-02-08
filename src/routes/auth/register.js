module.exports = (application) => {
	// Register form
	application.get('/register', (req, res) => {
		application.src.controllers.auth.register.index(application, req, res);
	});

	// Register POST request
	application.post('/register', (req, res) => {
		application.src.controllers.auth.register.registerUser(application, req, res);
	})
}
