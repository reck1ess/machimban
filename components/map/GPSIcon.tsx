import NProgress from "nprogress";
import React from "react";

import { useMapState } from "../../lib/context/MapContext";
import {
  DEFAULT_GEOLOCATION_ERROR_MESSAGE,
  SAFARI_GEOLOCATION_ERROR_MESSAGE
} from "../../lib/utils/constant";
import getLocationErrorMessage from "../../lib/utils/getLocationErrorMessage";

const GPSIcon = () => {
  const customWindow: any = window;
  const kakaoMap = useMapState();

  const handleGPS = () => {
    try {
      NProgress.start();
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          kakaoMap.panTo(
            new customWindow.kakao.maps.LatLng(latitude, longitude)
          );
          kakaoMap.setLevel(3);
        },
        async error => {
          const isDesktop = typeof window.orientation === "undefined";
          const isSafari =
            navigator.userAgent.match(/safari/i) &&
            !navigator.userAgent.match(/crios/i) &&
            !navigator.userAgent.match(/NAVER/i) &&
            typeof document.body.style.webkitFilter !== "undefined" &&
            !window["chrome"];

          if (isDesktop) {
            window.alert(DEFAULT_GEOLOCATION_ERROR_MESSAGE);
          } else if (isSafari) {
            window.alert(SAFARI_GEOLOCATION_ERROR_MESSAGE);
          } else {
            const permission = await navigator.permissions.query({
              name: "geolocation"
            });
            const message =
              permission.state === "denied"
                ? getLocationErrorMessage(navigator.userAgent)
                : DEFAULT_GEOLOCATION_ERROR_MESSAGE;
            window.alert(message);
          }
        }
      );
    } catch (error) {
      window.alert(DEFAULT_GEOLOCATION_ERROR_MESSAGE);
    } finally {
      NProgress.done();
    }
  };

  return (
    <div className="gps-icon-container">
      <img
        className="gps-icon-image"
        src="/gps-icon.svg"
        alt="GPS 아이콘"
        onClick={handleGPS}
      />
      <style jsx>{`
        .gps-icon-container {
          position: absolute;
          top: 117px;
          right: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 37px;
          height: 37px;
          border-radius: 3px;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.25);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.075),
            -1px 1px 1px rgba(0, 0, 0, 0.03), 1px 1px 1px rgba(0, 0, 0, 0.03);
          padding: 0 5px;
          overflow: hidden;
          z-index: 1;
          transition: transform 0.4s, opacity 0.4s;
        }
        .gps-icon-image {
          width: 24px;
          height: 24px;
          cursor: pointer;
          z-index: 100;
          transition: opacity 0.5s;
        }
      `}</style>
    </div>
  );
};

export default GPSIcon;
