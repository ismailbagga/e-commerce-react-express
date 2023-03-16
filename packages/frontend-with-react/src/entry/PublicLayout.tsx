import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../layout/Nav";

const PublicLayout = () => {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
};

export default PublicLayout;
