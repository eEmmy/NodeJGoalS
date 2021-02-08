module.exports = (application) => {
	application.get('/goal/see/:goalId', (req, res) => {
		application.src.controllers.goals.goal.index(application, req, res);
	});
	
	application.get('/goal/:goalId/delete', (req, res) => {
		application.src.controllers.goals.goal.deleteGoal(application, req, res)
	});

	application.post('/goal/:goalId/add-money', (req, res) => {
		application.src.controllers.goals.goal.addMoney(application, req, res);
	});

	application.post('/goal/:goalId/remove-money', (req, res) => {
		application.src.controllers.goals.goal.removeMoney(application, req, res);
	});

	application.post('/goal/:goalId/edit', (req, res) => {
		application.src.controllers.goals.goal.editGoal(application, req, res);
	});
}