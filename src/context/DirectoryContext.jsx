import { createContext, useContext, useState } from "react";
import { getDirectoryDataApi } from "../apis/getDirectoryData";

let DirectoryContext = createContext();

export const DirectoryContextProvider = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [crumb, setcrumb] = useState([]);
  const [directoriesList, setDirectoriesList] = useState([]);
  const [fileList, setFileList] = useState([]);
  async function fetchData(id) {
    try {
      const { data } = await getDirectoryDataApi(id || "");
      setDirectoriesList(data.directories);
      setFileList(data.files);
      setcrumb(data.breadCrumb);
    } catch (error) {
      console.log(error.message);
      if (error.status == 403) {
        navigate("/login");
        // return { crumb, directoriesList, fileList };
      }
      if (error.message == "Invalid Id") {
        setDirectoriesList([]);
        setFileList([]);
        // return { crumb, directoriesList, fileList };
      }
    }
  }

  return (
    <DirectoryContext.Provider
      value={{
        crumb,
        directoriesList,
        fileList,
        fetchData,
        setIsDragging,
        isDragging,
      }}
    >
      {children}
    </DirectoryContext.Provider>
  );
};

export function useDirectoryContext() {
  let controlers = useContext(DirectoryContext);
  return controlers;
}
