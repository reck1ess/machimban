import { SET_KEYWORD, TOGGLE_FOCUS, SET_CLICK } from "./constant";

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
    default:
      throw new Error("Unhandled action");
  }
};

export default searchReducer;
