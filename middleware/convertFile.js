const xlsx = require("xlsx");
let fs = require("fs");

function fileConvert(file_path) {
  let filesList = [];
  const files = fs.readdirSync(file_path);
  files.forEach((file) => {
    if (file.includes(".txt")) {
      filesList.push(file);
    }
  });
  console.log(filesList);

  let result = [];

  // Intitializing the readFileLines with the file
  const readFileLines = (filename) =>
    fs.readFileSync(filename).toString("UTF8").split("\n");

  // Calling the readFiles function with file name
  let arr = readFileLines(file_path + filesList[0]);
  const dir = {
    BinExam1: "1884",
    BinExam2: "1885",
    BinExam3: "1886",
    BinExam4: "1887",
    BinExam5: "1888",
    BinExam6: "1889",
    BinExam7: "1890",
    BinExam8: "1891",
    BinExam9: "1892",
    BinExam10: "1893",
    BinExam11: "1894",
    BinExam12: "1895",
  };
  let server_name;
  let find = "/home/vmukti/BinExam";

  for (let i = 0; i < arr.length; i++) {
    let content;
    if (arr[i].includes(find)) {
      server_name = arr[i].split("/")[3];
      continue;
    } else {
      content = arr[i].split(':10:<var publishUrl="');
      if (content.length > 1) {
        result.push({
          UUID: content[0],
          RTMP: content[1].split('"')[0],
          TCP: "tcp://pro.ambicam.com:" + dir[server_name],
        });
      }
      // console.dir(content);
    }
  }

  writeOutput(file_path, result);
}

function writeOutput(file_path, data) {
  const output = xlsx.readFile(file_path + "output.xlsx");
  const ws1 = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(output, ws1, "Link");
  xlsx.writeFile(output, file_path + "output.xlsx");
  // Printing the response array
  //   console.log(data);
}

module.exports = fileConvert;
