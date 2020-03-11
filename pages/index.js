import dynamic from "next/dynamic";
import React from "react";

import { SERVER_BASE_URL, STORES_BY_GEO_CODE } from "../lib/utils/constant";
import fetcher from "../lib/utils/fetcher";

const Home = ({ stores }) => {
  const NaverMapContainer = dynamic(
    () => import("../components/map/NaverMapContainer"),
    { ssr: false }
  );

  return (
    <React.Fragment>
      <main>
        <NaverMapContainer stores={stores} />
      </main>
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
