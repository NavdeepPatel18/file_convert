const util = require("util");
const multer = require("multer");

const DIR = "./public/uploads/";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("_");
    cb(null, fileName);
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "file/text" ||
      file.mimetype == "file/txt" ||
      file.mimetype == "text/plain"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("File types allowed .txt onaly"));
    }
  },
}).single("file");

let fileUploadMiddleware = util.promisify(upload);

module.exports = fileUploadMiddleware;
