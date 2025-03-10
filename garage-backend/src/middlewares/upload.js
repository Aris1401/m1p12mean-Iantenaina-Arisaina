const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../upload`));
  },
  filename: (req, file, callback) => {
    var filename = `${Date.now()}-garage-${file.originalname}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage })
module.exports = uploadFiles;