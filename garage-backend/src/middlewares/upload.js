const util = require("util");
const path = require("path");
const multer = require("multer");
const fs = require('fs')

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../upload`));
  },
  filename: (req, file, callback) => {
    var filename = `${Date.now()}-garage-${file.originalname}`;
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