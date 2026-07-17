import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDirectoryContext } from "../context/DirectoryContext";
// import Link from "next/link";

export const Breadcrumbs = ({ crumb }) => {
  let sref = useRef();
  useEffect(() => {
    let crumbContainer = sref.current;
    crumbContainer.scrollTo({
      left: crumbContainer.scrollWidth - crumbContainer.clientWidth,
      behavior: "smooth",
    });
    return () => {};
  }, [crumb]);
  return (
    <div className=" border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div
        ref={sref}
        className="overflow-x-scroll scrollbar-none mx-auto max-w-7xl pl-2"
      >
        <div className="flex items-center gap-2 text-sm ">
          <Link
            to="/"
            className="text-blue-600 transition hover:text-blue-700 hover:underline"
          >
            RootDirectory
          </Link>
          {crumb.map(({ dirName, _id }) => {
            return (
              <div key={_id}>
                <span className="text-gray-400">/</span>
                <Link
                  to={`/directory/${_id}`}
                  className="text-blue-600 m-1 transition whitespace-nowrap hover:text-blue-700 hover:underline"
                >
                  {dirName}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
