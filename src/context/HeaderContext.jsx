import { createContext, useContext, useState } from "react";
import { createDirectory } from "../apis/createDirectory";
import { getProfileApi } from "../apis/getProfileApi";
import { useNavigate } from "react-router-dom";
import { logoutAllApi, logoutApi } from "../apis/POST_logout_apis";

let HeaderContext = createContext();

export const HeaderContextProvider = ({ children }) => {
  let nevigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    let response = await createDirectory(dirId);
    let data = response.data;
  }

  return (
    <HeaderContext.Provider
      value={{
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
