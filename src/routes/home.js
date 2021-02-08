module.exports = (application) => {
	application.get('/', (req, res) => {
		application.src.controllers.home.index(application, req, res);
	});
}
