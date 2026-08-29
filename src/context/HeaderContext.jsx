import { createContext, useContext, useState } from "react";
import { getProfileApi } from "../apis/GET_PROFILE_apis";
import { useNavigate } from "react-router-dom";
import { logoutAllApi, logoutApi } from "../apis/POST_logout_apis";
import { createDirectoryApi } from "../apis/POST_createDir_api";
//
let HeaderContext = createContext();

export const HeaderContextProvider = ({ children }) => {
  let nevigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [files, setFiles] = useState([]);

  const [profile, setProfile] = useState({
    name: "abc",
    email: "",
    role: "user",
    picture: "",
  });

  async function fetchProfile() {
    try {
      const { data } = await getProfileApi();
      setProfile({
        name: data.name ?? "",
        email: data.email ?? "",
        role: data.role ?? "",
        picture: data.picture ?? "",
      });
    } catch (error) {
      if (error) {
        nevigate("/login");
        return;
      }
    }
  }

  async function onLogout() {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  async function onLogoutAll() {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    try {
      await logoutAllApi();
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  async function onCreateFolder(dirId) {
    let response = await createDirectoryApi(dirId);
    let data = response.data;
  }

  return (
    <HeaderContext.Provider
      value={{
        setFiles,
        files,
        profile,
        setProfile,
        fetchProfile,
        isLoggingOut,
        setIsLoggingOut,
        onLogout,
        onLogoutAll,
        onCreateFolder,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export function useHeaderContext() {
  let controlers = useContext(HeaderContext);
  return controlers;
}
