import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaFolderPlus } from "react-icons/fa";
import { IoLogOut, IoLogOutSharp } from "react-icons/io5";
import { ChevronDown } from "lucide-react";
import { useHeaderContext } from "../context/HeaderContext";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../baseUrl";
import FilePondComponent from "./UploadingLogic/FilePond";

export const DirectoryHeader = ({ onUpload }) => {
  let { dirId } = useParams();
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const {
    profile,
    isLoggingOut,
    setIsLoggingOut,
    fetchProfile,
    onLogout,
    onLogoutAll,
    onCreateFolder,
  } = useHeaderContext();

  // Close dropdown when clicking outside
  useEffect(() => {
    fetchProfile();
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateFolder = () => {
    onCreateFolder(dirId);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const handleLogoutAll = () => {
    onLogoutAll();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg from-blue-600 to-blue-700 text-lg font-bold text-white">
              RS
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Loader⭐</h1>
              <p className="text-xs text-gray-500">Collection</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Upload Button */}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              {/* <FaUpload size={16} /> */}
              <span className="hidden sm:inline">Upload</span>
              <input
                type="file"
                multiple
                onClick={(e) => {
                  e.preventDefault();
                  console.log("you clciking on downlaod");
                }}
                className="hidden"
              />
            </label>

            <FilePondComponent />

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <FaUserCircle size={20} className="text-gray-400" />
                <div className="hidden flex-col gap-0.5 sm:flex">
                  <span className="text-xs font-semibold text-gray-900">
                    {profile?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {profile?.email || "No email"}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`ml-2 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                  {/* Create Folder */}
                  <button
                    onClick={handleCreateFolder}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50 first:rounded-t-lg"
                  >
                    <FaFolderPlus size={16} className="text-blue-600" />
                    <span>New Folder</span>
                  </button>

                  <div className="border-t border-gray-200" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <IoLogOut size={16} />
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </button>

                  {/* Logout All */}
                  <button
                    onClick={handleLogoutAll}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50 last:rounded-b-lg disabled:opacity-50"
                  >
                    <IoLogOutSharp size={16} />
                    <span>
                      {isLoggingOut ? "Logging out from All..." : "Logout All"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
