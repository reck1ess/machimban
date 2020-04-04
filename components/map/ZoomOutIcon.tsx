import axios from "axios";
import React from "react";
import NProgress from "nprogress";
import { mutate } from "swr";

import { usePositionState } from "../../lib/context/PositionContext";
import { useMapState } from "../../lib/context/MapContext";
import { useZoomState } from "../../lib/context/ZoomContext";
import {
  SERVER_BASE_URL,
  STORES_BY_GEO_CODE,
  NETWORK_ERROR_MESSAGE
} from "../../lib/utils/constant";
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import notifyError from "../../lib/utils/notifyError";

const ZoomOutIcon = () => {
  const kakaoMap = useMapState();
  const zoom = useZoomState();
  const { lat, lng } = usePositionState();

  const url = `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
    lat
  )}&lng=${convertDecimalPoint(lng)}&m=${convertZoomToMeter(zoom)}`;

  const handleClick = async () => {
    try {
      NProgress.start();
      kakaoMap.setLevel(Math.min(12, kakaoMap.getLevel() + 1));
      const { data } = await axios.get(url);
      mutate(url, { ...data });
    } catch (error) {
      notifyError(NETWORK_ERROR_MESSAGE);
    } finally {
      NProgress.done();
    }
  };

  return (
    <div className="minus-icon-container">
      <img
        className="minus-icon-image"
        src="/minus-icon.svg"
        alt="마이너스 아이콘"
        onClick={handleClick}
      />
      <style jsx>{`
        .minus-icon-container {
          position: absolute;
          top: 270px;
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
        .minus-icon-image {
          width: 22px;
          height: 22px;
          cursor: pointer;
          z-index: 100;
          transition: opacity 0.5s;
        }
      `}</style>
    </div>
  );
};

export default ZoomOutIcon;
