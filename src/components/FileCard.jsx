"use client";

import React from "react";
import { FaEye, FaDownload, FaPen, FaTrash } from "react-icons/fa";
import { FileIcon } from "./FileIcon";

export const FileCard = ({
  fileName,
  fileId,
  extension,
  baseURL,
  onRename,
  onDelete,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-gray-300 hover:shadow-md">
      <div className="mb-4 flex items-start gap-3">
        <div className=" rounded-lg bg-gray-50 p-3">
          <FileIcon extension={extension} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {fileName}
          </h3>
          <p className="text-xs text-gray-500">File</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <a
          href={`${baseURL}/file/${fileId}?action=preview`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <FaEye size={14} />
          <span>Preview</span>
        </a>
        <a
          href={`${baseURL}/file/${fileId}?action=download`}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <FaDownload size={14} />
          <span>Download</span>
        </a>
        <button
          onClick={() => onRename(fileId, fileName, "file")}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <FaPen size={14} />
          <span>Rename</span>
        </button>
        <button
          onClick={() => onDelete(fileId, "file")}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          <FaTrash size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
