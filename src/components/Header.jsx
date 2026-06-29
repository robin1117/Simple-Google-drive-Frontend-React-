import React, { useEffect, useState } from "react";
import { useProfileContext } from "../context/profileContext";
import { FaFolderPlus, FaUpload, FaUserCircle } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { logoutAllApi } from "../apis/logoutAllApi";
import { logoutApi } from "../apis/logoutApi";
import { createDirectory } from "../apis/createDirectory";
import { useParams } from "react-router-dom";

const Header = () => {
  let { profile, setProfile } = useProfileContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  let { dirId } = useParams();

  async function fetchProfile() {
    try {
      const { data } = await getProfileApi();

      if (data.error) {
        navigate("/login");
        return;
      }

      setProfile({
        name: data.name ?? "",
        email: data.email ?? "",
      });
    } catch (error) {
      console.log(error);
      console.error("Failed to fetch profile:", error);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      navigate("/login");
      setIsLoggingOut(false);
    }
  }

  async function handleLogoutAll() {
    if (isLoggingOut) {
      return;
    }
    try {
      setIsLoggingOut(true);
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      navigate("/login");
      setIsLoggingOut(false);
    }
  }

  async function createDir() {
    let response = await createDirectory(dirId);
    let data = await response.text();
    fetchData();
  }

  return (
    <header className="dark:bg-amber-700">
      <div className="dir-brand">
        <div className="dir-logo">SD</div>
        <div>
          <div className="dir-title headtxt">Bhakti⭐</div>
          <div className="dir-subtitle">Collection</div>
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
            // onChange={uploadHandle}
          />
        </label>
        <button className="dir-button ghost" onClick={createDir}>
          <FaFolderPlus />
          <span>New Folder</span>
        </button>

        <button
          className="dir-button danger"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <IoLogOut size={20} />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
        <button
          className="dir-button danger"
          onClick={handleLogoutAll}
          disabled={isLoggingOut}
        >
          <IoLogOut size={20} />
          <span>{isLoggingOut ? "Logging out from All..." : "Logout All"}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
