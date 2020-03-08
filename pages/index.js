import dynamic from "next/dynamic";
import React from "react";
import useSWR from "swr";

import PositionContext from "../lib/context/PositionContext";
import useIsMounted from "../lib/hooks/useIsMounted";
import {
  SERVER_BASE_URL,
  STORES_BY_GEO_CODE,
  DEFAULT_POSITION,
  CURRENT_STORE
} from "../lib/utils/constant";
import fetcher from "../lib/utils/fetcher";
import BlankContainer from "../components/common/BlankContainer";

const Home = () => {
  const {
    position: { _lat, _lng }
  } = React.useContext(PositionContext);

  // const { data: fetchedStores } = useSWR(
  //   `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${_lat}&lng=${_lng}&m=10000`,
  //   fetcher,
  //   {
  //     initialData: initialStores
  //   }
  // );

  // const { stores, count } = fetchedStores || initialStores;

  const stores = CURRENT_STORE;

  const NaverMapContainer = dynamic(
    import("../components/map/NaverMapContainer")
  );


  return (
    <React.Fragment>
      <main>
        <NaverMapContainer stores={stores} />
        <LoadingSpinner />
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

// Home.getInitialProps = async () => {
//   const { _lat, _lng } = DEFAULT_POSITION;
//   const stores = await fetcher(
//     `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${_lat}&lng=${_lng}&m=10000`
//   );
//   return { stores };
// };

export default Home;
