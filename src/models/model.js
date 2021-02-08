const dotenv = require('dotenv/config');
const env = process.env;

// Instantiate a connection with mysql database
const initConn = async () => {
	// Verify if the connection is already instantiated
	if (global.conn && global.conn.state !== 'disconnected') {
		return global.conn;
	}

	// Load mysql2 module
	const mysql = require('mysql2/promise');

	// Does the connection
	const conn = await mysql.createConnection(`mysql://${env.USER}:${env.PASSWORD}@${env.HOST}:${env.PORT}/${env.DATABASE}`);

	// Insert the connection into a global variable
	global.conn = conn;

	// Returns the connection
	return conn;
}

// Performs an entire table select
module.exports.all = async (table) => {
	// Instantiate the connection
	const conn = await initConn();

	// Stores the query result
	const [rows] = await conn.query(`SELECT * FROM ${table}`);

	// Returns the result
	return rows;
}

// Performas an select
module.exports.select = async (table, fields, where={}, orderBy='', limit=0) => {
	// Instantiate the connection
	const conn = await initConn();

	// Stores the query
	var query = `SELECT `;

	// Loop in fields
	for (var i = 0; i < fields.length; i++) {
		// Adds current field to the query
		query += fields[i];

		// Verify if the current field is the last one
		if (fields[i] === fields[fields.length -1 ]) {
			// Adds a space to the query
			query += ` `;

			// Break the loop
			break;
		}
		else {
			// Adds a comma to the query
			query += `, `;
		}
	}

	// Add the FROM param to the query
	query += `FROM ${table} `;

	// Verify if an where condition was passed
	if (where.and.length > 0 || where.or.length > 0) {
		// Add the WHERE param to the query
		query += `WHERE `;

		// Verify if isset an AND condiction
		if (where.and !== undefined) {
			// Loop in where.and
			for (var i = 0; i < where.and.length; i++) {
				// Verify the type of value passed
				if (typeof where.and[i][2] == 'number') {
					// Add the condiction to the query
					query += `${where.and[i][0]} ${where.and[i][1]} ${where.and[i][2]} `;
				}
				else if (typeof where.and[i][2] == 'string') {
					// Add the condiction to the query
					query += `${where.and[i][0]} ${where.and[i][1]} \"${where.and[i][2]}\" `;
				}

				// Verify if the current field is the last one
				if (where.and[i] == where.and[where.and.length - 1]) {
					// Adds a space to the query
					query += ` `;

					// Break the loop
					break;
				}
				else {
					// Adds a AND param to the query
					query += `AND `;
				}
			}
		}

		// Verify if isset an OR condition
		if (where.or !== undefined) {
			// Verify if isset an AND condition
			if (where.and !== undefined) {
				// Adds a OR param to the query
				query += `OR `;
			}
			else {
				// Add the WHERE param to the query
				query += `WHERE `;
			}

			// Loop in where.or
			for (var i = 0; i < where.or.length; i++) {
				// Verify the type of value passed
				if (typeof where.or[i][2] == 'number') {
					// Add the condiction to the query
					query += `${where.or[i][0]} ${where.or[i][1]} ${where.or[i][2]} `;
				}
				else if (typeof where.or[i][2] == 'string') {
					// Add the condiction to the query
					query += `${where.or[i][0]} ${where.or[i][1]} \"${where.or[i][2]}\" `;
				}

				// Verify if the current field is the last one
				if (where.or[i] == where.or[where.or.length - 1]) {
					// Adds a space to the query
					query += ` `;

					// Break the loop
					break;
				}
				else {
					// Adds a OR param to the query
					query += `OR `;
				}
			}
		}
	}
		
	// Verify if isset an ORDER BY condition
	if (orderBy.length > 0) {
		// Adds a ORDER BY param to the query
		query += `ORDER BY ${orderBy} `;
	}

	// Verify if isset an LIMIT condition
	if (limit.length > 0) {
		// Adds a LIMIT param to the query
		query += `LIMIT ${limit} `;
	}

	// Stores the query result
	const [rows] = await conn.query(query);


	// Returns the result
	return rows;
}

// Insert data into table
module.exports.create = async (table, fields) => {
	// Instantiate the connection
	const conn = await initConn();

	// Stores the query parts
	var fieldsQuery = ``;
	var valuesQuery = ``;

	// Loop in fields
	for (field in fields) {
		// Stores the field into fieldsQuery
		fieldsQuery += `${field}`;

		// Verify the type of value passed
		if (typeof fields[field] == 'number') {
			// Stores the value into valuesQuery
			valuesQuery += `${fields[field]}`;
		}
		else if (typeof fields[field] == 'string') {
			// Stores the value into valuesQuery
			valuesQuery += `\"${fields[field]}\"`;
		}

		// Verify if the current item is the last one
		if (fields[field] == fields[Object.keys(fields)[Object.keys(fields).length - 1]]) {
			// Breake the loop
			break;
		}
		else {
			// Adds a comma to the queries
			fieldsQuery += `, `;
			valuesQuery += `, `;
		}
	}

	// Mount the final query
	var query = `INSERT INTO ${table} (${fieldsQuery}) VALUES (${valuesQuery})`;

	// Executes the query
	var queryResult = await conn.query(query);

	// Returns the query result
	return queryResult;
}

// Update data into a table
module.exports.update = async (table, set, where) => {
	// Instantiate the connection
	const conn = await initConn();

	// Stores the query
	var query = `UPDATE ${table} SET `;

	// Loop in set
	for (field in set) {
		// Adds the field to the query
		query += `${field} = `;

		// Verify the type of value passed
		if (typeof set[field] == 'number') {
			// Stores the value into the query
			query += `${set[field]}`;
		}
		else if (typeof set[field] == 'string') {
			// Stores the value into the query
			query += "'" + set[field] + "' ";
		}

		// Verify if the current field is the last one
		if (set[field] == set[Object.keys(set)[Object.keys(set).length - 1]]) {
			// Breake the loop
			break;
		}
		else {
			// Adds a comma to the queries
			query += `, `;
		} 
	}

	// Add a WHERE param to the query
	query += ` WHERE `;

	// Verify if an where condition was passed
	if (where.and.length > 0 || where.or.length > 0) {
		// Verify if isset an AND condiction
		if (where.and !== undefined) {
			// Loop in where.and
			for (var i = 0; i < where.and.length; i++) {
				// Verify the type of value passed
				if (typeof where.and[i][2] == 'number') {
					// Add the condiction to the query
					query += `${where.and[i][0]} ${where.and[i][1]} ${where.and[i][2]} `;
				}
				else if (typeof where.and[i][2] == 'string') {
					// Add the condiction to the query
					query += `${where.and[i][0]} ${where.and[i][1]} '${where.and[i][2]}' `;
				}

				// Verify if the current field is the last one
				if (where.and[i] == where.and[where.and.length - 1]) {
					// Adds a space to the query
					query += ` `;

					// Break the loop
					break;
				}
				else {
					// Adds a AND param to the query
					query += `AND `;
				}
			}
		}

		// Verify if isset an OR condition
		if (where.or !== undefined) {
			// Verify if isset an AND condition
			if (where.and !== undefined) {
				// Adds a OR param to the query
				query += `OR `;
			}

			// Loop in where.or
			for (var i = 0; i < where.or.length; i++) {
				// Verify the type of value passed
				if (typeof where.or[i][2] == 'number') {
					// Add the condiction to the query
					query += `${where.or[i][0]} ${where.or[i][1]} ${where.or[i][2]} `;
				}
				else if (typeof where.or[i][2] == 'string') {
					// Add the condiction to the query
					query += `${where.or[i][0]} ${where.or[i][1]} \"${where.or[i][2]}\" `;
				}

				// Verify if the current field is the last one
				if (where.or[i] == where.or[where.or.length - 1]) {
					// Adds a space to the query
					query += ` `;

					// Break the loop
					break;
				}
				else {
					// Adds a OR param to the query
					query += `OR `;
				}
			}
		}
	}

	// Executes the query
	var queryResult = await conn.query(query);

	// Returns the query result
	return queryResult;
}

// Delete entries from a table
module.exports.delete = async (table, where) => {
	// Instantiate the connection
	const conn = await initConn();

	// Stores the query
	var query = `DELETE FROM ${table} WHERE `;

	// Verify if an where condition was passed
	if (where.and.length > 0 || where.or.length > 0) {
		// Verify if isset an AND condiction
		if (where.and !== undefined) {
			// Loop in where.and
			for (var i = 0; i < where.and.length; i++) {
				// Verify the type of value passed
				if (typeof where.and[i][2] == 'number') {
					// Add the condiction to the query
					query += `${where.and[i][0]} ${where.and[i][1]} ${where.and[i][2]} `;
				}
				else if (typeof where.and[i][2] == 'string') {
					// Add the condiction to the query
					query += `${where.and[i][0]} ${where.and[i][1]} '${where.and[i][2]}' `;
				}
				else {
					// Add the condiction to the query
					query += `${where.and[i][0]} ${where.and[i][1]} ${where.and[i][2]} `;
				}

				// Verify if the current field is the last one
				if (where.and[i] == where.and[where.and.length - 1]) {
					// Adds a space to the query
					query += ` `;

					// Break the loop
					break;
				}
				else {
					// Adds a AND param to the query
					query += `AND `;
				}
			}
		}

		// Verify if isset an OR condition
		if (where.or !== undefined) {
			// Verify if isset an AND condition
			if (where.and !== undefined) {
				// Adds a OR param to the query
				query += `OR `;
			}

			// Loop in where.or
			for (var i = 0; i < where.or.length; i++) {
				// Verify the type of value passed
				if (typeof where.or[i][2] == 'number') {
					// Add the condiction to the query
					query += `${where.or[i][0]} ${where.or[i][1]} ${where.or[i][2]} `;
				}
				else if (typeof where.or[i][2] == 'string') {
					// Add the condiction to the query
					query += `${where.or[i][0]} ${where.or[i][1]} \"${where.or[i][2]}\" `;
				}

				// Verify if the current field is the last one
				if (where.or[i] == where.or[where.or.length - 1]) {
					// Adds a space to the query
					query += ` `;

					// Break the loop
					break;
				}
				else {
					// Adds a OR param to the query
					query += `OR `;
				}
			}
		}
	}

	// Executes the query
	var queryResult = await conn.query(query);

	// Returns the query result
	return queryResult;
}