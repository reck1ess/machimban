const convertStockToColor = (status: string): string => {
  switch (true) {
    case status === "plenty":
      return "#a9e34b";
    case status === "some":
      return "#ffd43b";
    case status === "few":
      return "#ff8787";
    default:
      return "#ced4da";
  }
};

export default convertStockToColor;
