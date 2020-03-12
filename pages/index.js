import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import { SWRConfig } from "swr";

import LoadingSpinner from "../components/common/LoadingSpinner";
import Maybe from "../components/common/Maybe";
import {
  SERVER_BASE_URL,
  STORES_BY_GEO_CODE,
  APP_NAME,
  HOME_TITLE
} from "../lib/utils/constant";
import delay from "../lib/utils/delay";
import fetcher from "../lib/utils/fetcher";

const Home = ({ stores }) => {
  const [isLoading, setLoading] = React.useState(false);
  const NaverMapContainer = dynamic(
    () => import("../components/map/NaverMapContainer"),
    { ssr: false }
  );

  return (
    <React.Fragment>
      <Head>
        <title>{`${APP_NAME} | ${HOME_TITLE}`}</title>
      </Head>
      <SWRConfig
        value={{
          onLoadingSlow: () => {
            setLoading(true);
            delay(3000).then(() => setLoading(false));
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
        <main>
          <NaverMapContainer stores={stores} />
          <Maybe test={isLoading}>
            <LoadingSpinner />
          </Maybe>
        </main>
      </SWRConfig>
      <style jsx>{`
        main {
          position: relative;
          width: 100vw;
          height: 100vh;
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

Home.getInitialProps = async () => {
  const stores = await fetcher(
    `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=37.5666103&lng=126.9783882&m=1500`
  );
  return { stores };
};

export default Home;
