import NProgress from "nprogress";
import ReactDOMServer from "react-dom/server";
import { Marker, NaverMap } from "react-naver-maps";
import useSWR, { trigger } from "swr";

import GPSIcon from "./GPSIcon";
import MarkerIcon from "./MarkerIcon";
import RefreshIcon from "./RefreshIcon";
import ClusterIcon from "./ClusterIcon";

import PositionContext from "../../lib/context/PositionContext";
import ZoomContext from "../../lib/context/ZoomContext";
import useAsyncState from "../../lib/hooks/useAsyncState";
import { SERVER_BASE_URL, STORES_BY_GEO_CODE } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";
import convertRemainToNumber from "../../lib/utils/convertRemainToNumber";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import chunkArrayInGroups from "../../lib/utils/chunkArrayInGroups";

const NaverMapPresenter = ({ stores: initialStores }, ...props) => {
  const mapRef = React.useRef();
  const [naver] = React.useState(window.naver);
  const [map, setMap] = React.useState(null);
  const [bounds, setBounds] = React.useState(null);
  const [shownStores, setShownStores] = useAsyncState([]);
  const [oldShownStores, setOldShownStores] = useAsyncState([]);

  const { position, setPosition } = React.useContext(PositionContext);
  const { zoom, setZoom } = React.useContext(ZoomContext);
  const { _lat, _lng } = position;

  const { data: fetchedStores } = useSWR(
    `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
      _lat
    )}&lng=${convertDecimalPoint(_lng)}&m=${convertZoomToMeter(zoom)}`,
    fetcher
  );

  const { stores } = fetchedStores || initialStores;

  const handleZoom = async zoomLevel => {
    NProgress.start();
    setZoom(zoomLevel);

    const oldMarkerList = [];
    const shownStoreLength = shownStores.length;

    for (let i = 0; i < shownStoreLength; i++) {
      const oldStore = shownStores[i];
      const lat = oldStore.lat;
      const lng = oldStore.lng;

      if (bounds.hasLatLng(new naver.maps.LatLng(lat, lng))) {
        oldMarkerList.push(oldStore);
      }
    }

    await setOldShownStores(oldMarkerList);

    const markerList = [];
    const storeLength = stores ? stores.length : 1;

    for (let i = 0; i < storeLength; i++) {
      const currentStore = stores[i];
      const lat = currentStore.lat;
      const lng = currentStore.lng;

      if (bounds.hasLatLng(new naver.maps.LatLng(lat, lng))) {
        markerList.push(currentStore);
      }
    }

    await setShownStores([...oldShownStores, ...markerList]);
    trigger(
      `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
        _lat
      )}&lng=${convertDecimalPoint(_lng)}&m=${convertZoomToMeter(zoom)}`
    );
    NProgress.done();
  };

  const handleCenterChange = async center => {
    NProgress.start();
    setPosition(center);

    const oldMarkerList = [];
    const shownStoreLength = shownStores.length;

    for (let i = 0; i < shownStoreLength; i++) {
      const oldStore = shownStores[i];
      const lat = oldStore.lat;
      const lng = oldStore.lng;

      if (bounds.hasLatLng(new naver.maps.LatLng(lat, lng))) {
        oldMarkerList.push(oldStore);
      }
    }

    await setOldShownStores(oldMarkerList);

    const markerList = [];
    const storeLength = stores ? stores.length : 1;

    for (let i = 0; i < storeLength; i++) {
      const currentStore = stores[i];
      const lat = currentStore.lat;
      const lng = currentStore.lng;

      if (bounds.hasLatLng(new naver.maps.LatLng(lat, lng))) {
        markerList.push(currentStore);
      }
    }

    await setShownStores([...oldShownStores, ...markerList]);
    trigger(
      `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
        _lat
      )}&lng=${convertDecimalPoint(_lng)}&m=${convertZoomToMeter(zoom)}`
    );
    NProgress.done();
  };

  const handleChageBounds = bounds => {
    setBounds(bounds);
  };

  const handleShownStores = async initialStores => {
    await setShownStores(initialStores);
  };

  React.useEffect(() => {
    handleShownStores(stores);
    handleChageBounds(mapRef.current.getBounds());
  }, []);

  React.useEffect(() => {
    setMap(naver.maps);
  }, [naver.maps]);

  if (zoom > 14) {
    return (
      <NaverMap
        id="react-naver-map"
        style={{
          width: "100%",
          height: "100%"
        }}
        naverRef={mapRef}
        center={position}
        onCenterChanged={handleCenterChange}
        zoom={Math.min(18, Math.max(zoom, 6))}
        onZoomChanged={handleZoom}
        bounds={bounds}
        onBoundsChanged={handleChageBounds}
        {...props}
      >
        {stores &&
          stores.map(
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
          )}
        <GPSIcon />
        <RefreshIcon setShownStores={setShownStores} />
      </NaverMap>
    );
  }

  const length = stores.length;
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

  return (
    <NaverMap
      id="react-naver-map"
      style={{
        width: "100%",
        height: "100%"
      }}
      naverRef={mapRef}
      center={position}
      onCenterChanged={handleCenterChange}
      zoom={Math.min(18, Math.max(zoom, 6))}
      onZoomChanged={handleZoom}
      bounds={bounds}
      onBoundsChanged={handleChageBounds}
      {...props}
    >
      {clusterMarkers &&
        clusterMarkers.map(({ latAvg, lngAvg, totalRemain }, index) => (
          <Marker
            key={index}
            position={new naver.maps.LatLng(latAvg, lngAvg)}
            icon={{
              content: ReactDOMServer.renderToString(
                <ClusterIcon totalRemain={totalRemain} />
              )
            }}
          />
        ))}
      <GPSIcon />
      <RefreshIcon setShownStores={setShownStores} />
    </NaverMap>
  );
};

export default NaverMapPresenter;
