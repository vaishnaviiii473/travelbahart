// POST /api/upload  (protected — admin only)
// Expects multipart/form-data with field name "image"
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Publicly accessible URL for the uploaded file (server must serve /uploads statically)
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    data: {
      filename: req.file.filename,
      url: fileUrl,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
};

// POST /api/upload/multiple — up to 6 images at once (for gallery use)
exports.uploadMultiple = (req, res) => {
  if (!req.files || !req.files.length) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const files = req.files.map(file => ({
    filename: file.filename,
    url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
    size: file.size,
    mimetype: file.mimetype,
  }));

  res.status(201).json({ success: true, count: files.length, data: files });
};