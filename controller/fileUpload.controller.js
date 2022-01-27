const path = require("path");
const mime = require("mime");
const upload = require("../middleware/fileUpload");
const fileConvert = require("../middleware/convertFile");

const URL = "http://localhost:8888/files/";
const fs = require("fs");
const { readdir } = require("fs/promises");

const uploadFile = async (req, res) => {
  try {
    const file_path = __basedir + "/public/uploads/";

    const delete_files = await readdir(file_path);

    for (const file of delete_files) {
      fs.unlink(path.join(file_path, file), (err) => {
        if (err) throw err;
      });
    }

    var writeStream = fs.createWriteStream(file_path + "output.xlsx");
    writeStream.close();

    await upload(req, res);

    fileConvert(file_path);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    }

    res.status(200).send({
      message: "File uploaded successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

const getFilesList = (req, res) => {
  const path = __basedir + "/public/uploads/";

  fs.readdir(path, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Files not found.",
      });
    }

    let filesList = [];

    files.forEach((file) => {
      filesList.push(file);
    });

    res.status(200).send(filesList);
  });
};

const downloadFiles = (req, res) => {
  // const fileName = req.params.name;
  const file = __basedir + "/public/uploads/" + "output.xlsx";
  const filename = path.basename(file);
  const mimetype = mime.getType(file);

  res.setHeader("Content-Disposition", "attachment;filename=" + filename);
  res.setHeader("Content-Type", mimetype);

  // return workbook.xlsx.write(res).then(() => {
  //   res.status(200).end();
  // });

  res.download(file, (err) => {
    if (err) {
      res.status(500).send({
        message: "File can not be downloaded: " + err,
      });
    }
  });
};

module.exports = { uploadFile, downloadFiles, getFilesList };
