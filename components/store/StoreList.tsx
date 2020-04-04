import React from "react";

import StoreListItem from "./StoreListItem";
import Maybe from "../common/Maybe";
import { StoreState } from "../../lib/types/storeType";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";

interface StoreListProps {
  address: string;
  zoom: number;
  stores: StoreState[];
  handleClick: (props: any) => void;
}

const StoreList = ({ address, zoom, stores, handleClick }: StoreListProps) => {
  return (
    <React.Fragment>
      <p className="store-info-container">
        📍현재 위치 <span className="strong-text">{address}</span>
        <br />
        🧭 반경 <span className="strong-text">{convertZoomToMeter(zoom)}m</span>
        에 <span className="strong-text">{stores.length}개</span>의 판매점이
        있습니다.
      </p>
      <Maybe test={stores?.length > 0}>
        {stores.map((props, index) => (
          <StoreListItem key={index} handleClick={handleClick} {...props} />
        ))}
      </Maybe>
      <Maybe test={stores?.length === 0}>
        <div className="store-result-none">
          현재 위치에 공적 마스크 판매점이 없습니다.
        </div>
      </Maybe>

      <style jsx>
        {`
          .store-info-container {
            position: sticky;
            top: 0;
            width: 100%;
            max-width: 500px;
            text-align: left;
            padding: 20px 15px 20px;
            font-size: 15px;
            color: #8f8f8f;
            background: #fff;
            z-index: 999;
            border-bottom: 1px solid #f1f3f5;
          }
          .strong-text {
            color: #666;
            font-weight: 500;
          }
          .store-result-none {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: 20px;
            font-weight: 500;
          }
        `}
      </style>
    </React.Fragment>
  );
};

export default StoreList;
