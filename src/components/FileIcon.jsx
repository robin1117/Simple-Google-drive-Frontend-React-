import React from "react";
import { BsFiletypeMp4, BsFiletypePng, BsFiletypeJpg } from "react-icons/bs";
import { TbPng } from "react-icons/tb";
import { SiJpeg } from "react-icons/si";
import { FaFileAlt, FaFolder } from "react-icons/fa";

const FILE_ICONS = {
  ".mp4": <BsFiletypeMp4 size={24} className="text-red-500" />,
  ".mkv": <BsFiletypeMp4 size={24} className="text-red-500" />,
  ".rar": <BsFiletypePng size={24} className="text-orange-500" />,
  ".png": <TbPng size={24} className="text-blue-500" />,
  ".jpeg": <SiJpeg size={24} className="text-purple-500" />,
  ".jpg": <BsFiletypeJpg size={24} className="text-yellow-500" />,
};

export const FileIcon = ({ extension, isFolder = false }) => {
  if (isFolder) {
    return <FaFolder size={24} className="text-blue-500" />;
  }

  const normalized =
    typeof extension === "string" ? extension.toLowerCase() : "";
  return (
    FILE_ICONS[normalized] || <FaFileAlt size={24} className="text-gray-400" />
  );
};
