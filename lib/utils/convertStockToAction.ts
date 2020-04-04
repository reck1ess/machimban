import {
  TOGGLE_PLENTY,
  TOGGLE_SOME,
  TOGGLE_FEW,
  TOGGLE_EMPTY
} from "./constant";

const convertStockToAction = (status: string): string => {
  switch (true) {
    case status === "plenty":
      return TOGGLE_PLENTY;
    case status === "some":
      return TOGGLE_SOME;
    case status === "few":
      return TOGGLE_FEW;
    case status === "empty":
      return TOGGLE_EMPTY;
    default:
      return TOGGLE_EMPTY;
  }
};

export default convertStockToAction;
