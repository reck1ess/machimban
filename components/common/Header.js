import NProgress from "nprogress";
import Drawer from "rc-drawer";
import React from "react";
import useSWR from "swr";

import CustomLink from "./CustomLink";
import SearchInput from "../search/SearchInput";
import SearchContext from "../../lib/context/SearchContext";
import StoreContext from "../../lib/context/StoreContext";
import PositionContext from "../../lib/context/PositionContext";
import ZoomContext from "../../lib/context/ZoomContext";
import useDebounce from "../../lib/hooks/useDebounce";
import {
  SERVER_BASE_URL,
  STORES_BY_GEO_CODE,
  DEFAULT_POSITION,
  SET_CLICK,
  NETWORK_DELAY,
  NETWORK_ERROR_MESSAGE
} from "../../lib/utils/constant";
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import delay from "../../lib/utils/delay";
import fetcher from "../../lib/utils/fetcher";
import notifyError from "../../lib/utils/notifyError";
import StoreListItem from "../store/StoreListItem";

const Header = () => {
  const {
    searchInfo: { isFocus },
    dispatch
  } = React.useContext(SearchContext);
  const { setStoreInfo } = React.useContext(StoreContext);

  const [open, setOpen] = React.useState(false);

  const { position, setPosition } = React.useContext(PositionContext);
  const { zoom, setZoom } = React.useContext(ZoomContext);
  const _lat = position ? position._lat : DEFAULT_POSITION._lat;
  const _lng = position ? position._lng : DEFAULT_POSITION._lng;

  const debouncedLat = useDebounce(_lat, 500);
  const debouncedLng = useDebounce(_lng, 500);
  const debouncedZoom = useDebounce(zoom, 500);

  let url = `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
    debouncedLat
  )}&lng=${convertDecimalPoint(debouncedLng)}&m=${convertZoomToMeter(
    debouncedZoom
  )}`;
  const { data: fetchedStores } = useSWR(url, fetcher);

  const stores = fetchedStores ? fetchedStores.stores : [];

  const handleClick = async store => {
    const { lat, lng } = store;
    dispatch({ type: SET_CLICK, isClick: true });
    try {
      NProgress.start();
      setPosition({
        y: lat,
        _lat: lat,
        x: lng,
        _lng: lng
      });
      setZoom(18);
      setStoreInfo({ ...store });
    } catch (error) {
      notifyError(NETWORK_ERROR_MESSAGE);
    } finally {
      setOpen(false);
      await delay(NETWORK_DELAY * 8);
      dispatch({ type: SET_CLICK, isClick: false });
      NProgress.done();
    }
  };

  return (
    <header>
      <CustomLink href="/" as="/">
        <img className="main-logo" src="/logo.svg" alt="메인 로고" />
      </CustomLink>
      <SearchInput />
      <Drawer
        placement="bottom"
        width="100vw"
        height="calc(100vh - 58px)"
        handler={false}
        open={open}
      >
        {stores.map(props => (
          <StoreListItem handleClick={handleClick} {...props} />
        ))}
      </Drawer>
      <button className="toggle-button" onClick={() => setOpen(!open)}>
        {open ? "지도로 보기" : "목록으로 보기"}
      </button>
      <style jsx global>
        {`
          header {
            position: absolute;
            top: 0;
            width: 100%;
            height: 58px;
            background: #8c7ae6;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: #fff;
            font-size: 16px;
            font-weight: 500;
            z-index: 10;
            transition: transform 0.4s, opacity 0.4s;
          }
          .main-logo {
            position: relative;
            margin: 11px;
            width: 36px;
            height: 36px;
            cursor: pointer;
            opacity: ${isFocus ? 0 : 1};
            transition: ${isFocus ? "opacity 0.4s" : "opacity 2s"};
          }
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
    </header>
  );
};

export default Header;
