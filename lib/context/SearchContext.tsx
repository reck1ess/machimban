import React from "react";

import { INITIAL_SEARCH_STATE } from "../utils/constant";
import searchReducer from "../utils/searchReducer";
import { SearchState } from "../types/searchType";

export type SearchDispatch = React.Dispatch<any>;

interface Props {
  children: React.ReactNode;
}

const SearchStateContext = React.createContext<SearchState | undefined>(
  undefined
);

const SearchDispatchContext = React.createContext<SearchDispatch | undefined>(
  undefined
);

const SearchContextProvider = ({ children }: Props) => {
  const [searchInfo, dispatch] = React.useReducer(
    searchReducer,
    INITIAL_SEARCH_STATE
  );
  return (
    <SearchDispatchContext.Provider value={dispatch}>
      <SearchStateContext.Provider value={searchInfo}>
        {children}
      </SearchStateContext.Provider>
    </SearchDispatchContext.Provider>
  );
};

export const useSearchState = () => {
  const state = React.useContext(SearchStateContext);
  if (!state) throw new Error("SearchProvider not found");
  return state;
};

export const useSearchDispatch = () => {
  const dispatch = React.useContext(SearchDispatchContext);
  if (!dispatch) throw new Error("SearchProvider not found");
  return dispatch;
};

export default SearchContextProvider;
