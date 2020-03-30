import Drawer from "rc-drawer";
import { renderToStaticMarkup } from "react-dom/server";
import useSWR from "swr";

import GPSIcon from "./GPSIcon";
import RefreshIcon from "./RefreshIcon";
import ZoomInIcon from "./ZoomInIcon";
import ZoomOutIcon from "./ZoomOutIcon";
import StoreListItem from "../store/StoreListItem";

import MapContext from "../../lib/context/MapContext";
import PositionContext from "../../lib/context/PositionContext";
import StoreContext from "../../lib/context/StoreContext";
import ZoomContext from "../../lib/context/ZoomContext";
import useDebounce from "../../lib/hooks/useDebounce";
import {
  SERVER_BASE_URL,
  STORES_BY_GEO_CODE,
  NETWORK_ERROR_MESSAGE,
  INITIAL_STORE_STATE,
  DEFAULT_POSITION
} from "../../lib/utils/constant";
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import convertRemainToString from "../../lib/utils/convertRemainToString";
import convertRemainToZindex from "../../lib/utils/convertRemainToZindex";
import fetcher from "../../lib/utils/fetcher";
import notifyError from "../../lib/utils/notifyError";
import CenterIcon from "./CenterIcon";

let storeMap = {};
let selectedMarker = null;

const KakaoMap = () => {
  const [clusterer, setClusterer] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const { setStoreInfo } = React.useContext(StoreContext);
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
        const { code, lat, lng, remain_stat } = store;

        const normalImage = new kakao.maps.MarkerImage(
          `/${convertRemainToString(remain_stat)}-mask.svg`,
          new kakao.maps.Size(30, 30),
          { offset: new kakao.maps.Point(15, 5) }
        );

        const activeImage = new kakao.maps.MarkerImage(
          `/${convertRemainToString(remain_stat)}-mask.svg`,
          new kakao.maps.Size(40, 40),
          { offset: new kakao.maps.Point(20, 10) }
        );

        const markerPosition = new kakao.maps.LatLng(lat, lng);

        const marker = new kakao.maps.Marker({
          position: markerPosition,
          image: normalImage,
          zIndex: convertRemainToZindex(remain_stat)
        });

        marker.normalImage = normalImage;
        marker.activeImage = activeImage;
        storeMap[code] = marker;

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

  const handleClick = props => {
    const { code, lat, lng } = props;

    if (!storeMap[code]) {
      return;
    }
    const marker = storeMap[code];

    if (!selectedMarker || selectedMarker !== marker) {
      !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);
      marker.setImage(marker.activeImage);
      marker.setZIndex(10);
      kakaoMap.panTo(new kakao.maps.LatLng(lat, lng));
      if (zoom > 5) {
        kakaoMap.setLevel(2);
      }
      setStoreInfo({ ...props });
      setOpen(false);
    }
    selectedMarker = marker;
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
      content: renderToStaticMarkup(<CenterIcon />),
      zIndex: 99
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

  return (
    <React.Fragment>
      <div id="map" style={{ width: "100%", height: "100%" }} />
      <GPSIcon />
      <RefreshIcon />
      <ZoomInIcon />
      <ZoomOutIcon />
      <Drawer
        placement="bottom"
        width="100vw"
        height="calc(100vh - 58px)"
        handler={false}
        open={open}
      >
        {stores
          ? stores.map((props, index) => (
              <StoreListItem key={index} handleClick={handleClick} {...props} />
            ))
          : `현재 위치에 공적 마스크 판매점이 없습니다.`}
      </Drawer>
      <button className="toggle-button" onClick={() => setOpen(!open)}>
        {open ? "지도로 보기" : "목록으로 보기"}
      </button>
      <style jsx global>
        {`
          .drawer {
            position: fixed;
            top: 0;
            z-index: 5;
          }
          .drawer > * {
            transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86),
              opacity 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86),
              box-shadow 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
          }
          .drawer .drawer-mask {
            background: #000;
            opacity: 0;
            width: 100%;
            height: 0;
            position: fixed;
            top: 0;
            left: 0;
            transition: opacity 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86),
              height 0s ease 0.3s;
          }
          .drawer-content-wrapper {
            position: fixed;
            background: #fff;
          }
          .drawer-content {
            overflow: auto;
            z-index: 1;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .drawer-handle {
            position: absolute;
            top: 72px;
            width: 41px;
            height: 40px;
            cursor: pointer;
            z-index: 0;
            text-align: center;
            line-height: 40px;
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff;
          }
          .drawer-handle-icon {
            width: 14px;
            height: 2px;
            background: #333;
            position: relative;
            transition: background 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
          }
          .drawer-handle-icon:before,
          .drawer-handle-icon:after {
            content: "";
            display: block;
            position: absolute;
            background: #333;
            width: 100%;
            height: 2px;
            transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
          }
          .drawer-handle-icon:before {
            top: -5px;
          }
          .drawer-handle-icon:after {
            top: 5px;
          }
          .drawer-bottom {
            width: 100%;
            height: 0%;
          }
          .drawer-bottom .drawer-content-wrapper,
          .drawer-bottom .drawer-content {
            width: 100%;
          }
          .drawer-bottom .drawer-content {
            height: 100%;
          }
          .drawer-bottom.drawer-open {
            height: 100%;
          }
          .drawer-bottom.drawer-open.no-mask {
            height: 0%;
          }
          .drawer-bottom .drawer-handle {
            left: 50%;
            margin-left: -20px;
          }
          .drawer-bottom {
            bottom: 0;
          }
          .drawer-bottom .drawer-content-wrapper {
            bottom: 0;
          }
          .drawer-bottom .drawer-handle {
            top: -40px;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
            border-radius: 4px 4px 0 0;
          }
          .drawer-bottom.drawer-open .drawer-content-wrapper {
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
          }
          .drawer.drawer-open .drawer-mask {
            opacity: 0.3;
            height: 100%;
            animation: rcDrawerFadeIn 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
            transition: none;
          }
          .drawer.drawer-open .drawer-handle-icon {
            background: transparent;
          }
          .drawer.drawer-open .drawer-handle-icon:before {
            transform: translateY(5px) rotate(45deg);
          }
          .drawer.drawer-open .drawer-handle-icon:after {
            transform: translateY(-5px) rotate(-45deg);
          }
          .toggle-button {
            position: fixed;
            bottom: 60px;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            width: 120px;
            height: 40px;
            border: none;
            border-radius: 25px;
            background: #8c7ae6;
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            z-index: 9;
          }
          @keyframes rcDrawerFadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 0.3;
            }
          }
        `}
      </style>
    </React.Fragment>
  );
};

export default KakaoMap;
