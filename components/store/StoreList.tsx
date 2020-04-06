import React from "react";

import StoreListItem from "./StoreListItem";
import Maybe from "../common/Maybe";
import { usePositionState } from "../../lib/context/PositionContext";
import { useSearchState } from "../../lib/context/SearchContext";
import { useZoomState } from "../../lib/context/ZoomContext";
import useDebounce from "../../lib/hooks/useDebounce";
import useRequest from "../../lib/hooks/useRequest";
import { StoreResponse } from "../../lib/types/storeType";
import { SERVER_BASE_URL, STORES_BY_GEO_CODE } from "../../lib/utils/constant";
import convertZoomToMeter from "../../lib/utils/convertZoomToMeter";
import convertDecimalPoint from "../../lib/utils/convertDecimalPoint";

interface StoreListProps {
  address: string;
  handleClick: (props: any) => void;
}

let stores: any = [];

const StoreList = ({ address, handleClick }: StoreListProps) => {
  const { lat, lng } = usePositionState();
  const searchInfo = useSearchState();
  const zoom = useZoomState();
  const debouncedLat = useDebounce(lat, 500);
  const debouncedLng = useDebounce(lng, 500);
  const debouncedZoom = useDebounce(zoom, 500);

  let url = `${SERVER_BASE_URL}/${STORES_BY_GEO_CODE}lat=${convertDecimalPoint(
    debouncedLat
  )}&lng=${convertDecimalPoint(debouncedLng)}&m=${convertZoomToMeter(
    debouncedZoom + 2
  )}`;
  const { data: fetchedStores } = useRequest<StoreResponse>({ url });

  if (!!fetchedStores) {
    const filteredStores = fetchedStores.stores.filter(
      store => !!searchInfo[store.remain_stat]
    );
    stores = filteredStores;
  }

  return (
    <React.Fragment>
      <p className="store-info-container">
        📍현재 위치 <span className="strong-text">{address}</span>
        <br />
        🧭 반경{" "}
        <span className="strong-text">
          {convertZoomToMeter(debouncedZoom + 2)}m
        </span>
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
