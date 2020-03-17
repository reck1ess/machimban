import React from "react";

import PositionContext from "./PositionContext";
import SearchContext from "./SearchContext";
import StoreContext from "./StoreContext";
import ZoomContext from "./ZoomContext";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  DEFAULT_POSITION,
  INITIAL_SEARCH_STATE,
  INITIAL_STORE_STATE
} from "../utils/constant";
import searchReducer from "../utils/searchReducer";

const ContextProvider = ({ children }) => {
  const [searchInfo, dispatch] = React.useReducer(
    searchReducer,
    INITIAL_SEARCH_STATE
  );
  const [storeInfo, setStoreInfo] = React.useState(INITIAL_STORE_STATE);
  const [position, setPosition] = useLocalStorage("position", DEFAULT_POSITION);
  const [zoom, setZoom] = useLocalStorage("zoom", 14);

  return (
    <SearchContext.Provider
      value={{ searchInfo, dispatch: args => dispatch(args) }}
    >
      <StoreContext.Provider
        value={{ storeInfo, setStoreInfo: store => setStoreInfo(store) }}
      >
        <PositionContext.Provider
          value={{ position, setPosition: pos => setPosition(pos) }}
        >
          <ZoomContext.Provider
            value={{ zoom, setZoom: level => setZoom(level) }}
          >
            {children}
          </ZoomContext.Provider>
        </PositionContext.Provider>
      </StoreContext.Provider>
    </SearchContext.Provider>
  );
};

export default ContextProvider;
