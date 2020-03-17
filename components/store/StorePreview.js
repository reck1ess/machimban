import React from "react";

import StoreContext from "../../lib/context/StoreContext";
import convertCreatedTime from "../../lib/utils/convertCreatedTime";
import convertStoreType from "../../lib/utils/covertStoreType";
import convertStockToNumber from "../../lib/utils/convertStockToNumber";
import convertStockToString from "../../lib/utils/convertStockToString";
import convertStockToColor from "../../lib/utils/convertStockToColor";
import convertStockToBorderColor from "../../lib/utils/convertStockToBorderColor";

const StorePreview = () => {
  const { storeInfo } = React.useContext(StoreContext);
  const {
    code,
    name,
    addr,
    type,
    lat,
    lng,
    stock_at,
    remain_stat,
    created_at
  } = storeInfo;

  return (
    <div className="store-preview-container">
      <div className="store-preview-presenter">
        <div className="stock-circle">{convertStockToString(remain_stat)}</div>
        <p className="store-main-info">
          <span className="store-name">{name}</span>
          <span className="store-type">{convertStoreType(type)}</span>
        </p>
        <p className="store-sub-info">
          <span className="store-address">{addr}</span>
        </p>
        <p className="mask-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 456.733 456.733"
            className="mask-icon"
            role="presentation"
            fill={convertStockToBorderColor(remain_stat)}
          >
            <path
              d="M456.733,215.568c0-40.604-31.349-74.002-71.111-77.318v-11.581c0-3.252-2.404-6.004-5.626-6.441
	c-1.227-0.166-10.8-1.457-24.969-3.181c-0.789-0.34-1.657-0.53-2.571-0.53c-0.359,0-0.708,0.037-1.051,0.093
	c-33.478-4.022-88.597-9.942-123.038-9.942s-89.56,5.919-123.038,9.942c-0.343-0.056-0.692-0.093-1.051-0.093
	c-0.913,0-1.782,0.19-2.571,0.53c-14.17,1.724-23.743,3.015-24.969,3.181c-3.223,0.437-5.626,3.188-5.626,6.441v11.581
	C31.349,141.565,0,174.964,0,215.571c0,40.604,31.349,74.002,71.111,77.318v11.561c0,2.598,1.547,4.946,3.934,5.972
	c1.156,0.497,10.367,4.426,24.312,9.63c1.192,1.382,2.952,2.261,4.921,2.261c0.338,0,0.668-0.034,0.993-0.083
	c32.201,11.698,83.758,27.838,123.096,27.838c60.377,0,149.555-38.026,153.322-39.645c2.387-1.025,3.934-3.374,3.934-5.972v-11.561
	C425.385,289.574,456.733,256.175,456.733,215.568z M345.956,209.925c-19.02,2.646-82.268,11.058-117.589,11.058
	s-98.569-8.412-117.589-11.058v-32.316h235.178V209.925z M110.778,223.056c21.191,2.94,82.032,10.927,117.589,10.927
	s96.398-7.987,117.589-10.927v32.042c-17.802,4.978-82.101,22.239-117.589,22.239c-35.472,0-99.784-17.261-117.589-22.239V223.056z
	 M345.956,129.072v35.536H110.778v-35.537c33.535-3.959,85.488-9.405,117.589-9.405
	C260.462,119.667,312.419,125.113,345.956,129.072z M13,215.568c0-33.433,25.526-61.014,58.111-64.284v128.571
	C38.526,276.585,13,249.003,13,215.568z M84.111,132.369c3.321-0.431,7.991-1.027,13.667-1.728v129.458c0,0.011,0,0.022,0,0.033
	v45.374c-5.935-2.266-10.626-4.148-13.667-5.392V132.369z M372.622,300.114c-17.976,7.355-93.478,36.953-144.255,36.953
	c-36.622,0-86.102-15.395-117.589-26.738v-41.727c22.038,6.089,82.118,21.735,117.589,21.735s95.55-15.646,117.589-21.735v15.226
	c0,3.59,2.91,6.5,6.5,6.5s6.5-2.91,6.5-6.5v-23.695c0-0.011,0-0.022,0-0.033V130.641c5.675,0.7,10.346,1.297,13.667,1.727V300.114z
	 M385.622,279.855V151.284c32.586,3.27,58.111,30.851,58.111,64.287C443.733,249.004,418.208,276.585,385.622,279.855z"
            />
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
          </svg>

          <span className="mask-status">
            {convertStockToNumber(remain_stat)}
          </span>
          <span className="mask-created-at">
            {convertStockToNumber(remain_stat) !== "판매중지" &&
              convertCreatedTime(stock_at)}
          </span>
        </p>
      </div>
      <style>
        {`
        p {
          margin: 0;
          padding: 0;
        }
        .store-preview-container {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 998;
        }
        .store-preview-presenter {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: calc(100vw - 24px);
          max-width: 500px;
          height: 150px;
          padding: 20px 18px;
          background: #fff;
          color: #000;
          transition: transform 0.2s, opacity 0.8s;
          transform: ${
            storeInfo.addr.length === 0
              ? "translateY(150px)"
              : "translateY(0px)"
          };
        }
        .stock-circle {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          font-size: 17px;
          color: #fff;
          text-shadow: ${`1px 1px 2px ${convertStockToBorderColor(
            remain_stat
          )}`};
          background: ${convertStockToColor(remain_stat)}
        }
        .store-name {
          font-size: 18px;
          font-weight: 500;
          line-height: 1.4;
          color: #0068c3;
          margin-right: 6px;
        }
        .store-type {
          display: inline-block;
          font-size: 15px;
          color: #8f8f8f;
          vertical-align: middle;
        }
        .store-sub-info {
          width: 60%;
          margin-top: 10px;
        }
        .store-address {
          font-size: 16px;
          line-height: 1.4;
          letter-spacing: -0.4px;
          color: #242424;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          word-break: break-all;
          overflow-wrap: break-word;
        }
        .mask-info {
          position: absolute;
          bottom: 20px;
        }
        .mask-icon {
          width: 30px;
          height: 30px;
          margin-right: 6px;
          margin-bottom: -10px;
        }
        .mask-status {
          font-size: 15px;
          letter-spacing: -0.3px;
          line-height: 1.4;
          margin-right: 6px;
          color: ${convertStockToBorderColor(remain_stat)};
        }
        .mask-created-at {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
          color: #8f8f8f;
          letter-spacing: -0.1px;
        }
      `}
      </style>
    </div>
  );
};

export default StorePreview;
