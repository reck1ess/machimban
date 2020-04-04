import React from "react";
import { toast } from "react-toastify";
import Head from "next/head";

import ContextProvider from "../lib/context";
import { FIRST_GUIDE_MESSAGE } from "../lib/utils/constant";
import notifyInfo from "../lib/utils/notifyInfo";

import "react-toastify/dist/ReactToastify.min.css";
import "../styles.css";

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
  React.useEffect(() => {
    notifyInfo(
      <div style={{ padding: "10px 20px" }}>{FIRST_GUIDE_MESSAGE}</div>
    );
  }, []);
  return (
    <ContextProvider>
      <Head>
        <script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_MAP_API_KEY}&libraries=services,clusterer`}
        ></script>
      </Head>
      <Component {...pageProps} />
    </ContextProvider>
  );
};
