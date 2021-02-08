module.exports = (application) => {
	// Register form
	application.get('/login', (req, res) => {
		application.src.controllers.auth.login.index(application, req, res);
	});

	// Register POST request
	application.post('/login', (req, res) => {
		application.src.controllers.auth.login.loginUser(application, req, res);
	})
}
