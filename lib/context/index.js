import React from "react";

import PositionContext from "./PositionContext";
import SearchContext from "./SearchContext";
import ZoomContext from "./ZoomContext";
import useLocalStorage from "../hooks/useLocalStorage";
import useSessionStorage from "../hooks/useSessionStorage";
import { DEFAULT_POSITION } from "../utils/constant";

const ContextProvider = ({ children }) => {
  const [position, setPosition] = useLocalStorage("position", DEFAULT_POSITION);
  const [keyword, setKeyword] = useSessionStorage("keyword", "");
  const [zoom, setZoom] = useLocalStorage("zoom", 14);

  return (
    <PositionContext.Provider
      value={{ position, setPosition: pos => setPosition(pos) }}
    >
      <SearchContext.Provider
        value={{ keyword, setKeyword: str => setKeyword(str) }}
      >
        <ZoomContext.Provider
          value={{ zoom, setZoom: level => setZoom(level) }}
        >
          {children}
        </ZoomContext.Provider>
      </SearchContext.Provider>
    </PositionContext.Provider>
  );
};

export default ContextProvider;
