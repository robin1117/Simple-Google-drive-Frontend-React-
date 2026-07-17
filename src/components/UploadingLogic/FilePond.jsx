import { useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "./FilePond.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDirectoryContext } from "../../context/DirectoryContext";

const FilePondComponent = () => {
  const { fetchData, isDragging, setIsDragging } = useDirectoryContext();

  const [isUploading, setisUploading] = useState(false);

  const pondRef = useRef(null);
  let { dirId } = useParams();

  async function handleProcessFile(err, file) {
    if (!err) {
      setTimeout(() => {
        pondRef.current.removeFile(file.id);
        fetchData(dirId);
      }, 1000);
    }
  }

  function onFileRemoveFromUi(err, file) {
    let fileList = pondRef.current?.getFiles();
    fileList.length == 0 ? setisUploading(false) : "";
  }

  useEffect(() => {
    const dragLeave = (e) => {
      console.log("dragLeave");
      setIsDragging(false);
    };

    const dragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
      console.log("dragover");
    };
    const drop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      setisUploading(true);
      console.log("drop");
    };

    window.addEventListener("dragleave", dragLeave);
    window.addEventListener("dragover", dragOver);
    window.addEventListener("drop", drop);

    return () => {
      window.removeEventListener("dragleave", dragLeave);
      window.removeEventListener("dragover", dragOver);
    };
  }, []);

  return (
    <div className={`filepond-container ${!isUploading ? "hidden" : ""}`}>
      <FilePond
        ref={pondRef}
        onprocessfile={handleProcessFile}
        onremovefile={onFileRemoveFromUi}
        dropOnPage={true}
        allowMultiple={true}
        dropOnElement={false}
        server={{
          url: "http://localhost:5000",
          withCredentials: true,
          process: {
            url: "/file/upload/",
            headers: (file) => {
              return {
                "file-Name": encodeURIComponent(file.name),
                "parent-id": dirId || "root",
              };
            },
            withCredentials: true,
          },
          patch: { url: "/file/upload/", withCredentials: true },
          revert: (uniqueFileId, load, error) => {
            console.log("Removing from UI only, keeping on server");
            load();
          },
        }}
        chunkUploads={true}
        chunkSize={1024 * 1024 * 10}
        name="file"
        credits={false}
      />
    </div>
  );
};

export default FilePondComponent;
