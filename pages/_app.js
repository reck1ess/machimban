import React from "react";
import { toast } from "react-toastify";

import ContextProvider from "../lib/context";
import "react-toastify/dist/ReactToastify.min.css";

if (typeof window !== "undefined") {
  require("lazysizes/plugins/attrchange/ls.attrchange.js");
  require("lazysizes/plugins/respimg/ls.respimg.js");
  require("lazysizes");
}

toast.configure({
  autoClose: 3000,
  draggable: false
});

export default ({ Component, pageProps }) => {
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  );
};
