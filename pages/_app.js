import React from "react";
import { toast } from "react-toastify";

import ContextProvider from "../lib/context";
import "react-toastify/dist/ReactToastify.min.css";
import Head from "next/head";

import { FIRST_GUIDE_MESSAGE } from "../lib/utils/constant";
import notifyInfo from "../lib/utils/notifyInfo";

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
    notifyInfo(FIRST_GUIDE_MESSAGE);
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
