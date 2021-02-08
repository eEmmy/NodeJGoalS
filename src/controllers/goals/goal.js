module.exports.index = async (application, req, res) => {
	// Load the model
	const model = require('./../../models/model');

	// Search for the goal
	const goal = await model.select(
		'goals',
		['*'],
		where={
			and: [
				['id', '=', req.params['goalId']],
				['owner_id', '=', req.session.userId]
			]
		}
	);

	// Verify the search result
	if (goal.length > 0) {
		// Search for the goal progress
		const goalProgress = await model.select(
			'goals_progress',
			['progress_document'],
			where={
				and: [
					['goal_id', '=', req.params['goalId']]
				]
			}
		);

		// Verify the search result
		if (goalProgress.length > 0) {
			// Search for the user name 
			const username = await model.select(
				'users',
				['name'],
				where={
					and: [
						['id', '=', req.session.userId]
					]
				}
			);

			// Load the view
			res.render('Goals/goal', {goal: goal[0], goalDoc: goalProgress[0].progress_document, username: username[0].name}); 
		}
		else{
			// Redirect to page 404
			res.redirect('/404');
		}
	}
	else {
		// Redirect to page 404
		res.redirect('/404');
	}
}

// Add money to a goal
module.exports.addMoney = async (application, req, res) => {
	// Load the model
	const model = require('./../../models/model');

	// Search for the goal
	const goal = await model.select(
		'goals',
		['*'],
		where={
			and: [
				['id', '=', req.params['goalId']],
				['owner_id', '=', req.session.userId]
			]
		}
	);

	// Verify the search result
	if (goal.length > 0) {
		// Search for the goal progress
		const goalProgress = await model.select(
			'goals_progress',
			['progress_document'],
			where={
				and: [
					['goal_id', '=', req.params['goalId']]
				]
			}
		);

		// Verify the search result
		if (goalProgress.length > 0) {
			// Verify if isset any data in progress_document
			if (goalProgress[0].progress_document === null) {  // No data
				// Instantiate a Date object
				var date = new Date();

				// Get date info
				var year = date.getUTCFullYear();
				var month = date.getUTCMonth();
				var dayNumber = date.getUTCDate();
				var weekD = date.getDay();

				// Convert the string amountToAdd to a number
				var added = Number(req.body['amountToAdd']);

				// Initiate the document
				var goalProgressDocument = {
					[year]: {
						[month]: {
							[dayNumber]: {
								weekDay: weekD,
								added: added,
								removed: 0
							}
						}
					}
				}

				// Update the goals_progress table
				await model.update(
					'goals_progress',
					set={
						progress_document: JSON.stringify(goalProgressDocument)
					},
					where={
						and: [
							['goal_id', '=', req.params['goalId']]
						]
					}
				);
			}
			else {
				// Instantiate a Date object
				var date = new Date();

				// Get date info
				var year = date.getUTCFullYear();
				var month = date.getUTCMonth();
				var dayNumber = date.getUTCDate();
				var weekD = date.getDay();

				// Convert the JSON data to a Javascript Object
				var goalProgressDocument = JSON.parse(goalProgress[0].progress_document);

				// Stores the current document key in verification
				var currentDocumentKey = goalProgressDocument;

				// Verify if isset the current year key
				if (currentDocumentKey[year] !== undefined) {
					// Change the currentDocumentKey to months
					currentDocumentKey = currentDocumentKey[year];

					// Verify if isset the current month key
					if (currentDocumentKey[month] !== undefined) {
						// Change the currentDocument key to days
						currentDocumentKey = currentDocumentKey[month];

						// Verify if isset the current day key
						if (currentDocumentKey[dayNumber] !== undefined) {
							// Get the new added quantity
							var added = (Number(currentDocumentKey[dayNumber].added) + Number(req.body['amountToAdd']));

							// Set the new added value
							goalProgressDocument[year][month][dayNumber]['added'] = added;
						}
						else {  // No day
							// Get the new added quantity
							var added = Number(req.body['amountToAdd']);

							// Set the day key
							goalProgressDocument[year][month][dayNumber] = {
								'weekDay': weekD,
								'added': added,
								'removed': 0
							}
						} 
					}
					else {  // No month
						// Get the new added quantity
						var added = Number(req.body['amountToAdd']);

						// Set the month and day keys
						Object.assign(goalProgressDocument[year], {
							[month]: {
								[dayNumber]: {
									'weekDay': weekD,
									'added': added,
									'removed': 0
								}
							}
						})
					}
				}
				else {  // No year
					// Get the new added quantity
					var added = Number(req.body['amountToAdd']);

					// Set the month and day keys
					goalProgressDocument[year] = {
						[month]: {
							[dayNumber]: {
								'weekDay': weekD,
								'added': added,
								'removed': 0
							}
						}
					}
				}

				// Update the goals_progress table
				await model.update(
					'goals_progress',
					fields={
						progress_document: JSON.stringify(goalProgressDocument)
					},
					where={
						and: [
							['goal_id', '=', req.params['goalId']]
						]
					}
				);
			}
			
			// Convert strings values to numbers
			var amountToAdd = Number(req.body['amountToAdd']);
			var oldTotal = Number(goal[0].total);

			// Update the goals table
			await model.update(
				'goals',
				fields={
					total: oldTotal + amountToAdd
				},
				where={
					and: [
						["id", "=", req.params['goalId']]
					]
				}
			);
		}

		// Redirect back to the goal
		res.redirect(`/goal/see/${req.params['goalId']}`);
	}
	else {
		// Redirect to 404 page
		res.redirect('/404');
	}
}

// Remove money from a goal
module.exports.removeMoney = async (application, req, res) => {
	// Load the model
	const model = require('./../../models/model');

	// Search for the goal
	const goal = await model.select(
		'goals',
		['*'],
		where={
			and: [
				['id', '=', req.params['goalId']],
				['owner_id', '=', req.session.userId]
			]
		}
	);

	// Verify the search result
	if (goal.length > 0) {
		// Search for the goal progress
		const goalProgress = await model.select(
			'goals_progress',
			['progress_document'],
			where={
				and: [
					['goal_id', '=', req.params['goalId']]
				]
			}
		);

		// Verify the search result
		if (goalProgress.length > 0) {
			// Verify if isset any data in progress_document
			if (goalProgress[0].progress_document === null) {  // No data
				// Instantiate a Date object
				var date = new Date();

				// Get date info
				var year = date.getUTCFullYear();
				var month = date.getUTCMonth();
				var dayNumber = date.getUTCDate();
				var weekD = date.getDay();

				// Convert the string amountToAdd to a number
				var removed = Number(req.body['amountToRemove']);

				// Initiate the document
				var goalProgressDocument = {
					[year]: {
						[month]: {
							[dayNumber]: {
								weekDay: weekD,
								added: 0,
								removed: removed
							}
						}
					}
				}

				// Update the goals_progress table
				await model.update(
					'goals_progress',
					set={
						progress_document: JSON.stringify(goalProgressDocument)
					},
					where={
						and: [
							['goal_id', '=', req.params['goalId']]
						]
					}
				);
			}
			else {
				// Instantiate a Date object
				var date = new Date();

				// Get date info
				var year = date.getUTCFullYear();
				var month = date.getUTCMonth();
				var dayNumber = date.getUTCDate();
				var weekD = date.getDay();

				// Convert the JSON data to a Javascript Object
				var goalProgressDocument = JSON.parse(goalProgress[0].progress_document);

				// Stores the current document key in verification
				var currentDocumentKey = goalProgressDocument;

				// Verify if isset the current year key
				if (currentDocumentKey[year] !== undefined) {
					// Change the currentDocumentKey to months
					currentDocumentKey = currentDocumentKey[year];

					// Verify if isset the current month key
					if (currentDocumentKey[month] !== undefined) {
						// Change the currentDocument key to days
						currentDocumentKey = currentDocumentKey[month];

						// Verify if isset the current day key
						if (currentDocumentKey[dayNumber] !== undefined) {
							// Get the removed quantity
							var removed = (Number(currentDocumentKey[dayNumber].removed) + Number(req.body['amountToRemove']));

							// Set the removed value
							goalProgressDocument[year][month][dayNumber]['removed'] = removed;
						}
						else {  // No day
							// Get the removed quantity
							var removed = Number(req.body['amountToRemove']);

							// Set the day key
							goalProgressDocument[year][month][dayNumber] = {
								'weekDay': weekD,
								'added': 0,
								'removed': removed
							}
						} 
					}
					else {  // No month
						// Get the removed quantity
						var removed = Number(req.body['amountToRemove']);

						// Set the month and day keys
						Object.assign(goalProgressDocument[year], {
							[month]: {
								[dayNumber]: {
									'weekDay': weekD,
									'added': 0,
									'removed': removed
								}
							}
						})
					}
				}
				else {  // No year
					// Get the removed quantity
					var removed = Number(req.body['amountToRemove']);

					// Set the month and day keys
					goalProgressDocument[year] = {
						[month]: {
							[dayNumber]: {
								'weekDay': weekD,
								'added': 0,
								'removed': removed
							}
						}
					}
				}

				// Update the goals_progress table
				await model.update(
					'goals_progress',
					fields={
						progress_document: JSON.stringify(goalProgressDocument)
					},
					where={
						and: [
							['goal_id', '=', req.params['goalId']]
						]
					}
				);
			}
			
			// Convert strings values to numbers
			var amountToRemove = Number(req.body['amountToRemove']);
			var oldTotal = Number(goal[0].total);

			// Update the goals table
			await model.update(
				'goals',
				fields={
					total: oldTotal - amountToRemove
				},
				where={
					and: [
						["id", "=", req.params['goalId']]
					]
				}
			);
		}

		// Redirect back to the goal
		res.redirect(`/goal/see/${req.params['goalId']}`);
	}
	else {
		// Redirect to 404 page
		res.redirect('/404');
	}
}

// Remove money from a goal
module.exports.editGoal = async (application, req, res) => {
	// Load the model
	const model = require('./../../models/model');

	// Search for the goal
	const goal = await model.select(
		'goals',
		['*'],
		where={
			and: [
				['id', '=', req.params['goalId']],
				['owner_id', '=', req.session.userId]
			]
		}
	);

	// Verify the search result
	if (goal.length > 0) {
		// Stores the new goal data
		const newName = req.body.name;
		const newFinalObjective = req.body.finalObjective;
		const newEndDate = req.body.endDate;

		console.log(goal);

		// Stores the fields to change
		var fieldsToUpdate = {};

		// Compare the old values with the new ones
		if (newName != goal[0].name && newName.length > 0) {  // Compare the names
			// Set the new name
			fieldsToUpdate.name = newName;
		}

		if (newFinalObjective != goal[0].final_objective && newFinalObjective.length > 0) {  // Compare the objectives
			// Set the new final objective
			fieldsToUpdate.final_objective = Number(newFinalObjective);
		}

		if (newEndDate != goal[0].end_date && newEndDate != goal[0].created_at && newEndDate.length > 0) {  // Compare the end dates
			// Instantiate a Date Object
			const date = new Date(newEndDate);

			// Set the new end date
			fieldsToUpdate.end_date = date.toISOString().slice(0, 19).replace('T', ' ');
		}
		else {  // Prevent from change end_date field without order
			// Instantiate a Date Object
			const date = new Date(goal[0].end_date);

			// Set the end date
			fieldsToUpdate.end_date	= date.toISOString().slice(0, 19).replace('T', ' ');
		}


		// Verifies if any value is new
		if (fieldsToUpdate.name !== undefined || fieldsToUpdate.final_objective !== undefined || fieldsToUpdate.end_date != goal[0].end_date) {
			// Set created_at to prevent the querie from change this
			
			console.log(fieldsToUpdate);

			// Update the goals table
			await model.update('goals', fieldsToUpdate, where={and: [['id', '=', req.params['goalId']]]});
		}

		// Redirect back to the goal
		res.redirect(`/goal/see/${req.params['goalId']}`);
	}
	else {
		// Redirect to 404 page
		res.redirect('/404');
	}
}

// Delete a goal
module.exports.deleteGoal = async (application, req, res) => {
	// Load the model
	const model = require('./../../models/model');

	// Search for the goal
	const goal = await model.select(
		'goals',
		['*'],
		where={
			and: [
				['id', '=', req.params['goalId']],
				['owner_id', '=', req.session.userId]
			]
		}
	);

	// Verify the search result
	if (goal.length > 0) {
		// Delete the goal from goals table
		await model.delete('goals', where={and: [['id', '=', req.params['goalId']]]});

		// Delete the goal from goal_progress table
		await model.delete('goals_progress', where={and: [['goal_id', '=', req.params['goalId']]]});

		// Redirect to home
		res.redirect('/');
	}
	else {
		// Redirect to 404 page
		res.redirect('/404')
	}
}