const mongoose = require('mongoose');

const fileModel = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	imgUrl: {
		type: [String], //multipel file come in array from req.files
		required: true,
	},
	tags: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
});

//post middelware

const File = mongoose.model('File', fileModel);
module.exports = File;
