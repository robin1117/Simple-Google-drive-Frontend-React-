import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Directory = () => {
  let navigate = useNavigate();
  const [rootDirId, setRootDirId] = useState(window.localStorage.rootDirId);
  let dirID = useParams();
  let dirId = dirID.dirId ?? rootDirId;
  console.log(dirId);

  const [progress, setprogress] = useState();
  const [directoriesList, setDirectoriesList] = useState([]);
  const [fileList, setFileList] = useState([]);

  const [Rename, setRename] = useState("");
  const [fileId, setfileId] = useState("");
  const [directoryfile, setdirectoryfile] = useState();

  const baseURL = "http://192.168.1.10:5000";
  const fetchURL = `${baseURL}/directory/${dirId ?? ""}`;
  // console.log(fetchURL);

  async function fetchData() {
    const res = await fetch(fetchURL);
    const data = await res.json();
    setDirectoriesList(data.directories);
    setFileList(data.files);
  }

  useEffect(() => {
    if (!rootDirId || rootDirId == "undefined") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [fetchURL]);

  async function uplaodHandle(e) {
    let file = e.target.files[0];
    const xhr = new XMLHttpRequest();

    //creating form
    let formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", `${baseURL}/file/${file.name}`, true);
    xhr.responseType = "json";

    if (dirId) {
      xhr.setRequestHeader("dirid", dirId);
    }

    xhr.onload = function () {
      fetchData();
      console.log("Response:", xhr.response); // ✅ JSON object
    };

    xhr.upload.addEventListener("progress", (e) => {
      let progress = (e.loaded / e.total) * 100;
      setprogress(`${progress.toFixed(2)}%`);
    });

    // sending formData
    xhr.send(formData);
  }

  async function deleteHandel(id, fileordir) {
    let response = await fetch(`${baseURL}/${fileordir}/${id}`, {
      method: "DELETE",
    });
    let data = await response.text();
    console.log(data);
    fetchData();
  }

  function handleRename(id, fileName, fileordir) {
    setfileId(id);
    setRename(fileName);
    setdirectoryfile(fileordir);
  }

  async function handleSave() {
    let response = await fetch(`${baseURL}/${directoryfile}/${fileId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        fileName: Rename,
      },
      body: JSON.stringify({ fileName: `${Rename}` }),
    });
    setRename("");
    setdirectoryfile("");
    setfileId("");
    let data = await response.text();
    console.log(data);
    fetchData();
  }

  async function createDir() {
    let response = await fetch(`${baseURL}/directory/`, {
      method: "POST",
      headers: {
        parentdirid: dirId,
      },
    });
    let data = await response.text();
    console.log(data);
    fetchData();
  }

  return (
    <>
      <button
        onClick={() => {
          window.localStorage.clear();
          setRootDirId("");
        }}
      >
        Logout
      </button>
      <h1> for Virtual Express Api</h1>
      <input type="file" onChange={uplaodHandle} />

      <button
        onClick={() => {
          createDir();
        }}
      >
        CreateDir
      </button>
      <br />
      <input
        type="text"
        onChange={(e) => {
          setRename(e.target.value);
        }}
        value={Rename}
      />

      <button
        onClick={() => {
          handleSave();
        }}
      >
        save
      </button>

      <div>{progress}</div>

      <ul>
        {directoriesList.map(({ dirName, id }) => (
          <li key={id}>
            <Link to={`/directory/${id}`} key={id}>
              {dirName}
            </Link>
            <button
              onClick={() => {
                handleRename(id, dirName, "directory");
              }}
            >
              rename
            </button>
            <button
              onClick={() => {
                deleteHandel(id, "directory");
              }}
            >
              Delete
            </button>
          </li>
        ))}

        {fileList.map(({ fileName, id }) => (
          <li key={id}>
            {fileName}
            <>
              <a href={`${baseURL}/file/${id}?action=preview`} target="_blank">
                preview
              </a>
              :<a href={`${baseURL}/file/${id}?action=download`}>download</a>
              <button
                onClick={() => {
                  deleteHandel(id, "file");
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  handleRename(id, fileName, "file");
                }}
              >
                rename
              </button>
            </>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Directory;
