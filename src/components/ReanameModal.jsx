import React from "react";
import { FaTimes, FaSave } from "react-icons/fa";

export const RenameModal = ({
  isOpen,
  renameTarget,
  renameValue,
  onRenameChange,
  onCancel,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            Rename {renameTarget === "file" ? "file" : "folder"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Use a clear, descriptive name.
          </p>
        </div>

        <div className="px-6 py-4">
          <input
            type="text"
            value={renameValue}
            onChange={(e) => onRenameChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter new name"
            autoFocus
          />
        </div>

        <div className="flex gap-2 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onCancel}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FaTimes size={14} />
            <span>Cancel</span>
          </button>
          <button
            onClick={onSave}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <FaSave size={14} />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
