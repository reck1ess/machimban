import React from "react";

import convertStockToBorderColor from "../../lib/utils/convertStockToBorderColor";
import convertStockToBoxShadow from "../../lib/utils/convertStockToBoxShadow";
import convertStockToColor from "../../lib/utils/convertStockToColor";
import convertStockToNumber from "../../lib/utils/convertStockToNumber";

const MarkerIcon = ({ ...props }) => {
  const { remain_stat } = props;

  return (
    <div className="marker-container">
      <div className="marker-presenter">
        <span className="remain-stock">
          {convertStockToNumber(remain_stat)}
        </span>
      </div>
      <div className="triangle" />
      <style jsx>{`
        .marker-container {
          position: relative;
          &:hover,
          &:active {
            z-index: 2;
            box-shadow: ${convertStockToBoxShadow(remain_stat)};
          }
        }
        .marker-presenter {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          width: 54.71px;
          height: 40px;
          background: ${convertStockToColor(remain_stat)};
          border: ${`1px solid ${convertStockToBorderColor(remain_stat)}`};
        }
        .triangle {
          position: absolute;
          bottom: -9px;
          left: 0px;
          width: 0;
          height: 0;
          border: 0px solid transparent;
          border-bottom-width: 11px;
          border-top-width: 0px;
          border-left: ${`12px solid ${convertStockToColor(remain_stat)}`};
          &::before,
          &::after {
            position: absolute;
            display: block;
            content: "";
            background: ${convertStockToBorderColor(remain_stat)};
          }
          &::before {
            left: -12px;
            width: 1px;
            height: 10px;
          }
          &::after {
            left: -6.8px;
            width: 1.2px;
            height: 13.2px;
            transform: rotate(47deg);
          }
        }
        .remain-stock {
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default MarkerIcon;
