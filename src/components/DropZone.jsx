import React from "react";
import { useDropzone } from "react-dropzone";

const DropZone = () => {
  const baseStyle = {
    /* ... */
  };
  const focusedStyle = { borderColor: "#2196f3" };
  const acceptStyle = { borderColor: "#00e676" };
  const rejectStyle = { borderColor: "#ff1744" };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  const {
    acceptedFiles,
    getRootProps,
    isFocused,
    isDragAccept,
    isDragReject,
    getInputProps,
  } = useDropzone({
    onDrop: (a, b, c) => {
      console.log(a);
    },
  });

  return <div></div>;
};

export default DropZone;
