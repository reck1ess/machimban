const convertDecimalPoint = num =>
  Math.round((num + Number.EPSILON) * 1000) / 1000;

export default convertDecimalPoint;
