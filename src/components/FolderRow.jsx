import React, { useState, useRef, useEffect } from "react";
// import Link from "next/link"
import { FaFolder } from "react-icons/fa";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

export const FolderRow = ({ _id, dirName, dirId, onRename, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleRename = () => {
    onRename(dirId, dirName, "directory");
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete(dirId, "directory");
    setIsMenuOpen(false);
  };

  return (
    <div
      key={_id}
      className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-white hover:bg-gray-50 transition"
    >
      <Link
        to={`/directory/${dirId}`}
        className="flex flex-1 items-center gap-3 min-w-0"
      >
        <FaFolder size={18} className="text-blue-600 " />
        <span className="truncate text-sm font-medium text-gray-900">
          {dirName}
        </span>
        <span className="text-xs text-gray-400 ">Folder</span>
      </Link>

      {/* 3-dot menu */}
      <div className="relative ml-4 " ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition"
        >
          <MoreVertical size={18} />
        </button>

        {isMenuOpen && (
          <div className="absolute top-0 right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
            <Link
              to={`/directory/${dirId}`}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
            >
              Open
            </Link>
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
