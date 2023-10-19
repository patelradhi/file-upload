//import mongoose extanse

const mongoose = require('mongoose');

require('dotenv').config();

//function

const dbConnection = () => {
	mongoose
		.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})

		.then(() => {
			console.log('db connected succesfully');
		})

		.catch((error) => {
			console.log(error);
			console.log('db is not connected');
			process.exit(1);
		});
};

module.exports = dbConnection;
