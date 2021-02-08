module.exports = (application) => {
	application.get('/goals/new', (req, res) => {
		application.src.controllers.goals.newGoal.index(application, req, res);
	});

	application.post('/goals/new', (req, res) => {
		application.src.controllers.goals.newGoal.createGoal(application, req, res);
	})
}
