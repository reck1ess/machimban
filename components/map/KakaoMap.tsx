import dynamic from "next/dynamic";
import Drawer from "rc-drawer";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { trigger } from "swr";

import RefreshIcon from "./RefreshIcon";
import ZoomInIcon from "./ZoomInIcon";
import ZoomOutIcon from "./ZoomOutIcon";
import SearchFilter from "../search/SearchFilter";

import {
  usePositionState,
  usePositionDispatch
} from "../../lib/context/PositionContext";
import { useMapState, useMapDispatch } from "../../lib/context/MapContext";
import { useSearchState } from "../../lib/context/SearchContext";
import { useStoreDispatch } from "../../lib/context/StoreContext";
import { useZoomState, useZoomDispatch } from "../../lib/context/ZoomContext";
import useDebounce from "../../lib/hooks/useDebounce";
import usePrevious from "../../lib/hooks/usePrevious";
import useRequest from "../../lib/hooks/useRequest";
import { StoreResponse } from "../../lib/types/storeType";
import {
  SERVER_BASE_URL,
  STORES_BY_GEO_CODE,
  NETWORK_ERROR_MESSAGE,
  INITIAL_STORE_STATE,
  FILTER_LIST
} from "../../lib/utils/constant";
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import convertRemainToString from "../../lib/utils/convertRemainToString";
import convertRemainToZindex from "../../lib/utils/convertRemainToZindex";
import notifyError from "../../lib/utils/notifyError";
import CenterIcon from "./CenterIcon";
import omitBreakStatus from "../../lib/utils/omitBreakStatus";
import StoreList from "../store/StoreList";
import ToggleButton from "../store/ToggleButton";

const GPSIcon = dynamic(() => import("./GPSIcon"), {
  ssr: false
});

let stores: any = [];
let filteredStores: any = [];
let storeMap: any = {};
let selectedMarker: any = null;

const KakaoMap = () => {
  const customWindow: any = window;
  const [clusterer, setClusterer] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const [address, setAddress] = React.useState("");

  const kakaoMap = useMapState();
  const setKakaoMap = useMapDispatch();
  const { lat, lng } = usePositionState();
  const setPosition = usePositionDispatch();
  const searchInfo = useSearchState();
  const { plenty, some, few, empty } = searchInfo;
  const setStore = useStoreDispatch();
  const zoom = useZoomState();
  const setZoom = useZoomDispatch();

  const prevPlenty = usePrevious(plenty);
  const prevSome = usePrevious(some);
  const prevFew = usePrevious(few);
  const prevEmpty = usePrevious(empty);

  const debouncedLat = useDebounce(lat, 500);
  const debouncedLng = useDebounce(lng, 500);
  const debouncedZoom = useDebounce(zoom, 500);

  let url = `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
    debouncedLat
  )}&lng=${convertDecimalPoint(debouncedLng)}&m=${convertZoomToMeter(
    debouncedZoom
  )}`;
  const { data: fetchedStores, error } = useRequest<StoreResponse>({ url });

  if (error) {
    notifyError(NETWORK_ERROR_MESSAGE);
  }

  if (!!fetchedStores) {
    stores = fetchedStores.stores;
  }

  const isFilterChanged = () => {
    if (
      plenty !== prevPlenty ||
      some !== prevSome ||
      few !== prevFew ||
      empty !== prevEmpty
    ) {
      return true;
    } else {
      return false;
    }
  };

  const updateMarker = () => {
    if (!kakaoMap) return;

    if (isFilterChanged()) {
      clusterer?.clear();
      Object.values(storeMap).forEach((marker: any) => {
        FILTER_LIST.filter(name => !!searchInfo[name]).forEach(status => {
          if (marker.getZIndex() === convertRemainToZindex(status)) {
            clusterer?.addMarker(marker);
          }
        });
      });

      filteredStores = stores.filter(store => !!searchInfo[store.remain_stat]);
      return;
    }

    const currentBounds = kakaoMap.getBounds();

    stores?.forEach(store => {
      const { code, lat, lng, remain_stat } = store;

      const normalImage = new customWindow.kakao.maps.MarkerImage(
        `/${convertRemainToString(remain_stat)}-mask.svg`,
        new customWindow.kakao.maps.Size(30, 30),
        { offset: new customWindow.kakao.maps.Point(15, 5) }
      );

      const activeImage = new customWindow.kakao.maps.MarkerImage(
        `/${convertRemainToString(remain_stat)}-mask.svg`,
        new customWindow.kakao.maps.Size(40, 40),
        { offset: new customWindow.kakao.maps.Point(20, 10) }
      );

      const markerPosition = new customWindow.kakao.maps.LatLng(lat, lng);

      const marker = new customWindow.kakao.maps.Marker({
        position: markerPosition,
        image: normalImage,
        zIndex: convertRemainToZindex(remain_stat)
      });

      marker.normalImage = normalImage;
      marker.activeImage = activeImage;
      storeMap[code] = marker;

      customWindow.kakao.maps.event.addListener(
        marker,
        "mouseover",
        function() {
          if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(activeImage);
            marker.setZIndex(10);
          }
        }
      );

      customWindow.kakao.maps.event.addListener(marker, "mouseout", function() {
        if (!selectedMarker || selectedMarker !== marker) {
          marker.setImage(normalImage);
          marker.setZIndex(convertRemainToZindex(remain_stat));
        }
      });

      customWindow.kakao.maps.event.addListener(marker, "click", function() {
        if (!selectedMarker || selectedMarker !== marker) {
          selectedMarker?.setImage(selectedMarker.normalImage);
          marker.setImage(activeImage);
          marker.setZIndex(10);
          kakaoMap.panTo(new customWindow.kakao.maps.LatLng(lat, lng));
          setStore({ ...store });
        }
        selectedMarker = marker;
      });

      const storePosition = new customWindow.kakao.maps.LatLng(lat, lng);

      const targetIndex = filteredStores.findIndex(
        store => store.code === code
      );

      if (
        currentBounds.contain(storePosition) &&
        searchInfo[omitBreakStatus(remain_stat)]
      ) {
        showMarker(kakaoMap, marker);
        clusterer?.addMarker(marker);
        searchInfo[store.remain_stat] && filteredStores.push(store);
      } else {
        hideMarker(marker);
        clusterer?.removeMarker(marker);
        targetIndex !== -1 && filteredStores.splice(targetIndex, 1);
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
      kakaoMap.panTo(new customWindow.kakao.maps.LatLng(lat, lng));
      if (zoom > 5) {
        kakaoMap.setLevel(2);
      }
      setStore({ ...props });
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
      center: new customWindow.kakao.maps.LatLng(lat, lng),
      level: 5,
      maxLevel: 12
    };

    const map = new customWindow.kakao.maps.Map(container, options);
    const geocoder = new customWindow.kakao.maps.services.Geocoder();

    setKakaoMap(map);

    const centerPin = new customWindow.kakao.maps.CustomOverlay({
      content: renderToStaticMarkup(<CenterIcon />),
      zIndex: 99
    });

    const clusterer: any = new customWindow.kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 6,
      zIndex: 2,
      disableClickZoom: true
    });

    handleBounds();
    handleChange();
    setClusterer(clusterer);

    customWindow.kakao.maps.event.addListener(
      map,
      "center_changed",
      handleBounds
    );
    customWindow.kakao.maps.event.addListener(map, "idle", handleChange);
    customWindow.kakao.maps.event.addListener(map, "click", () =>
      setStore(INITIAL_STORE_STATE)
    );
    customWindow.kakao.maps.event.addListener(
      clusterer,
      "clusterclick",
      handleClusterClick
    );

    function handleBounds() {
      centerPin.setPosition(map.getCenter());
      centerPin.setMap(map);
    }

    function searchAddrFromCoords(coords, callback) {
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
    }

    function setCurrentAddress(result, status) {
      if (status === customWindow.kakao.maps.services.Status.OK) {
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
  }, [stores, plenty, some, few, empty]);

  return (
    <React.Fragment>
      <div id="map" style={{ width: "100%", height: "100%" }} />
      <SearchFilter />
      <GPSIcon />
      <RefreshIcon />
      <ZoomInIcon />
      <ZoomOutIcon />
      <Drawer
        placement="bottom"
        width="100vw"
        height="calc(100% - 58px)"
        handler={false}
        open={open}
      >
        <StoreList
          address={address}
          zoom={zoom}
          stores={filteredStores}
          handleClick={handleMarkerClick}
        />
      </Drawer>
      <ToggleButton open={open} zoom={zoom} handleClick={handleButtonClick} />
    </React.Fragment>
  );
};

export default KakaoMap;
