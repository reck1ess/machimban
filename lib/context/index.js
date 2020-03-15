import React from "react";

import ClickContext from "./ClickContext";
import FocusContext from "./FocusContext";
import PositionContext from "./PositionContext";
import SearchContext from "./SearchContext";
import ZoomContext from "./ZoomContext";
import useLocalStorage from "../hooks/useLocalStorage";
import useSessionStorage from "../hooks/useSessionStorage";
import { DEFAULT_POSITION } from "../utils/constant";

const ContextProvider = ({ children }) => {
  const [click, setClick] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const [position, setPosition] = useLocalStorage("position", DEFAULT_POSITION);
  const [keyword, setKeyword] = useSessionStorage("keyword", "");
  const [zoom, setZoom] = useLocalStorage("zoom", 14);

  return (
    <ClickContext.Provider
      value={{ click, setClick: isClicked => setClick(isClicked) }}
    >
      <FocusContext.Provider
        value={{ focus, setFocus: () => setFocus(!focus) }}
      >
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
      </FocusContext.Provider>
    </ClickContext.Provider>
  );
};

export default ContextProvider;
