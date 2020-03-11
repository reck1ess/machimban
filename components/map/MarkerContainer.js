import ReactDOMServer from "react-dom/server";
import { Marker } from "react-naver-maps";

import ClusterIcon from "./ClusterIcon";
import MarkerIcon from "./MarkerIcon";
import chunkArrayInGroups from "../../lib/utils/chunkArrayInGroups";
import convertRemainToNumber from "../../lib/utils/convertRemainToNumber";

const MarkerContainer = ({ stores, naver, zoom }) => {
  if (!stores || !naver) {
    return null;
  }

  const length = stores.length;

  if (zoom > 14) {
    return stores.map(
      ({ lat, lng, remain_stat, stock_at, created_at }, index) => (
        <Marker
          key={index}
          position={new naver.maps.LatLng(lat, lng)}
          icon={{
            content: ReactDOMServer.renderToString(
              <MarkerIcon
                remain_stat={remain_stat}
                stock_at={stock_at}
                created_at={created_at}
              />
            ),
            anchor: new window.naver.maps.Point(8, 46)
          }}
        />
      )
    );
  }

  const chunkList = chunkArrayInGroups(stores, Math.round(length / (zoom - 5)));

  let latSum = 0;
  let lngSum = 0;
  let remainSum = 0;
  const clusterMarkers = [];

  chunkList.forEach(chunk => {
    chunk.forEach(store => {
      latSum += store.lat;
      lngSum += store.lng;
      remainSum += convertRemainToNumber(store.remain_stat);
    });

    clusterMarkers.push({
      latAvg: latSum / chunk.length,
      lngAvg: lngSum / chunk.length,
      totalRemain: remainSum,
      storeCount: chunk.length
    });

    latSum = 0;
    lngSum = 0;
    remainSum = 0;
  });

  return clusterMarkers.map(
    ({ latAvg, lngAvg, totalRemain, totalStore }, index) => (
      <Marker
        key={index}
        position={new naver.maps.LatLng(latAvg, lngAvg)}
        icon={{
          content: ReactDOMServer.renderToString(
            <ClusterIcon totalRemain={totalRemain} />
          )
        }}
      />
    )
  );
};

export default MarkerContainer;
