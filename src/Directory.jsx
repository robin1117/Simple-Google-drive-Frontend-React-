import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Directory = () => {
  let navigate = useNavigate();
  const [rootDirId, setRootDirId] = useState(window.localStorage.rootDirId);
  let dirID = useParams();
  let dirId = dirID.dirId ?? rootDirId;

  const [directoriesList, setDirectoriesList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [currentDir, setCurrentDir] = useState("");

  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState("");
  const [renameTarget, setRenameTarget] = useState("");
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const [uploadQueue, setUploadQueue] = useState([]);

  const baseURL = "http://localhost:5000";
  const fetchURL = `${baseURL}/directory/${dirId ?? ""}`;

  async function fetchData() {
    const res = await fetch(fetchURL);
    const data = await res.json();
    setDirectoriesList(data.directories);
    setFileList(data.files);
    setCurrentDir(data.dirName);
  }

  useEffect(() => {
    if (!rootDirId || rootDirId == "undefined") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [fetchURL]);

  async function uploadHandle(e) {
    const files = Array.from(e.target.files);

    for (let file of files) {
      const xhr = new XMLHttpRequest();
      const uploadId = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      console.log(uploadId);
      setUploadQueue((prev) => [
        ...prev,
        { id: uploadId, name: file.name, percent: 0, status: "uploading" },
      ]);

      let formData = new FormData();
      formData.append("file", file);

      xhr.open("POST", `${baseURL}/file/${file.name}`,true);

      xhr.responseType = "json";

      if (dirId) {
        xhr.setRequestHeader("dirid", dirId);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          let percent = (event.loaded / event.total) * 100;

          setUploadQueue((prev) =>
            prev.map((item) =>
              item.id === uploadId
                ? { ...item, percent, status: "uploading" }
                : item,
            ),
          );

        }
      };

      xhr.onload = () => {
        console.log("Uploaded:", file.name, xhr.response);
        fetchData();

        setUploadQueue((prev) =>
          prev.map((item) =>
            item.id === uploadId
              ? { ...item, percent: 100, status: "done" }
              : item,
          ),
        );

        setTimeout(() => {
          setUploadQueue((prev) => prev.filter((item) => item.id !== uploadId));
        }, 1400);
      };

      xhr.onerror = () => {
        console.error("Upload failed:", file.name);
        setUploadQueue((prev) =>
          prev.map((item) =>
            item.id === uploadId ? { ...item, status: "error" } : item,
          ),
        );
      };

      xhr.send(formData);
    }

    e.target.value = "";
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
    setRenameId(id);
    setRenameValue(fileName);
    setRenameTarget(fileordir);
    setIsRenameOpen(true);
  }

  async function handleSave() {
    if (!renameValue.trim()) {
      return;
    }
    let response = await fetch(`${baseURL}/${renameTarget}/${renameId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        fileName: renameValue,
      },
      body: JSON.stringify({ fileName: `${renameValue}` }),
    });
    setRenameValue("");
    setRenameTarget("");
    setRenameId("");
    setIsRenameOpen(false);
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
    <div className="dir-page">
      <header className="dir-topbar">
        <div className="dir-brand">
          <div className="dir-logo">SD</div>
          <div>
            <div className="dir-title">Simple Drive</div>
            <div className="dir-subtitle">Workspace files and folders</div>
          </div>
        </div>

        <div className="dir-actions">
          <label className="dir-upload">
            Upload files
            <input
              className="dir-upload-input"
              multiple
              type="file"
              onChange={uploadHandle}
            />
          </label>
          <button className="dir-button ghost" onClick={createDir}>
            New folder
          </button>
          <button
            className="dir-button danger"
            onClick={() => {
              window.localStorage.clear();
              setRootDirId("");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="dir-crumbs">
        <Link className="dir-link" to="/">
          Home
        </Link>
        <span className="dir-crumb-sep">-</span>
        <span className="dir-crumb-current">
          {currentDir ? `${currentDir}` : ""}
        </span>
      </div>

      <section className="dir-section">
        <div className="dir-section-title">Folders</div>
        <div className="dir-grid">
          
          {directoriesList.map(({ dirName, id }) => (
            <div className="dir-card" key={id}>
              <div className="dir-card-main">
                <div className="dir-icon dir-icon-folder">D</div>
                <div>
                  <div className="dir-card-title">{dirName}</div>
                  <div className="dir-card-meta">Folder</div>
                </div>
              </div>
              <div className="dir-card-actions">
                <Link className="dir-button primary" to={`/directory/${id}`}>
                  Open
                </Link>
                <button
                  className="dir-button ghost"
                  onClick={() => {
                    handleRename(id, dirName, "directory");
                  }}
                >
                  Rename
                </button>
                <button
                  className="dir-button danger"
                  onClick={() => {
                    deleteHandel(id, "directory");
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {directoriesList.length === 0 ? (
          <div className="dir-empty">No folders yet.</div>
        ) : null}
      </section>

      <section className="dir-section">
        <div className="dir-section-title">Files</div>
        <div className="dir-grid">
          {fileList.map(({ fileName, id }) => (
            <div className="dir-card" key={id}>
              <div className="dir-card-main">
                <div className="dir-icon dir-icon-file">F</div>
                <div>
                  <div className="dir-card-title">{fileName}</div>
                  <div className="dir-card-meta">File</div>
                </div>
              </div>
              <div className="dir-card-actions">
                <a
                  className="dir-button ghost"
                  href={`${baseURL}/file/${id}?action=preview`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Preview
                </a>
                <a
                  className="dir-button ghost"
                  href={`${baseURL}/file/${id}?action=download`}
                >
                  Download
                </a>
                <button
                  className="dir-button ghost"
                  onClick={() => {
                    handleRename(id, fileName, "file");
                  }}
                >
                  Rename
                </button>
                <button
                  className="dir-button danger"
                  onClick={() => {
                    deleteHandel(id, "file");
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {fileList.length === 0 ? (
          <div className="dir-empty">No files yet.</div>
        ) : null}
      </section>

      {uploadQueue.length > 0 ? (
        <section className="dir-section">
          <div className="dir-section-title">Uploads</div>
          <div className="dir-upload-list">
            {uploadQueue.map((item) => (
              <div className="dir-upload-item" key={item.id}>
                <div className="dir-upload-row">
                  <span className="dir-upload-name">{item.name}</span>
                  <span className="dir-upload-meta">
                    {item.status === "done"
                      ? "Done"
                      : `${item.percent.toFixed(0)}%`}
                  </span>
                </div>
                <div className="dir-progress">
                  <div
                    className="dir-progress-bar"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {isRenameOpen ? (
        <div className="dir-modal-backdrop">
          <div className="dir-modal">
            <div className="dir-modal-title">
              Rename {renameTarget === "file" ? "file" : "folder"}
            </div>
            <div className="dir-modal-subtitle">
              Use a clear, descriptive name.
            </div>
            <input
              className="dir-modal-input"
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
            />
            <div className="dir-modal-actions">
              <button
                className="dir-button ghost"
                onClick={() => {
                  setIsRenameOpen(false);
                  setRenameValue("");
                  setRenameTarget("");
                  setRenameId("");
                }}
              >
                Cancel
              </button>
              <button className="dir-button primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Directory;
