import React from "react";

import Header from "./Header";
import GPSIcon from "../map/GPSIcon";

const Layout = ({ children }) => (
  <React.Fragment>
    <Header />
    {children}
    <GPSIcon />
    
  </React.Fragment>
);

export default Layout;
