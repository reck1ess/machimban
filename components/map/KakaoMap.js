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
import convertRemainToString from "../../lib/utils/convertRemainToString";
import delay from "../../lib/utils/delay";
import fetcher from "../../lib/utils/fetcher";
import notifyError from "../../lib/utils/notifyError";
import CenterIcon from "./CenterIcon";

const KakaoMap = () => {
  /* 검색어 관련 상태 */
  const {
    searchInfo: { isClick }
  } = React.useContext(SearchContext);

  /* 판매점 관련 상태 */
  const { setStoreInfo } = React.useContext(StoreContext);

  /* 지도 관련 상태 */
  const [kakaoMap, setKakaoMap] = React.useState(null);
  const { position, setPosition } = React.useContext(PositionContext);
  const { zoom, setZoom } = React.useContext(ZoomContext);
  const lat = position ? position.lat : DEFAULT_POSITION.lat;
  const lng = position ? position.lng : DEFAULT_POSITION.lng;

  /* UI 이벤트 디바운스 */
  const debouncedLat = useDebounce(lat, 500);
  const debouncedLng = useDebounce(lng, 500);
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

  const updateMarker = () => {
    if (!kakaoMap) return;

    const currentBounds = kakaoMap.getBounds();

    stores.forEach(({ lat, lng, remain_stat }) => {
      const imageSrc = `/${convertRemainToString(remain_stat)}-mask.svg`;
      const imageSize = new kakao.maps.Size(30, 30);
      const imageOption = { offset: new kakao.maps.Point(15, 5) };

      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      const markerPosition = new kakao.maps.LatLng(lat, lng);

      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
        zIndex: 2
      });

      const storePosition = new kakao.maps.LatLng(lat, lng);

      if (currentBounds.contain(storePosition)) {
        showMarker(kakaoMap, marker);
      } else {
        hideMarker(marker);
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
    delay(NETWORK_DELAY * 8).then(() => setMount(true));

    const centerPin = new kakao.maps.CustomOverlay({
      content: renderToStaticMarkup(<CenterIcon />),
      zIndex: 1
    });

    handleBounds();
    handleChange();

    kakao.maps.event.addListener(map, "center_changed", handleBounds);
    kakao.maps.event.addListener(map, "idle", handleChange);

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
  }, []);

  React.useEffect(() => {
    updateMarker();
  }, [stores]);

  return <div id="map" style={{ width: "100%", height: "100%" }} />;
};

export default KakaoMap;
