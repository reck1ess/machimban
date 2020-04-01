import Drawer from "rc-drawer";
import { renderToStaticMarkup } from "react-dom/server";
import useSWR, { trigger } from "swr";

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

let stores = [];
let storeMap = {};
let selectedMarker = null;

const KakaoMap = ({ setLoading }) => {
  const [clusterer, setClusterer] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [address, setAddress] = React.useState("");
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

  if (!!fetchedStores) {
    stores = fetchedStores.stores;
  }

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

  const handleMarkerClick = props => {
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

  const handleButtonClick = () => {
    setOpen(!open);
    trigger(url);
  };

  React.useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(lat, lng),
      level: 5,
      maxLevel: 12
    };

    const map = new kakao.maps.Map(container, options);
    const geocoder = new kakao.maps.services.Geocoder();

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

    function searchAddrFromCoords(coords, callback) {
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    }

    function setCurrentAddress(result, status) {
      if (status === kakao.maps.services.Status.OK) {
        for (var i = 0; i < result.length; i++) {
          if (result[i].region_type === "H") {
            setAddress(result[i].address_name);
            break;
          }
        }
      }
    }

    function handleChange() {
      const position = map.getCenter();
      const { Ha: lat, Ga: lng } = position;
      const zoom = map.getLevel();
      setPosition({ lat, lng });
      setZoom(zoom);
      searchAddrFromCoords(map.getCenter(), setCurrentAddress);
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
      <RefreshIcon setLoading={setLoading} />
      <ZoomInIcon setLoading={setLoading} />
      <ZoomOutIcon setLoading={setLoading} />
      <Drawer
        placement="bottom"
        width="100vw"
        height="calc(100% - 58px)"
        handler={false}
        open={open}
      >
        <p className="store-info-container">
          📍현재 위치 <span className="strong-text">{address}</span>
          <br />
          🧭 반경{" "}
          <span className="strong-text">
            {convertZoomToMeter(zoom)}m
          </span>에 <span className="strong-text">{stores.length}개</span>의
          판매점이 있습니다.
        </p>
        {stores.length > 0 ? (
          stores.map((props, index) => (
            <StoreListItem
              key={index}
              handleClick={handleMarkerClick}
              {...props}
            />
          ))
        ) : (
          <div className="store-result-none">
            현재 위치에 공적 마스크 판매점이 없습니다.
          </div>
        )}
      </Drawer>
      <button className="toggle-button" onClick={handleButtonClick}>
        {open ? "지도로 보기" : "목록으로 보기"}
      </button>
      <style jsx>
        {`
          .store-info-container {
            position: sticky;
            top: 0;
            width: 100%;
            max-width: 500px;
            text-align: left;
            padding: 20px 15px 20px;
            font-size: 15px;
            color: #8f8f8f;
            background: #fff;
            z-index: 999;
            border-bottom: 1px solid #f1f3f5;
          }
          .strong-text {
            color: #666;
            font-weight: 500;
          }
          .store-result-none {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: 20px;
            font-weight: 500;
          }
          .toggle-button {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            display: ${zoom < 6 ? "block" : "none"};
            margin-left: auto;
            margin-right: auto;
            width: 160px;
            height: 45px;
            border: none;
            border-radius: 25px;
            background: #8c7ae6;
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            z-index: 9;
            opacity: ${open ? 0.7 : 1};
            transition: opacity 1s;
            @media screen and (min-width: 768px) {
              bottom: 35px;
            }
          }
        `}
      </style>
    </React.Fragment>
  );
};

export default KakaoMap;
