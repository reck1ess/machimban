import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import Div100vh from "react-div-100vh";
import { SWRConfig } from "swr";

import LoadingSpinner from "../components/common/LoadingSpinner";
import Maybe from "../components/common/Maybe";
import { APP_NAME, HOME_TITLE } from "../lib/utils/constant";
import delay from "../lib/utils/delay";
import StorePreview from "../components/store/StorePreview";
import Header from "../components/common/Header";

const Home = () => {
  const [isLoading, setLoading] = React.useState(false);
  const KakaoMap = dynamic(() => import("../components/map/KakaoMap"), {
    ssr: false
  });

  return (
    <React.Fragment>
      <Head>
        <title>{`${APP_NAME} | ${HOME_TITLE}`}</title>
      </Head>
      <SWRConfig
        value={{
          onLoadingSlow: () => {
            setLoading(true);
            delay(3000).then(() => {
              setLoading(false);
            });
          },
          onSuccess: () => {
            setLoading(false);
          },
          onError: () => {
            setLoading(false);
          },
          onErrorRetry: (error, key, option, revalidate, { retryCount }) => {
            if (retryCount >= 2 || error.status === 404) {
              setLoading(false);
              return;
            }
            setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
          }
        }}
      >
        <Div100vh as="main" className="main-container">
          <Header />
          <KakaoMap />
          <StorePreview />
          <Maybe test={isLoading}>
            <LoadingSpinner />
          </Maybe>
        </Div100vh>
      </SWRConfig>
      <style jsx>{`
        .main-container {
          position: absolute;
          width: 100vw;
          margin: 0;
          padding: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #000;
          font-size: 16px;
          font-weight: 500;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Home;
