import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { Breadcrumbs } from "./components/BreadCrumb";
import { getDirectoryDataApi } from "./apis/getDirectoryData";
import { FolderRow } from "./components/FolderRow";
import { FileRow } from "./components/FileRow";
import { RenameModal } from "./components/ReanameModal";
import { deleteFileApi } from "./apis/DELETE_File_Folder_api";
import { renameApi } from "./apis/PATCH_Rename_api";
import { useDirectoryContext } from "./context/DirectoryContext";
import { Grid3x3, List } from "lucide-react";
import { FolderCard } from "./components/FolderCard";
import { FileCard } from "./components/FileCard";
import { createDirectoryApi } from "./apis/POST_createDir_api";

let logoArr = [
  { exe: ".mp4", logo: <BsFiletypeMp4 size={30} /> },
  { exe: ".mkv", logo: <BsFiletypeMp4 size={30} /> },
  { exe: ".rar", logo: <BsFiletypePng size={30} /> },
  { exe: ".png", logo: <TbPng size={30} /> },
  { exe: ".jpeg", logo: <SiJpeg size={30} /> },
  { exe: ".jpg", logo: <BsFiletypeJpg size={30} /> },
];

const Directory = () => {
  const { crumb, directoriesList, fileList, fetchData, isDragging } =
    useDirectoryContext();
  let navigate = useNavigate();
  let { dirId } = useParams();
  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState("");
  const [renameTarget, setRenameTarget] = useState("");
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });
  const contextMenuRef = useRef(null);
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchData(dirId);
  }, [dirId]);

  async function deleteHandel(id, fileordir) {
    await deleteFileApi(fileordir, id);
    fetchData(dirId);
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
    let response = await renameApi(renameTarget, renameId, renameValue);
    setRenameValue("");
    setRenameTarget("");
    setRenameId("");
    setIsRenameOpen(false);
    let data = response.data;
    console.log(data);
    fetchData(dirId);
  }

  async function createDir() {
    try {
      console.log(dirId);
      let response = await createDirectoryApi(dirId || "");
      setContextMenu({
        isOpen: false,
        x: 0,
        y: 0,
      });
      let data = response.data;
      fetchData(dirId);
    } catch (error) {
      console.dir(error);
    }
  }

  const handleContextMenu = (e) => {
    // Check if the right-click target is a file/folder card
    const isCardElement = e.target.closest(".group[onContextMenu]");
    // Only open page context menu if NOT clicking on a card
    if (!isCardElement) {
      e.preventDefault();
      setContextMenu({
        isOpen: true,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      console.log("hello");
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target)
      ) {
        setContextMenu({ isOpen: false, x: 0, y: 0 });
      }
    };

    if (contextMenu.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [contextMenu.isOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Breadcrumbs crumb={crumb} />

      {isDragging && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none">
          <div className="text-center">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-lg font-semibold text-blue-600">
              Drop files here to upload
            </p>
            <p className="text-sm text-blue-500 mt-1">
              Files will be automatically added to your directory
            </p>
          </div>
        </div>
      )}

      <main className="flex-1 group" onContextMenu={handleContextMenu}>
        <div className="mx-auto max-w-7xl">
          {directoriesList.length === 0 && fileList.length === 0 && (
            <div
              // {...getRootProps({ style })}
              className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 py-12 text-center m-4"
            >
              {/* <input {...getInputProps()} /> */}
              <p className="text-gray-500">
                No files or folders yet. Get started by uploading a file or
                creating a folder.
              </p>
            </div>
          )}

          {/* Folders and Files List */}
          {(directoriesList.length > 0 || fileList.length > 0) && (
            <div className="mt-4">
              {/* View Toggle Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                    viewMode === "list"
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <List size={18} />
                  <span className="text-sm font-medium">List</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                    viewMode === "grid"
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Grid3x3 size={18} />
                  <span className="text-sm font-medium">Grid</span>
                </button>
              </div>

              {/* List View */}
              {viewMode === "list" && (
                <div className="border border-gray-200 rounded-lg overflow-visible">
                  {/* Folders */}
                  {directoriesList.map(({ dirName, _id }) => (
                    <FolderRow
                      key={_id}
                      dirName={dirName}
                      dirId={_id}
                      onRename={handleRename}
                      onDelete={deleteHandel}
                    />
                  ))}

                  {/* Files */}
                  {fileList.map(({ fileName, _id, extension }) => (
                    <FileRow
                      key={_id}
                      fileName={fileName}
                      fileId={_id}
                      extension={extension}
                      baseURL={baseURL}
                      onRename={handleRename}
                      onDelete={deleteHandel}
                    />
                  ))}
                </div>
              )}

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="space-y-8 files-grid">
                  {/* Folders Grid */}
                  {directoriesList.length > 0 && (
                    <section>
                      <h2 className="mb-4 text-lg font-bold text-gray-900">
                        Folders
                      </h2>
                      <div className="grid auto-rows-max grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 files-grid">
                        {directoriesList.map(({ dirName, _id }) => (
                          <FolderCard
                            key={_id}
                            dirName={dirName}
                            dirId={_id}
                            onRename={handleRename}
                            onDelete={deleteHandel}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Files Grid */}
                  {fileList.length > 0 && (
                    <section>
                      <h2 className="mb-4 text-lg font-bold text-gray-900">
                        Files
                      </h2>
                      <div className="grid auto-rows-max grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 files-grid">
                        {fileList.map(({ fileName, _id, extension }) => (
                          <FileCard
                            key={_id}
                            fileName={fileName}
                            fileId={_id}
                            extension={extension}
                            baseURL={baseURL}
                            onRename={handleRename}
                            onDelete={deleteHandel}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Context Menu for Empty Space */}
        {contextMenu.isOpen && (
          <div
            ref={contextMenuRef}
            className="fixed w-56 rounded-lg border border-gray-300 bg-white shadow-xl z-50"
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`,
            }}
          >
            <button
              onClick={() => {
                createDir();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 last:rounded-b-lg text-left"
            >
              <span className="text-lg">📁</span>
              <span>Create Folder</span>
            </button>
            <button
              onClick={() => {
                document.querySelector("input[type='file']").click();
                setContextMenu({ isOpen: false, x: 0, y: 0 });
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg text-left"
            >
              <span className="text-lg">📤</span>
              <span>File Upload</span>
            </button>
          </div>
        )}
      </main>

      <RenameModal
        isOpen={isRenameOpen}
        renameTarget={renameTarget}
        renameValue={renameValue}
        onRenameChange={setRenameValue}
        onCancel={() => {
          setIsRenameOpen(false);
          setRenameValue("");
          setRenameTarget("");
          setRenameId("");
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default Directory;
