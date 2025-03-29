const util = require("util");
const path = require("path");
const multer = require("multer");
const fs = require('fs')
const crypto = require('crypto')

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dest = path.join(`${__dirname}/../../upload`)
    fs.mkdirSync(dest, { recursive: true })

    callback(null, dest);
  },
  filename: (req, file, callback) => {
    var filename = `${Date.now()}-garage-${path.basename(file.originalname, path.extname(file.originalname))}-${crypto.randomBytes(16).toString('hex')}${path.extname(file.originalname)}`;
    callback(null, filename);
  }
});

const deleteUploadedFiles = (files) => {
  if (!files) return;
  files.forEach((file) => {
    fs.unlink(file.path, (err) => {
      if (err) console.error(`Error deleting file ${file.path}:`, err);
    });
  });
};

var uploadFiles = multer({ storage: storage })
module.exports = {
  uploadFiles,
  deleteUploadedFiles
};