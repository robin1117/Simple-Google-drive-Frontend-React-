import React from "react";
import { Outlet } from "react-router-dom";

import { DirectoryHeader } from "./components/DirectoryHeader";
import { Breadcrumbs } from "./components/BreadCrumb";

const Layout = () => {
  return (
    <div className="p-5">
      <DirectoryHeader />
      <Outlet />
    </div>
  );
};

export default Layout;
