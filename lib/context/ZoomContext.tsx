import React from "react";

import useLocalStorage from "../hooks/useLocalStorage";

export type ZoomDispatch = React.Dispatch<any>;

interface Props {
  children: React.ReactNode;
}

const ZoomStateContext = React.createContext<number | undefined>(undefined);

const ZoomDispatchContext = React.createContext<ZoomDispatch | undefined>(
  undefined
);

const ZoomContextProvider = ({ children }: Props) => {
  const [zoom, setZoom] = useLocalStorage("zoom", 14);
  return (
    <ZoomDispatchContext.Provider value={setZoom}>
      <ZoomStateContext.Provider value={zoom}>
        {children}
      </ZoomStateContext.Provider>
    </ZoomDispatchContext.Provider>
  );
};

export const useZoomState = () => {
  const state = React.useContext(ZoomStateContext);
  if (!state) throw new Error("ZoomProvider not found");
  return state;
};

export const useZoomDispatch = () => {
  const dispatch = React.useContext(ZoomDispatchContext);
  if (!dispatch) throw new Error("ZoomProvider not found");
  return dispatch;
};

export default ZoomContextProvider;
