import React from "react";
import { toast } from "react-toastify";

import ContextProvider from "../lib/context";
import "react-toastify/dist/ReactToastify.min.css";
import Head from "next/head";

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
      <Head>
        <script
          type="text/javascript"
          src={`//openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NAVER_MAP_API_KEY}`}
        ></script>
        <script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_MAP_API_KEY}`}
        ></script>
      </Head>
      <Component {...pageProps} />
    </ContextProvider>
  );
};
