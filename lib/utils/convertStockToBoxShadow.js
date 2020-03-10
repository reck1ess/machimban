const convertStockToColor = (status) => {
  switch (true) {
    case status === "plenty":
      return "#c8e6c9 0 -1px 4px, #a5d6a7 0 -2px 6px, #81c784 0 -4px 20px"
    case status === "some":
      return "#fff9c4 0 -1px 4px, #fff59d 0 -2px 6px, #fff176 0 -4px 20px"
    case status === "few":
      return "#ffcdd2 0 -1px 4px, #ef9a9a 0 -2px 6px, #e57373 0 -4px 20px"
    default:
      return "#f5f5f5 0 -1px 4px, #eeeeee 0 -2px 6px, #e0e0e0 0 -4px 20px"
  }
}

export default convertStockToColor