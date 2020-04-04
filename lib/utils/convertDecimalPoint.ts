const convertDecimalPoint = (num: number): number =>
  Math.round((num + Number.EPSILON) * 1000) / 1000;

export default convertDecimalPoint;
