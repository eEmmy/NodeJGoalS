module.exports = (application) => {
	application.post('/search', (req, res) => {
		application.src.controllers.search.index(application, req, res);
	});
}