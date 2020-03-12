import NProgress from "nprogress";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker, NaverMap } from "react-naver-maps";
import useSWR, { trigger } from "swr";
import useSupercluster from "use-supercluster";

import ClusterIcon from "./ClusterIcon";
import GPSIcon from "./GPSIcon";
import MarkerIcon from "./MarkerIcon";
import RefreshIcon from "./RefreshIcon";
import Maybe from "../common/Maybe";

import PositionContext from "../../lib/context/PositionContext";
import ZoomContext from "../../lib/context/ZoomContext";
import {
  SERVER_BASE_URL,
  STORES_BY_GEO_CODE,
  NETWORK_ERROR_MESSAGE
} from "../../lib/utils/constant";
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import fetcher from "../../lib/utils/fetcher";
import notifyError from "../../lib/utils/notifyError";

let markerList = [];

const NaverMapPresenter = ({ stores: initialStores }, ...props) => {
  const mapRef = React.useRef();
  const navermaps = window.naver.maps;

  const [bounds, setBounds] = React.useState(null);
  const { position, setPosition } = React.useContext(PositionContext);
  const { zoom, setZoom } = React.useContext(ZoomContext);
  const { _lat, _lng } = position;

  let url = `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
    _lat
  )}&lng=${convertDecimalPoint(_lng)}&m=${convertZoomToMeter(zoom)}`;

  const { data: fetchedStores, error } = useSWR(url, fetcher);

  if (error) {
    notifyError(NETWORK_ERROR_MESSAGE);
  }

  const { stores = [] } = fetchedStores || initialStores;

  let points = stores.map(
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

  let { clusters, supercluster } = useSupercluster({
    points,
    bounds: !!bounds
      ? [bounds._sw._lng, bounds._sw._lat, bounds._ne._lng, bounds._ne._lat]
      : [],
    zoom,
    options: { radius: 200, maxZoom: 16 }
  });

  const handleZoom = zoomLevel => {
    if (zoom === zoomLevel) {
      return;
    }

    try {
      NProgress.start();
      setZoom(Math.min(18, Math.max(zoomLevel, 9)));
    } catch (error) {
      notifyError(NETWORK_ERROR_MESSAGE);
    } finally {
      NProgress.done();
    }

    if (zoomLevel < 16) {
      markerList = [];
    } else {
      setMarker();
    }
  };

  const handleCenterChange = center => {
    NProgress.start();
    setPosition(center);
    trigger(url);
    NProgress.done();
    setMarker();
  };

  const handleClick = async (e, cluster) => {
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(cluster.id),
      16
    );
    mapRef.current.panTo(e.coord);
    await handleZoom(expansionZoom);
  };

  const setMarker = () => {
    const newMarkerList = [];

    stores.forEach(store => {
      let flag = false;
      markerList.forEach(oldStores => {
        if (store.code === oldStores.code) {
          flag = true;
        }
      });
      if (!flag) {
        const { lat, lng, remain_stat, stock_at, created_at, code } = store;
        newMarkerList.push(
          <Marker
            key={code * Math.random()}
            position={new navermaps.LatLng(lat, lng)}
            icon={{
              content: renderToStaticMarkup(
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
    });

    let j = markerList ? markerList.length : 0;

    while (j--) {
      const { _lat, _lng } = markerList[j].props.position;
      if (!bounds) {
        return;
      }
      if (!bounds.hasLatLng(new navermaps.LatLng(_lat, _lng))) {
        markerList.splice(j, 1);
      }
    }
    markerList.push(...newMarkerList);
  };

  const getBounds = React.useCallback(() => {
    return mapRef.current.getBounds();
  }, [mapRef]);

  React.useEffect(() => {
    setBounds(getBounds);
    setMarker();
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
      zoom={zoom}
      onZoomChanged={handleZoom}
      bounds={bounds}
      onBoundsChanged={() => setBounds(getBounds)}
      {...props}
    >
      <Maybe test={zoom < 16}>
        {clusters.map((cluster, index) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={index}
                clickable={true}
                onClick={e => handleClick(e, cluster)}
                position={new navermaps.LatLng(latitude, longitude)}
                icon={{
                  content: renderToStaticMarkup(
                    <ClusterIcon
                      pointCount={pointCount}
                      total={points.length}
                    />
                  )
                }}
              />
            );
          }
        })}
      </Maybe>
      <Maybe test={zoom >= 16}>{markerList}</Maybe>
      <GPSIcon />
      <RefreshIcon />
    </NaverMap>
  );
};

export default NaverMapPresenter;
