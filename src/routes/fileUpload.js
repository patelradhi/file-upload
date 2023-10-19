//import

const express = require('express');
const router = express.Router();

//maping

const { localFileUpload, imageUpload, vedioUpload } = require('../controllers/Fileupload');

//routes

router.post('/localFileUpload', localFileUpload);
router.post('/imageUpload', imageUpload);
router.post('/vedioUpload', vedioUpload);

//exports

module.exports = router;
