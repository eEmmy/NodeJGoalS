// Load data of all user goals
const loadGoals = async (req) => {
	// Verify if the user is logged
	if (global.loggedIn === true) {
		// Load the model
		const model = require('./../models/model');

		// Search by all user's goals
		const goals = await model.select(
			'goals',
			fields=['id', 'name', 'final_objective', 'total', 'status', 'end_date'],
			where={
				and: [
					['owner_id', '=', req.session.userId]
				]
			},
			orderBy="id, status ASC"
		);

		// Verify if there is any result in search
		if (goals.length > 0) {
			// Return the search result
			return goals;
		}
		else {
			// Return null
			return null;
		}
	}
	else {
		// Return null
		return null;
	}
}

module.exports.index = async (application, req, res) => {
	res.render("Home/index", {data: JSON.stringify(await loadGoals(req))});
}