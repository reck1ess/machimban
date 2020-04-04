import React from "react";

export type MapDispatch = React.Dispatch<any>;

interface Props {
  children: React.ReactNode;
}

const MapStateContext = React.createContext<any>(undefined);

const MapDispatchContext = React.createContext<MapDispatch | undefined>(
  undefined
);

const MapContextProvider = ({ children }: Props) => {
  const [kakaoMap, setKakaoMap] = React.useState(null);

  return (
    <MapDispatchContext.Provider value={setKakaoMap}>
      <MapStateContext.Provider value={kakaoMap}>
        {children}
      </MapStateContext.Provider>
    </MapDispatchContext.Provider>
  );
};

export const useMapState = () => {
  const state = React.useContext(MapStateContext);
  return state;
};

export const useMapDispatch = () => {
  const dispatch = React.useContext(MapDispatchContext);
  return dispatch;
};

export default MapContextProvider;
