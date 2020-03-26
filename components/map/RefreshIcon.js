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

const RefreshIcon = () => {
  const { zoom } = React.useContext(ZoomContext);
  const { position } = React.useContext(PositionContext);
  const _lat = position ? position._lat : DEFAULT_POSITION._lat;
  const _lng = position ? position._lng : DEFAULT_POSITION._lng;

  const url = `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
    _lat
  )}&lng=${convertDecimalPoint(_lng)}&m=${convertZoomToMeter(zoom)}`;

  const handleRefresh = async () => {
    try {
      NProgress.start();
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
    <div className="refresh-icon-container">
      <img
        className="refresh-icon-image"
        src="/refresh-icon.svg"
        alt="새로고침 아이콘"
        onClick={handleRefresh}
      />
      <style jsx>{`
        .refresh-icon-container {
          position: absolute;
          top: 170px;
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
        .refresh-icon-image {
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

export default RefreshIcon;
