//import express
const express = require('express');
const app = express();

//port

require('dotenv').config();
const PORT = process.env.PORT || 5600;

//middelware

//for interact with json
app.use(express.json());

//for interact with file
const fileupload = require('express-fileupload');
app.use(
	fileupload({
		useTempFiles: true,
		tempFileDir: '/tmp/',
	})
);

//mounting
const router = require('./src/routes/fileUpload');
app.use('/api/v1/upload', router);

//db connect

const dbConnection = require('./src/config/dataBase');
dbConnection();

//clodinary connect

const { cloudinaryConnect } = require('./src/config/cloudinary');
cloudinaryConnect();

//server started

app.listen(PORT, () => {
	console.log(`server strted at port number at ${PORT}`);
});
