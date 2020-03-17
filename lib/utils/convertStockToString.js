const convertStockToString = status => {
  switch (true) {
    case status === "plenty":
      return "100개 이상";
    case status === "some":
      return "30~100개";
    case status === "few":
      return "1~30개";
    case status === "empty":
      return "품절";
    default:
      return "판매중지";
  }
};

export default convertStockToString;
