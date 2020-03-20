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
import SearchContext from "../../lib/context/SearchContext";
import StoreContext from "../../lib/context/StoreContext";
import ZoomContext from "../../lib/context/ZoomContext";
import useDebounce from "../../lib/hooks/useDebounce";
import {
  SERVER_BASE_URL,
  STORES_BY_GEO_CODE,
  NETWORK_DELAY,
  NETWORK_ERROR_MESSAGE,
  INITIAL_STORE_STATE,
  DEFAULT_POSITION
} from "../../lib/utils/constant";
import convertNaverLat from "../../lib/utils/convertNaverLat";
import convertNaverLng from "../../lib/utils/convertNaverLng";
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import delay from "../../lib/utils/delay";
import fetcher from "../../lib/utils/fetcher";
import notifyError from "../../lib/utils/notifyError";

let markerList = [];

const NaverMapPresenter = (...props) => {
  /* 네이버 지도 ref */
  const mapRef = React.useRef();
  const navermaps = window.naver.maps;

  /* 검색어 관련 상태 */
  const {
    searchInfo: { isClick }
  } = React.useContext(SearchContext);

  /* 판매점 관련 상태 */
  const { setStoreInfo } = React.useContext(StoreContext);

  /* 네이버 지도 관련 상태 */
  const [isMount, setMount] = React.useState(false);
  const [bounds, setBounds] = React.useState(null);
  const { position, setPosition } = React.useContext(PositionContext);
  const { zoom, setZoom } = React.useContext(ZoomContext);
  const _lat = position ? position._lat : DEFAULT_POSITION._lat;
  const _lng = position ? position._lng : DEFAULT_POSITION._lng;

  /* UI 이벤트 디바운스 */
  const debouncedLat = useDebounce(_lat, 500);
  const debouncedLng = useDebounce(_lng, 500);
  const debouncedZoom = useDebounce(zoom, 500);

  /* SWR 기반 API 호출 */
  let url = `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
    debouncedLat
  )}&lng=${convertDecimalPoint(debouncedLng)}&m=${convertZoomToMeter(
    debouncedZoom
  )}`;
  const { data: fetchedStores, error } = useSWR(url, fetcher);

  if (error) {
    notifyError(NETWORK_ERROR_MESSAGE);
  }

  const stores = fetchedStores ? fetchedStores.stores : [];

  /* supercluster 기반 마커 클러스터링 */
  let points =
    stores &&
    stores.map(
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

  /* 줌 이벤트 핸들러 (16레벨 이하로 줌 아웃할 경우 상세 마커 지움) */
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

  /* 센터포지션 이벤트 핸들러 */
  const handleCenterChange = center => {
    NProgress.start();
    setPosition(center);
    trigger(url);
    NProgress.done();

    if (debouncedLat === _lat && debouncedLng === _lng) {
      setMarker();
    }
  };

  /* 클러스터마커 클릭 이벤트 핸들러 */
  const handleClick = async (e, cluster) => {
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(cluster.id),
      16
    );
    await mapRef.current.panTo(e.coord);
    handleZoom(expansionZoom);
  };

  /* 클러스터마커 클릭 이벤트 핸들러 */
  const setMarker = () => {
    const newMarkerList = [];

    stores.forEach(store => {
      let flag = false;
      markerList.forEach(oldStores => {
        if (store.code === oldStores.code) {
          flag = true;
        }
      });

      const handleClick = () => {
        const { lat, lng } = store;
        setPosition(
          new navermaps.LatLng(convertNaverLat(lat), convertNaverLng(lng))
        );
        setStoreInfo({ ...store });
      };

      if (!flag) {
        const { lat, lng, code } = store;
        newMarkerList.push(
          <Marker
            key={code * Math.random()}
            onClick={handleClick}
            position={new navermaps.LatLng(lat, lng)}
            icon={{
              content: renderToStaticMarkup(<MarkerIcon {...store} />),
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
        break;
      }
      if (!bounds.hasLatLng(new navermaps.LatLng(_lat, _lng))) {
        markerList.splice(j, 1);
      }
    }

    markerList.push(...newMarkerList);
  };

  /* 현재 지도 좌표의 경계 영역 구하는 메서드 */
  const getBounds = React.useCallback(() => {
    return mapRef.current.getBounds();
  }, [mapRef]);

  /* DOM 로드 시점에 지도 경계 확인 */
  React.useEffect(() => {
    setBounds(getBounds());
    delay(NETWORK_DELAY * 8).then(() => setMount(true));
  }, []);

  /* DOM 로드 직후 혹은 검색한 장소 클릭하여 이동 시 마커 새로고침 */
  React.useEffect(() => {
    if (!isMount || isClick) {
      setMarker();
    }
  }, [stores]);

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
      onBoundsChanged={() => setBounds(getBounds())}
      onClick={() => setStoreInfo(INITIAL_STORE_STATE)}
      {...props}
    >
      <Maybe test={zoom < 16}>
        {clusters &&
          clusters.map((cluster, index) => {
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
