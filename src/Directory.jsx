import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Directory = () => {
  let { "*": path } = useParams();
  // console.log(path);
  const [progress, setprogress] = useState();
  const [array, setArray] = useState([]);
  const [Rename, setRename] = useState("");
  const [oldName, setOldName] = useState("");

  const baseURL = "https://5c5d82895b33.ngrok-free.app";
  let browurl = window.location;
  const fetchURL = `${baseURL}/directory/${path}`;

  async function fetchData() {
    const res = await fetch(fetchURL);
    const data = await res.json();
    setArray(data);
  }

  useEffect(() => {
    fetchData();
  }, [fetchURL]);

  async function uplaodHandle(e) {
    let file = e.target.files[0];
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${baseURL}/file/${path}/${file.name}`, true);

    //Response from server
    xhr.onload = function (e) {
      console.log("Server response:", xhr.responseText);
      fetchData();
    };

    //This is progess logic
    xhr.upload.addEventListener("progress", (e) => {
      let progress = (e.loaded / e.total) * 100;
      setprogress(`${progress.toFixed(2)}%`);
    });
    xhr.send(file);
  }

  async function deleteHandel(fileName, isDir) {
    console.log(path);
    let response = await fetch(
      `${baseURL}/${isDir ? "folder" : "file"}${
        path == "" ? "" : "/" + path
      }/${fileName}`,
      {
        method: "DELETE",
        headers: {
          path: window.location.pathname,
        },
      }
    );

    let data = await response.text();
    console.log(data);
    fetchData();
  }

  function handleRename(naam) {
    setOldName(naam);
    setRename(naam);
    console.log(naam);
  }

  async function handleSave() {
    let response = await fetch(`${baseURL}/file/${path}/${oldName}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        NewName: Rename,
        path: window.location.pathname,
      },
      body: JSON.stringify({ newFileName: `${path}/${Rename}` }),
    });
    setRename("");
    let data = await response.text();
    console.log(data);
    fetchData();
  }

  async function createDir() {
    console.log(`${baseURL}/${path}`);
    let response = await fetch(`${baseURL}/mkdir/${path}`, { method: "POST" });
    let data = await response.text();
    fetchData();
  }

  return (
    <>
      <h1>Your files are here</h1>
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
        {array.map(({ naam, isdir }) => (
          <li key={naam}>
            {isdir ? (
              <>
                <Link to={`${naam}`}>{naam}</Link>{" "}
                <button
                  onClick={() => {
                    handleRename(naam, true);
                  }}
                >
                  rename
                </button>
                <button
                  onClick={() => {
                    deleteHandel(naam, true);
                  }}
                >
                  Delete
                </button>
              </>
            ) : (
              naam
            )}

            {!isdir && (
              <>
                {" "}
                :{" "}
                <a
                  href={`${baseURL}/file/${path}/${naam}?action=preview`}
                  target="_blank"
                >
                  preview
                </a>
                :
                <a
                  href={`${baseURL}/file${
                    browurl.pathname == "/" ? "" : browurl.pathname + "/"
                  }/${naam}?action=download`}
                >
                  download
                </a>
                <button
                  onClick={() => {
                    deleteHandel(naam);
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    handleRename(naam);
                  }}
                >
                  rename
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Directory;
