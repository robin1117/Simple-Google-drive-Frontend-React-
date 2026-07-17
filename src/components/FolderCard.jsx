import React from "react";
import { FaFolder, FaPen, FaTrash } from "react-icons/fa";
import { FileIcon } from "./FileIcon";
import { Link } from "react-router-dom";

export const FolderCard = ({ dirName, dirId, onRename, onDelete }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-md">
      <div className="mb-4 flex items-start gap-3">
        <div className=" rounded-lg bg-blue-50 p-3">
          <FileIcon isFolder={true} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {dirName}
          </h3>
          <p className="text-xs text-gray-500">Folder</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
        <Link
          to={`/directory/${dirId}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <FaFolder size={14} />
          <span>Open</span>
        </Link>
        <button
          onClick={() => onRename(dirId, dirName, "directory")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <FaPen size={14} />
          <span>Rename</span>
        </button>
        <button
          onClick={() => onDelete(dirId, "directory")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          <FaTrash size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
