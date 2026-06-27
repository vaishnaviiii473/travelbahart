const express = require('express');
const router  = express.Router();

const upload = require('../middleware/upload');
const { uploadImage, uploadMultiple } = require('../controllers/uploadcontroller');
const { protect } = require('../middleware/Auth');

// POST /api/upload  — single image, field name "image"
router.post('/', protect, upload.single('image'), uploadImage);

// POST /api/upload/multiple — up to 6 images, field name "images"
router.post('/multiple', protect, upload.array('images', 6), uploadMultiple);

module.exports = router;