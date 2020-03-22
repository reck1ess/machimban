import fetch from "isomorphic-unfetch";
import NProgress from "nprogress";
import { mutate } from "swr";

import PositionContext from "../../lib/context/PositionContext";
import ZoomContext from "../../lib/context/ZoomContext";
import {
  DEFAULT_POSITION,
  SERVER_BASE_URL,
  STORES_BY_GEO_CODE,
  NETWORK_ERROR_MESSAGE
} from "../../lib/utils/constant";
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import notifyError from "../../lib/utils/notifyError";

const ZoomInIcon = () => {
  const { zoom, setZoom } = React.useContext(ZoomContext);
  const { position } = React.useContext(PositionContext);
  const _lat = position ? position._lat : DEFAULT_POSITION._lat;
  const _lng = position ? position._lng : DEFAULT_POSITION._lng;

  const url = `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
    _lat
  )}&lng=${convertDecimalPoint(_lng)}&m=${convertZoomToMeter(zoom)}`;

  const handleClick = async () => {
    try {
      NProgress.start();
      setZoom(Math.min(18, zoom + 1));
      const response = await fetch(url);
      const data = await response.json();
      mutate(url, { ...data });
    } catch (error) {
      notifyError(NETWORK_ERROR_MESSAGE);
    } finally {
      NProgress.done();
    }
  };

  return (
    <div className="plus-icon-container">
      <img
        className="plus-icon-image"
        src="/plus-icon.svg"
        alt="플러스 아이콘"
        onClick={handleClick}
      />
      <style jsx>{`
        .plus-icon-container {
          position: absolute;
          top: 220px;
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
          z-index: 100;
          transition: transform 0.4s, opacity 0.4s;
        }
        .plus-icon-image {
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

export default ZoomInIcon;
