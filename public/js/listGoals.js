// Verify if there is any data to render
if ('<%= data %>' !== null) {
	console.log('a');
	// Get the data
	var data = '<%= data %>'.replace(/&[^;]*>?/gm, '\"').replace(/;/g, '');
	
	// Parse the data
	data = JSON.parse(data);

	// Stores the table html
	var goalHTML = "<!-- Goals table -->";
	goalHTML += "<table class=\"table\">";
		goalHTML += "<thead>";
			goalHTML += "<tr>";
				goalHTML += "<th scope=\"col\">#</th>";
				goalHTML += "<th scope=\"col\">Name</th>";
				goalHTML += "<th scope=\"col\">Objective</th>";
				goalHTML += "<th scope=\"col\">Remaining</th>";
				goalHTML += "<th scope=\"col\">Status</th>";
				goalHTML += "<th scope=\"col\">Actions</th>";
			goalHTML += "</tr>";
		goalHTML += "</thead>";
		goalHTML += "<tbody>";

	// Loop in data
	for (i in data) {
		// Stores the goal data
		var goal = data[i];

		if (goal.status !== 1) {
			// Make the HTML table row
			goalHTML += "<tr>";
				goalHTML += `<th scope="row">${goal.id}</th>`;
				goalHTML += `<td>${goal.name}</td>`;
				goalHTML += `<td class="text-muted">${goal.final_objective}</td>`;
				goalHTML += `<td class="text-muted">${goal.final_objective - goal.total}</td>`;
				goalHTML += `<td class="text-muted">Ended in ${goal.end_date}</td>`;
				goalHTML += "<td></td>";
			goalHTML += "</tr>";
		}
		else {
			// Make the HTML table row
			goalHTML += "<tr>";
				goalHTML += `<th scope="row">${goal.id}</th>`;
				goalHTML += `<td>${goal.name}</td>`;
				goalHTML += `<td class="text-danger">${goal.final_objective}</td>`;
				goalHTML += `<td class="text-warning">${goal.final_objective - goal.total}</td>`;
				goalHTML += `<td class="text-success">Active</td>`;
				goalHTML += "<td>";
					goalHTML += `<a href=\"\">`;
						goalHTML += `<span class="badge py-2 px-3 bg-primary" href="<%= process.env.APP_URL + "/"%>${goal.id}/see">See</span>`;
					goalHTML += "</a>";
				goalHTML += "</td>";
			goalHTML += "</tr>";
		}
	}

	// Close the remaining HMTL tags
	goalHTML += "</tbody></table>";

	document.querySelector('#goalsList').innerHTML = goalHTML;
}