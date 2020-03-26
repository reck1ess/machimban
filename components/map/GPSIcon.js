import NProgress from "nprogress";
import React from "react";

import PositionContext from "../../lib/context/PositionContext";

const GPSIcon = () => {
  const { position, setPosition } = React.useContext(PositionContext);

  const handleGPS = async () => {
    try {
      NProgress.start();
      await navigator.geolocation.getCurrentPosition(
        position =>
          setPosition({
            y: position.coords.latitude,
            _lat: position.coords.latitude,
            x: position.coords.longitude,
            _lng: position.coords.longitude
          }),
        err => console.log(err)
      );
    } catch (error) {
      window.alert(`위치 정보를 가져올 수 없습니다. GPS 옵션을 확인해주세요.`);
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
