const nodemailer = require('nodemailer');
require('dotenv').config();

//transporter
const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

// console.log(transporter);

exports.sendMail = (data, res) => {
	transporter.sendMail(data, (error, info) => {
		if (error) {
			console.log('Error:', error);
			res.status(500).json({ error: 'Failed to send email' });
		} else {
			console.log('Email sent:', info.response);
			res.json({ message: 'Email sent successfully' });
		}
	});
};
