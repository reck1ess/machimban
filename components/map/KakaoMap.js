import NProgress from "nprogress";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker, NaverMap } from "react-naver-maps";
import useSWR, { trigger } from "swr";
import useSupercluster from "use-supercluster";

import ClusterIcon from "./ClusterIcon";
import GPSIcon from "./GPSIcon";
import RefreshIcon from "./RefreshIcon";
import ZoomInIcon from "./ZoomInIcon";
import ZoomOutIcon from "./ZoomOutIcon";
import Maybe from "../common/Maybe";

import MapContext from "../../lib/context/MapContext";
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
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import convertRemainToString from "../../lib/utils/convertRemainToString";
import convertRemainToZindex from "../../lib/utils/convertRemainToZindex";
import delay from "../../lib/utils/delay";
import fetcher from "../../lib/utils/fetcher";
import notifyError from "../../lib/utils/notifyError";
import CenterIcon from "./CenterIcon";

let selectedMarker = null;

const KakaoMap = () => {
  const {
    searchInfo: { isClick }
  } = React.useContext(SearchContext);

  const { setStoreInfo } = React.useContext(StoreContext);

  const [clusterer, setClusterer] = React.useState(null);
  const { kakaoMap, setKakaoMap } = React.useContext(MapContext);
  const { position, setPosition } = React.useContext(PositionContext);
  const { zoom, setZoom } = React.useContext(ZoomContext);
  const lat = position ? position.lat : DEFAULT_POSITION.lat;
  const lng = position ? position.lng : DEFAULT_POSITION.lng;

  const debouncedLat = useDebounce(lat, 500);
  const debouncedLng = useDebounce(lng, 500);
  const debouncedZoom = useDebounce(zoom, 500);

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

  const updateMarker = () => {
    if (!kakaoMap) return;

    const currentBounds = kakaoMap.getBounds();

    stores &&
      stores.forEach(store => {
        const { lat, lng, remain_stat } = store;

        const normalImage = new kakao.maps.MarkerImage(
          `/${convertRemainToString(remain_stat)}-mask.svg`,
          new kakao.maps.Size(30, 30),
          { offset: new kakao.maps.Point(15, 5) }
        );

        const activeImage = new kakao.maps.MarkerImage(
          `/${convertRemainToString(remain_stat)}-mask.svg`,
          new kakao.maps.Size(32, 32),
          { offset: new kakao.maps.Point(15, 10) }
        );

        const markerPosition = new kakao.maps.LatLng(lat, lng);

        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: normalImage,
          zIndex: convertRemainToZindex(remain_stat)
        });

        marker.normalImage = normalImage;

        kakao.maps.event.addListener(marker, "mouseover", function() {
          if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(activeImage);
            marker.setZIndex(10);
          }
        });

        kakao.maps.event.addListener(marker, "mouseout", function() {
          if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(normalImage);
            marker.setZIndex(convertRemainToZindex(remain_stat));
          }
        });

        kakao.maps.event.addListener(marker, "click", function() {
          if (!selectedMarker || selectedMarker !== marker) {
            !!selectedMarker &&
              selectedMarker.setImage(selectedMarker.normalImage);
            marker.setImage(activeImage);
            marker.setZIndex(10);
            kakaoMap.panTo(new kakao.maps.LatLng(lat, lng));
            setStoreInfo({ ...store });
          }
          selectedMarker = marker;
        });

        const storePosition = new kakao.maps.LatLng(lat, lng);

        if (currentBounds.contain(storePosition)) {
          showMarker(kakaoMap, marker);
          clusterer && clusterer.addMarker(marker);
        } else {
          hideMarker(marker);
          clusterer && clusterer.removeMarker(marker);
        }
      });
  };

  const showMarker = (map, marker) => {
    if (marker.getMap()) return;
    marker.setMap(map);
  };

  const hideMarker = marker => {
    if (!marker.getMap()) return;
    marker.setMap(null);
  };

  React.useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(lat, lng),
      level: 5,
      maxLevel: 12
    };

    const map = new kakao.maps.Map(container, options);

    setKakaoMap(map);

    const centerPin = new kakao.maps.CustomOverlay({
      content: renderToStaticMarkup(<CenterIcon />)
    });

    const clusterer = new kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 6,
      zIndex: 2,
      disableClickZoom: true
    });

    handleBounds();
    handleChange();
    setClusterer(clusterer);

    kakao.maps.event.addListener(map, "center_changed", handleBounds);
    kakao.maps.event.addListener(map, "idle", handleChange);
    kakao.maps.event.addListener(map, "click", () =>
      setStoreInfo(INITIAL_STORE_STATE)
    );
    kakao.maps.event.addListener(clusterer, "clusterclick", handleClusterClick);

    function handleBounds() {
      centerPin.setPosition(map.getCenter());
      centerPin.setMap(map);
    }

    function handleChange() {
      const position = map.getCenter();
      const { Ha: lat, Ga: lng } = position;
      const zoom = map.getLevel();
      setPosition({ lat, lng });
      setZoom(zoom);
    }

    function handleClusterClick(cluster) {
      var level = map.getLevel() - 1;
      map.setLevel(level, { anchor: cluster.getCenter() });
    }
  }, []);

  React.useEffect(() => {
    updateMarker();
  }, [stores]);

  return <div id="map" style={{ width: "100%", height: "100%" }} />;
};

export default KakaoMap;
