import React from "react";

import useLocalStorage from "../hooks/useLocalStorage";
import { DEFAULT_POSITION } from "../utils/constant";

export type PositionState = {
  lat: number;
  lng: number;
};

export type PositionDispatch = React.Dispatch<any>;

interface Props {
  children: React.ReactNode;
}

const PositionStateContext = React.createContext<PositionState | undefined>(
  undefined
);

const PositionDispatchContext = React.createContext<
  PositionDispatch | undefined
>(undefined);

const PositionContextProvider = ({ children }: Props) => {
  const [position, setPosition] = useLocalStorage("position", DEFAULT_POSITION);
  return (
    <PositionDispatchContext.Provider value={setPosition}>
      <PositionStateContext.Provider value={position}>
        {children}
      </PositionStateContext.Provider>
    </PositionDispatchContext.Provider>
  );
};

export const usePositionState = () => {
  const state = React.useContext(PositionStateContext);
  if (!state) throw new Error("PositionProvider not found");
  return state;
};

export const usePositionDispatch = () => {
  const dispatch = React.useContext(PositionDispatchContext);
  if (!dispatch) throw new Error("MapProvider not found");
  return dispatch;
};

export default PositionContextProvider;
