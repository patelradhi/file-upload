const File = require('../models/file');
const cloudinary = require('cloudinary').v2;
const { sendMail } = require('../config/mail');
const { response } = require('express');
require('dotenv').config;

//localfileUpload hendeler(success)

exports.localFileUpload = async (req, res) => {
	try {
		//fetch file
		console.log(req.files);
		const file = req.files.userEnteredFiles;

		if (!file) {
			return res.json({
				success: false,
				message: 'no files were uploaded',
			});
		}
		//hendel multipel file
		if (Array.isArray(file)) {
			file.forEach(async (image) => {
				//creat path where file need to be stored on serve

				let path = __dirname + '/files/' + Date.now() + `.${image.name.split('.')[1]}`;
				console.log(path);

				// move multipel images into path

				image.mv(path, (err) => {
					if (err) {
						console.log(err);
						return res.json({
							success: false,
						});
					}
				});
			});
		} else {
			//hendel a singel file(not array)

			//creat path where file need to be stored on serve

			let path = __dirname + '/files/' + Date.now() + `.${file.name.split('.')[1]}`;
			console.log(path);

			//upload file to the path by move function

			image.mv(path, (err) => {
				if (err) {
					console.log(err);
					return res.json({
						success: false,
					});
				}
			});
		}

		//maile send
		var to = req.body.mail;

		var data = {
			from: process.env.MAIL_USER, // sender address
			to: to, //list of receivers
			subject: 'new  image file Uploaded on cloudinary', // Subject line
			html: `<h2>Hello ji image file uploadeded locally </h2> </br>local file uploaded</</a>`, // html body
		};
		sendMail(data);

		//response
		res.json({
			success: true,
			mesaage: 'local File upload succesfully',
		});
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: 'found some error whhile uploading local file',
		});
	}
};

//imageUpload hendeler(success)

function isFileTypeSupported(type, supportedTypes) {
	return supportedTypes.includes(type);
}

async function fileUploadToCloudinary(file, folder, quality) {
	const Options = { folder };
	if (quality) {
		Options.quality = quality;
	}
	Options.resource_type = 'auto';
	return await cloudinary.uploader.upload(file.tempFilePath, Options);
}

exports.imageUpload = async (req, res) => {
	try {
		//fetch data
		const { email, name, tags } = req.body;
		console.log(req.files);
		const files = req.files.imageFile;

		if (!files) {
			return res.json({
				success: false,
				message: 'no files were uploaded',
			});
		}
		//for hendeling multipel file images
		const image_url = [];

		if (Array.isArray(files)) {
			for (let images of files) {
				//validation
				const supportedFile = ['jpg', 'jpeg', 'png'];
				const fileType = images.name.split('.')[1].toLowerCase();
				console.log(fileType);

				if (!isFileTypeSupported(fileType, supportedFile)) {
					return res.json({
						success: false,
						message: 'file format not supported',
					});
				}

				//upload multipel inages into cloudinary
				const response = await fileUploadToCloudinary(images, 'codehelp');
				console.log(response);
				image_url.push(response.secure_url);
			}

			//entry in db

			const fileData = await File.create({
				name,
				email,
				tags,
				imgUrl: image_url,
			});
			//response

			res.json({
				success: true,
				image_url,
				message: ' multipel file uploaded successfully',
			});
		} else {
			//for hendeling singel file image

			const response = await fileUploadToCloudinary(files, 'codehelp');
			console.log(response);

			//entry in db

			const fileData = await File.create({
				name,
				email,
				tags,
				imgUrl: [response.secure_url],
			});

			//maile send

			const to = req.body.email;
			const data = {
				from: process.env.MAIL_USER, // sender address
				to: to, //list of receivers
				subject: 'new  vedio file Uploaded on cloudinary', // Subject line
				html: `<h2>Hello radhika imagefile uploaded on cloudinary</h2> </br>imagefile uploaded</</a>`, // html body
			};
			sendMail(data);

			//response

			res.json({
				success: true,
				imgUrl: response.secure_url,
				message: 'file uploaded successfully',
			});
		}
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: ' found some error while uploading file to cloudinary',
		});
	}
};

//vedio handeler

exports.vedioUpload = async (req, res) => {
	try {
		//fetch data
		const { name, email, tags } = req.body;
		console.log(req.body);
		const file = req.files.vediosFile;

		//hendel multipel file vedio

		let vedioUrl = [];

		if (Array.isArray(file)) {
			for (let vedios of file) {
				//validation

				const supportedFile = ['mp4', 'mov'];
				const fileType = vedios.name.split('.')[1].toLowerCase();
				console.log(fileType);

				if (!isFileTypeSupported(fileType, supportedFile)) {
					return res.json({
						success: false,
						message: 'file format not supported',
					});
				}
				console.log('file uploading to cloudinary');

				//if file format supported(file upload to coudinary)

				const response = await fileUploadToCloudinary(vedios, 'codehelp');
				console.log(response);
				vedioUrl.push(response.secure_url);
			}
			//entry in db

			const fileDatabase = await File.create({
				name,
				email,
				tags,
				imgUrl: vedioUrl,
			});
		} else {
			//hendel singel file vedio

			//validation

			const supportedFile = ['mp4', 'mov'];
			const fileType = file.name.split('.')[1].toLowerCase();
			console.log(fileType);

			if (!isFileTypeSupported(fileType, supportedFile)) {
				return res.json({
					success: false,
					message: 'file format not supported',
				});
			}
			console.log('file uploading to cloudinary');

			//if file format supported(file upload to coudinary)

			const response = await fileUploadToCloudinary(file, 'codehelp');
			console.log(response);

			//entry in db

			const fileDatabase = await File.create({
				name,
				email,
				tags,
				imgUrl: [response.secure_url],
			});
		}

		//maile send
		const to = req.body.email;

		const data = {
			from: process.env.MAIL_USER, // sender address
			to: to, //list of receivers
			subject: 'new  vedio file Uploaded on cloudinary', // Subject line
			html: `<h2>Hello radhika vediomfile uploaded on cloudinary</h2> </br>vedio file uploaded</</a>`, // html body
		};
		sendMail(data);

		//response

		res.json({
			success: true,
			imgUrl: response.secure_url,
			message: 'vediofile  uploaded successfully',
		});
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: ' found some error while uploading file to cloudinary',
		});
	}
};
