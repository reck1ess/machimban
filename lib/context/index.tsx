import React from "react";

import MapContextProvider from "./MapContext";
import PositionContextProvider from "./PositionContext";
import SearchContextProvider from "./SearchContext";
import StoreContextProvider from "./StoreContext";
import ZoomContextProvider from "./ZoomContext";

const ContextProvider = ({ children }) => (
  <SearchContextProvider>
    <StoreContextProvider>
      <MapContextProvider>
        <PositionContextProvider>
          <ZoomContextProvider>{children}</ZoomContextProvider>
        </PositionContextProvider>
      </MapContextProvider>
    </StoreContextProvider>
  </SearchContextProvider>
);

export default ContextProvider;
