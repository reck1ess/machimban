import React from "react";

import convertCreatedTime from "../../lib/utils/convertCreatedTime";
import convertStoreType from "../../lib/utils/convertStoreType";
import convertStockToNumber from "../../lib/utils/convertStockToNumber";
import convertStockToString from "../../lib/utils/convertStockToString";
import convertStockToColor from "../../lib/utils/convertStockToColor";
import convertStockToBorderColor from "../../lib/utils/convertStockToBorderColor";
import MaskIcon from "./MaskIcon";

const StoreListItem = ({ handleClick, ...props }) => {
  const { code, name, addr, type, stock_at, remain_stat } = props;

  return (
    <React.Fragment>
      <div
        className="store-list-item-presenter"
        onClick={() => handleClick({ ...props })}
      >
        <div
          className="store-circle"
          style={{
            textShadow: `1px 1px 2px ${convertStockToBorderColor(remain_stat)}`,
            background: `${convertStockToColor(remain_stat)}`
          }}
        >
          {convertStockToString(remain_stat)}
        </div>
        <p className="store-main-info">
          <span className="store-name">{name}</span>
          <span className="store-type">{convertStoreType(type)}</span>
        </p>
        <p className="store-sub-info">
          <span className="store-address">{addr}</span>
        </p>
        <p className="mask-info">
          <MaskIcon remain_stat={remain_stat} />
          <span
            className="mask-status"
            style={{
              color: `${convertStockToBorderColor(remain_stat)}`
            }}
          >
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
        .store-list-item-presenter {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 150px;
          padding: 30px 15px;
          background: #fff;
          color: #000;
          cursor: pointer;
        }
        .store-circle {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 15px;
          top: 75%;
          transform: translateY(-75%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          font-size: 17px;
          color: #fff;
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
          bottom: 5px;
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
    </React.Fragment>
  );
};

export default StoreListItem;
