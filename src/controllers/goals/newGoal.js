module.exports.index = (application, req, res) => {
	// Load an middleware
	const logged = require('./../../middlewares/logged');

	// Pass trough an middleware
	logged.check(res, () => {
		// Verify if isset an alert session
		if (req.session.alert !== undefined) {
			// Stores the section value
			var alert = req.session.alert;

			// Destroy the session
			delete req.session.alert;

			// Render the view with an alert
			res.render("Goals/newGoal", {alert: alert});
		}
		else {
			// Render just the view
			res.render("Goals/newGoal");
		}
	});
}

// Insert the goal into the database
module.exports.createGoal = async (application, req, res) => {
	// Load the model
	const model = require('./../../models/model');

	// Stores the goal data
	var goalData = {
		owner_id: req.session.userId,
		name: req.body.name,
		end_date: req.body.endDate,
		final_objective: req.body.objective,
		total: req.body.alreadyHave
	}

	// Insert the goal data into goals table
	const goal = await model.create("goals", goalData);

	// Stores the goal progress data
	var goalProgressData = {
		goal_id: goal[0].insertId
	}

	// Insert the goal progess into goal_progress table
	var goalRedirectId = await model.create("goals_progress", goalProgressData);

	// Redirect to the goal page
	res.redirect(`/goal/see/${goalRedirectId[0].insertId}`);
}