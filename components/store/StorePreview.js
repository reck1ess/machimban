import React from "react";
import Link from "next/link";

import SearchContext from "../../lib/context/SearchContext";
import StoreContext from "../../lib/context/StoreContext";
import convertCreatedTime from "../../lib/utils/convertCreatedTime";
import convertStoreType from "../../lib/utils/convertStoreType";
import convertStockToNumber from "../../lib/utils/convertStockToNumber";
import convertStockToString from "../../lib/utils/convertStockToString";
import convertStockToColor from "../../lib/utils/convertStockToColor";
import convertStockToBorderColor from "../../lib/utils/convertStockToBorderColor";
import MaskIcon from "./MaskIcon";
import { KAKAO_NAVIGATION_BASE_URL } from "../../lib/utils/constant";

const StorePreview = () => {
  const {
    searchInfo: { isFocus }
  } = React.useContext(SearchContext);
  const { storeInfo } = React.useContext(StoreContext);
  const { name, addr, lat, lng, type, stock_at, remain_stat } = storeInfo;

  return (
    <div className="store-preview-container">
      <div className="store-preview-presenter">
        <div className="stock-circle">{convertStockToString(remain_stat)}</div>
        <a
          className="store-navigation-link"
          href={`${KAKAO_NAVIGATION_BASE_URL}/${encodeURIComponent(
            name
          )},${lat},${lng}`}
          target="_blank"
        >
          길찾기 🔜
        </a>
        <p className="store-main-info">
          <span className="store-name">{name}</span>
          <span className="store-type">{convertStoreType(type)}</span>
        </p>
        <p className="store-sub-info">
          <span className="store-address">{addr}</span>
        </p>
        <p className="mask-info">
          <MaskIcon remain_stat={remain_stat} />
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
          transition: transform 0.2s, opacity 0.8s;
          transform: ${
            storeInfo.addr.length === 0 || isFocus
              ? "translate(-50%, 150px)"
              : "translate(-50%, 0px)"
          };
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
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          padding: 20px 18px;
          background: #fff;
          color: #000;
        }
        .stock-circle {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 20px;
          right: 15px;
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
        .store-navigation-link {
          position: absolute;
          right: 20px;
          top: 110px;
          color: #000;
          text-decoration: none;
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
          display: block;
          display: -webkit-box;
          font-size: 16px;
          line-height: 1.4;
          letter-spacing: -0.4px;
          color: #242424;
          height: 44.8px;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mask-info {
          position: absolute;
          top: 110px;
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
