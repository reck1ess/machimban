import React from "react";

import { StoreState } from "../types/storeType";
import { INITIAL_STORE_STATE } from "../utils/constant";

export type StoreDispatch = React.Dispatch<any>;

interface Props {
  children: React.ReactNode;
}

const StoreStateContext = React.createContext<StoreState | undefined>(
  undefined
);

const StoreDispatchContext = React.createContext<StoreDispatch | undefined>(
  undefined
);

const StoreContextProvider = ({ children }: Props) => {
  const [store, setStore] = React.useState(INITIAL_STORE_STATE);
  return (
    <StoreDispatchContext.Provider value={setStore}>
      <StoreStateContext.Provider value={store}>
        {children}
      </StoreStateContext.Provider>
    </StoreDispatchContext.Provider>
  );
};

export const useStoreState = () => {
  const state = React.useContext(StoreStateContext);
  if (!state) throw new Error("StoreProvider not found");
  return state;
};

export const useStoreDispatch = () => {
  const dispatch = React.useContext(StoreDispatchContext);
  if (!dispatch) throw new Error("StoreProvider not found");
  return dispatch;
};

export default StoreContextProvider;
