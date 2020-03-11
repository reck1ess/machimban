import NProgress from "nprogress";
import ReactDOMServer from "react-dom/server";
import { Marker, NaverMap } from "react-naver-maps";
import { toast } from "react-toastify";
import useSWR, { trigger } from "swr";
import useSupercluster from "use-supercluster";

import ClusterIcon from "./ClusterIcon";
import GPSIcon from "./GPSIcon";
import MarkerIcon from "./MarkerIcon";
import RefreshIcon from "./RefreshIcon";

import PositionContext from "../../lib/context/PositionContext";
import ZoomContext from "../../lib/context/ZoomContext";
import useAsyncState from "../../lib/hooks/useAsyncState";
import {
  SERVER_BASE_URL,
  STORES_BY_GEO_CODE,
  NETWORK_ERROR_MESSAGE
} from "../../lib/utils/constant";
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import fetcher from "../../lib/utils/fetcher";

const NaverMapPresenter = ({ stores: initialStores }, ...props) => {
  const mapRef = React.useRef();
  const navermaps = window.naver.maps;
  const [bounds, setBounds] = React.useState(null);
  const [shownStores, setShownStores] = useAsyncState([]);
  const [oldShownStores, setOldShownStores] = useAsyncState([]);

  const { position, setPosition } = React.useContext(PositionContext);
  const { zoom, setZoom } = React.useContext(ZoomContext);
  const { _lat, _lng } = position;

  let url = `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
    _lat
  )}&lng=${convertDecimalPoint(_lng)}&m=${convertZoomToMeter(zoom)}`;

  const { data: fetchedStores, error } = useSWR(url, fetcher);

  if (error) {
    toast.error(NETWORK_ERROR_MESSAGE, {
      position: toast.POSITION.BOTTOM_CENTER
    });
  }

  const { stores = [] } = fetchedStores || initialStores;

  const points = stores.map(
    ({
      code,
      type,
      name,
      addr,
      remain_stat,
      stock_at,
      created_at,
      lat,
      lng
    }) => ({
      type: "Feature",
      properties: {
        cluster: false,
        code,
        type,
        name,
        addr,
        remain_stat,
        stock_at,
        created_at
      },
      geometry: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    })
  );

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: !!bounds
      ? [bounds._sw._lng, bounds._sw._lat, bounds._ne._lng, bounds._ne._lat]
      : [],
    zoom,
    options: { radius: 200, maxZoom: 14 }
  });

  const handleZoom = async zoomLevel => {
    NProgress.start();
    setZoom(zoomLevel);

    const oldMarkerList = [];
    const shownStoreLength = shownStores.length;

    for (let i = 0; i < shownStoreLength; i++) {
      const oldStore = shownStores[i];
      const lat = oldStore.lat;
      const lng = oldStore.lng;

      if (bounds.hasLatLng(new navermaps.LatLng(lat, lng))) {
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

      if (bounds.hasLatLng(new navermaps.LatLng(lat, lng))) {
        markerList.push(currentStore);
      }
    }

    await setShownStores([...oldShownStores, ...markerList]);
    trigger(url);

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

      if (bounds.hasLatLng(new navermaps.LatLng(lat, lng))) {
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

      if (bounds.hasLatLng(new navermaps.LatLng(lat, lng))) {
        markerList.push(currentStore);
      }
    }

    await setShownStores([...oldShownStores, ...markerList]);
    trigger(url);

    NProgress.done();
  };

  const handleChageBounds = bounds => {
    setBounds(bounds);
  };

  const handleShownStores = async initialStores => {
    await setShownStores(initialStores);
  };

  const handleClick = (e, cluster) => {
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(cluster.id),
      15
    );
    setZoom(expansionZoom);
    mapRef.current.panTo(e.coord);
  };

  React.useEffect(() => {
    handleShownStores(stores);
    handleChageBounds(mapRef.current.getBounds());
  }, []);

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
      {clusters.map((cluster, index) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const {
          cluster: isCluster,
          point_count: pointCount,
          remain_stat,
          stock_at,
          created_at
        } = cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={index}
              clickable={true}
              onClick={e => handleClick(e, cluster)}
              position={new navermaps.LatLng(latitude, longitude)}
              icon={{
                content: ReactDOMServer.renderToString(
                  <ClusterIcon pointCount={pointCount} total={points.length} />
                )
              }}
            />
          );
        } else {
          return (
            <Marker
              key={index}
              position={new navermaps.LatLng(latitude, longitude)}
              onClick={() => {
                console.log("click!!!");
                const expansionZoom = Math.min(
                  supercluster.getClusterExpansionZoom(cluster.id),
                  14
                );
                setZoom(expansionZoom);
                mapRef.current.panTo(new navermaps.LatLng(lat, lng));
              }}
              icon={{
                content: ReactDOMServer.renderToString(
                  <MarkerIcon
                    remain_stat={remain_stat}
                    stock_at={stock_at}
                    created_at={created_at}
                  />
                ),
                anchor: new navermaps.Point(8, 46)
              }}
            />
          );
        }
      })}
      <GPSIcon />
      <RefreshIcon setShownStores={setShownStores} />
    </NaverMap>
  );
};

export default NaverMapPresenter;
