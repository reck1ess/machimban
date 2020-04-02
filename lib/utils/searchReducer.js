import {
  SET_KEYWORD,
  TOGGLE_FOCUS,
  TOGGLE_PLENTY,
  TOGGLE_SOME,
  TOGGLE_FEW,
  TOGGLE_EMPTY
} from "./constant";

const searchReducer = (state, action) => {
  switch (action.type) {
    case SET_KEYWORD:
      return {
        ...state,
        keyword: action.keyword
      };
    case TOGGLE_FOCUS:
      return {
        ...state,
        isFocus: !state.isFocus
      };
    case TOGGLE_PLENTY:
      return {
        ...state,
        plenty: !state.plenty
      };
    case TOGGLE_SOME:
      return {
        ...state,
        some: !state.some
      };
    case TOGGLE_FEW:
      return {
        ...state,
        few: !state.few
      };
    case TOGGLE_EMPTY:
      return {
        ...state,
        empty: !state.empty
      };
    default:
      throw new Error("Unhandled action");
  }
};

export default searchReducer;
