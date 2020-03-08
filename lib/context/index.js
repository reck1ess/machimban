import React from "react";

import PositionContext from "./PositionContext";
import SearchContext from "./SearchContext";
import useLocalStorage from "../hooks/useLocalStorage";
import useSessionStorage from "../hooks/useSessionStorage";
import { DEFAULT_POSITION } from "../utils/constant";

const ContextProvider = ({ children }) => {
  const [position, setPosition] = useLocalStorage("position", DEFAULT_POSITION);
  const [keyword, setKeyword] = useSessionStorage("keyword", "");

  return (
    <PositionContext.Provider
      value={{ position, setPosition: pos => setPosition(pos) }}
    >
      <SearchContext.Provider
        value={{ keyword, setKeyword: str => setKeyword(str) }}
      >
        {children}
      </SearchContext.Provider>
    </PositionContext.Provider>
  );
};

export default ContextProvider;
