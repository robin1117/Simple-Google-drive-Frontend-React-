import { createContext, useContext, useState } from "react";

let ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "user",
    picture: "",
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfileContext() {
  let controlers = useContext(ProfileContext);
  return controlers;
}
