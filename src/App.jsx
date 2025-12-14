import { useEffect, useState } from "react";
import { data, Link, useParams } from "react-router-dom";

function App() {
  const [progress, setprogress] = useState();
  const [array, setArray] = useState([]);
  const [Rename, setRename] = useState("");
  const [oldName, setOldName] = useState("");

  const baseURL = "http://38.137.6.15";
  let browurl = window.location;
  const fetchURL = `${baseURL}${browurl.pathname}`;

  // console.log(browurl.pathname);

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

    xhr.open("POST", baseURL, true);

    xhr.setRequestHeader("fileName", file.name);
    xhr.setRequestHeader("path", window.location.pathname);

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

  async function deleteHandel(fileName) {
    let response = await fetch(baseURL, {
      method: "DELETE",
      headers: {
        fileName: fileName,
        path: window.location.pathname,
      },
    });

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
    let response = await fetch(baseURL, {
      method: "PATCH",
      headers: {
        OldName: oldName,
        NewName: Rename,
        path: window.location.pathname,
      },
    });
    let data = await response.text();
    console.log(data);
    fetchData();
  }

  return (
    <>
      <h1>Your files are here</h1>
      <input type="file" onChange={uplaodHandle} />

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
              <a
                href={`${
                  browurl.pathname == "/" ? "" : browurl.pathname + "/"
                }${naam}`}
              >
                {naam}
              </a>
            ) : (
              naam
            )}

            {!isdir && (
              <>
                :
                <a
                  href={`${baseURL}${
                    browurl.pathname == "/" ? "" : browurl.pathname + "/"
                  }/${naam}?action=preview`}
                  target="_blank"
                >
                  preview
                </a>
                :
                <a
                  href={`${baseURL}${
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
}

export default App;
