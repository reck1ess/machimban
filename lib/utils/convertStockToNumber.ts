const convertStockToNumber = (status: string): string => {
  switch (true) {
    case status === "plenty":
      return "100+";
    case status === "some":
      return "30~100";
    case status === "few":
      return "1~30";
    case status === "empty":
      return "품절";
    default:
      return "판매중지";
  }
};

export default convertStockToNumber;
