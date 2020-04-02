import React from "react";

import SearchContext from "../../lib/context/SearchContext";
import { FILTER_LIST } from "../../lib/utils/constant";
import convertStockToAction from "../../lib/utils/convertStockToAction";
import converStockToBorderColor from "../../lib/utils/convertStockToBorderColor";
import convertStockToColor from "../../lib/utils/convertStockToColor";
import convertStockToString from "../../lib/utils/convertStockToString";

const SearchFilter = () => {
  const { searchInfo, dispatch } = React.useContext(SearchContext);
  return (
    <div className="store-filter-container">
      {FILTER_LIST.map(name => (
        <button
          className="store-filter-button"
          onClick={() => dispatch({ type: convertStockToAction(name) })}
          style={{
            background: searchInfo[name] ? convertStockToColor(name) : "#fff",
            border: searchInfo[name]
              ? `2px solid ${converStockToBorderColor(name)}`
              : `1px solid ${converStockToBorderColor(name)}`,
            color: searchInfo[name] ? "#fff" : convertStockToColor(name)
          }}
        >
          {convertStockToString(name)}
        </button>
      ))}
      <style jsx>
        {`
          .store-filter-container {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: space-between;
            left: 0;
            top: 58px;
            width: 100vw;
            max-width: 375px;
            height: 40px;
            @media screen and (min-width: 340px) {
              padding: 0 10px;
            }
          }
          .store-filter-button {
            width: 80px;
            height: 30px;
            border: none;
            border-radius: 15px;
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            outline: none;
            z-index: 9;
          }
        `}
      </style>
    </div>
  );
};

export default SearchFilter;
