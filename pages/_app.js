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
      <style jsx global>
        {`
          .Toastify__toast--default {
            background: #8c7ae6;
            color: #fff;
          }
          .drawer {
            position: fixed;
            top: 0;
            z-index: 5;
          }
          .drawer > * {
            transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86),
              opacity 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86),
              box-shadow 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
          }
          .drawer .drawer-mask {
            background: #000;
            opacity: 0;
            width: 100%;
            height: 0;
            position: fixed;
            top: 0;
            left: 0;
            transition: opacity 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86),
              height 0s ease 0.3s;
          }
          .drawer-content-wrapper {
            position: fixed;
            background: #fff;
          }
          .drawer-content {
            overflow: auto;
            z-index: 1;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 40px;
          }
          .drawer-bottom {
            width: 100%;
            height: 0%;
          }
          .drawer-bottom .drawer-content-wrapper,
          .drawer-bottom .drawer-content {
            width: 100%;
          }
          .drawer-bottom .drawer-content {
            height: 100%;
          }
          .drawer-bottom.drawer-open {
            height: 100%;
          }
          .drawer-bottom.drawer-open.no-mask {
            height: 0%;
          }
          .drawer-bottom {
            bottom: 0;
          }
          .drawer-bottom .drawer-content-wrapper {
            bottom: 0;
          }
          .drawer-bottom.drawer-open .drawer-content-wrapper {
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
          }
          .drawer.drawer-open .drawer-mask {
            opacity: 0.3;
            height: 100%;
            animation: rcDrawerFadeIn 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
            transition: none;
          }
          @keyframes rcDrawerFadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 0.3;
            }
          }
        `}
      </style>
    </ContextProvider>
  );
};
