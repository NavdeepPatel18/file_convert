import React, { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
// import { FileSaver } from "filesaver";
// import { axios } from "axios";

import logo from "./vmukti_logo.png";
import "./App.css";

function App() {
  const [isLoading, setLoading] = useState(true);
  const [upload, setUpload] = useState("Upload");

  const [isDownloading, setDownloading] = useState(true);
  const [download, setDownload] = useState("Download");

  const [file, setFile] = useState("");
  const el = useRef();

  const handleChange = (e) => {
    const file_data = e.target.files[0]; // accesing file
    console.log(file_data);
    setLoading(false);
    setUpload("Upload");
    setDownloading(true);
    setDownload("Download");
    setFile(file_data); // storing file
  };
  const uploadFile = () => {
    if (file) {
      setLoading(true);
      setUpload("Uploading...");
      const form_data = new FormData();
      form_data.append("file", file, file.name);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      fetch("http://localhost:8888/upload-file", {
        method: "POST",
        body: form_data,
        header: config,
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            setUpload("Uploaded");
            setDownloading(false);
          } else {
            alert("File upload Fails. please try again....");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const downloadFile = () => {
    setDownloading(true);
    setDownload("Downloading...");

    const url = "http://localhost:8888/download";
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "output.xlsx");
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);

    setDownload("Downloaded");
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="logo" />
        </header>
      </div>
      <div>
        <h1 className="m-5">Upload File</h1>
        <Form>
          <Form.Group controlId="formFileLg" className="col-8 m-4">
            <Form.Control
              type="file"
              size="lg"
              ref={el}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formFileLg" className="col-8">
            <Button
              className="m-4"
              variant="primary"
              size="lg"
              disabled={isLoading}
              onClick={!isLoading ? uploadFile : null}
            >
              {upload}
            </Button>
            <Button
              className="m-4"
              variant="primary"
              size="lg"
              disabled={isDownloading}
              onClick={!isDownloading ? downloadFile : null}
            >
              {download}
            </Button>
          </Form.Group>
        </Form>
      </div>
    </>
  );
}

export default App;
