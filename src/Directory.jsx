import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsFiletypeMp4 } from "react-icons/bs";
import { BsFiletypePng } from "react-icons/bs";
import { TbPng } from "react-icons/tb";
import { SiJpeg } from "react-icons/si";
import { BsFiletypeJpg } from "react-icons/bs";
import {
  FaUpload,
  FaFolderPlus,
  FaFolder,
  FaEye,
  FaDownload,
  FaPen,
  FaTrash,
  FaTimes,
  FaSave,
  FaUserCircle,
  FaFileAlt,
} from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

let logoArr = [
  { exe: ".mp4", logo: <BsFiletypeMp4 size={30} /> },
  { exe: ".mkv", logo: <BsFiletypeMp4 size={30} /> },
  { exe: ".rar", logo: <BsFiletypePng size={30} /> },
  { exe: ".png", logo: <TbPng size={30} /> },
  { exe: ".jpeg", logo: <SiJpeg size={30} /> },
  { exe: ".jpg", logo: <BsFiletypeJpg size={30} /> },
];

const Directory = () => {
  let navigate = useNavigate();

  let dirID = useParams();
  let dirId = dirID.dirId;

  const [directoriesList, setDirectoriesList] = useState([]);
  const [currentDir, setCurrentDir] = useState("");
  const [fileList, setFileList] = useState([]);
  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState("");
  const [renameTarget, setRenameTarget] = useState("");
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const baseURL = "http://localhost:5000";
  const fetchURL = `${baseURL}/directory/${dirId ?? ""}`;

  async function fetchData() {
    try {
      const res = await fetch(fetchURL, {
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      if (data.error) {
        navigate("/login");
        return;
      }
      setDirectoriesList(data.directories);
      setFileList(data.files);
      setCurrentDir(data.dirName);
    } catch (error) {
      console.error("Failed to fetch directory data:", error);
    }
  }

  async function fetchProfile() {
    try {
      const res = await fetch(`${baseURL}/user`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.error) {
        navigate("/login");
        return;
      }

      setProfile({
        name: data.name ?? "",
        email: data.email ?? "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchProfile();
  }, [fetchURL]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await fetch(`${baseURL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      navigate("/login");
      setIsLoggingOut(false);
    }
  }

  async function uploadHandle(e) {
    const files = Array.from(e.target.files);

    for (let file of files) {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      const uploadId = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      console.log(uploadId);
      setUploadQueue((prev) => [
        ...prev,
        { id: uploadId, name: file.name, percent: 0, status: "uploading" },
      ]);

      let formData = new FormData();
      formData.append("file", file);

      xhr.open("POST", `${baseURL}/file/${file.name}`, true);

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
      credentials: "include",
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
      credentials: "include",
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
      credentials: "include",
    });
    let data = await response.text();
    console.log(data);
    fetchData();
  }

  function findLogo(exection) {
    const normalized = typeof exection === "string" ? exection.toLowerCase() : "";
    let logoObj = logoArr.find((logoObj) => logoObj.exe == normalized);
    return logoObj?.logo ?? <FaFileAlt size={24} />;
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
          <div className="dir-user-chip">
            <FaUserCircle size={28} className="dir-user-icon" />
            <div className="dir-user-meta">
              <div className="dir-user-name">{profile.name || "User"}</div>
              <div className="dir-user-email">{profile.email || "No email"}</div>
            </div>
          </div>
          <label className="dir-upload">
            <FaUpload />
            <span>Upload</span>
            <input
              className="dir-upload-input"
              multiple
              type="file"
              onChange={uploadHandle}
            />
          </label>
          <button className="dir-button ghost" onClick={createDir}>
            <FaFolderPlus />
            <span>New Folder</span>
          </button>
          <button className="dir-button danger" onClick={handleLogout} disabled={isLoggingOut}>
            <IoLogOut size={20} />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
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
                <div className="dir-icon dir-icon-folder">
                  <FaFolder />
                </div>
                <div>
                  <div className="dir-card-title">{dirName}</div>
                  <div className="dir-card-meta">Folder</div>
                </div>
              </div>
              <div className="dir-card-actions">
                <Link className="dir-button primary" to={`/directory/${id}`}>
                  <FaFolder />
                  <span>Open</span>
                </Link>
                <button
                  className="dir-button ghost"
                  onClick={() => {
                    handleRename(id, dirName, "directory");
                  }}
                >
                  <FaPen />
                  <span>Rename</span>
                </button>
                <button
                  className="dir-button danger"
                  onClick={() => {
                    deleteHandel(id, "directory");
                  }}
                >
                  <FaTrash />
                  <span>Delete</span>
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
          {fileList.map(({ fileName, id, extension }) => (
            <div className="dir-card" key={id}>
              <div className="dir-card-main">
                <div className="dir-icon dir-icon-file">
                  {findLogo(extension)}
                </div>
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
                  <FaEye />
                  <span>Preview</span>
                </a>
                <a
                  className="dir-button ghost"
                  href={`${baseURL}/file/${id}?action=download`}
                >
                  <FaDownload />
                  <span>Download</span>
                </a>
                <button
                  className="dir-button ghost"
                  onClick={() => {
                    handleRename(id, fileName, "file");
                  }}
                >
                  <FaPen />
                  <span>Rename</span>
                </button>
                <button
                  className="dir-button danger"
                  onClick={() => {
                    deleteHandel(id, "file");
                  }}
                >
                  <FaTrash />
                  <span>Delete</span>
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
                <FaTimes />
                <span>Cancel</span>
              </button>
              <button className="dir-button primary" onClick={handleSave}>
                <FaSave />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Directory;
