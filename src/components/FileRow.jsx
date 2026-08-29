import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { FileIcon } from "./FileIcon";
import { Link } from "react-router-dom";

export const FileRow = ({
  fileName,
  fileId,
  extension,
  baseURL,
  onRename,
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleRename = () => {
    onRename(fileId, fileName, "file");
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete(fileId, "file");
    setIsMenuOpen(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setIsMenuOpen(true);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-white hover:bg-gray-50 transition"
    >
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <FileIcon extension={extension} />
        <span className="truncate text-sm font-medium text-gray-900">
          {fileName}
        </span>
        <span className="text-xs text-gray-400 ">File</span>
      </div>

      {/* 3-dot menu */}
      <div className="relative ml-4 ">
        <button
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            setIsMenuOpen(!isMenuOpen);
            setMenuPos({ x: e.clientX - 150, y: e.clientY + 20 });
          }}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition"
        >
          <MoreVertical size={18} />
        </button>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="fixed w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-50"
            style={{
              left: `${menuPos.x}px`,
              top: `${menuPos.y}px`,
            }}
          >
            <Link
              onClick={() => {
                setIsMenuOpen(false);
              }}
              to={`${baseURL}/file/${fileId}?action=preview`}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
            >
              Preview
            </Link>
            <a
              href={`${baseURL}/file/${fileId}?action=download`}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-200"
            >
              Download
            </a>
            <button
              onClick={handleRename}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-200"
            >
              Rename
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200 rounded-b-lg"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
