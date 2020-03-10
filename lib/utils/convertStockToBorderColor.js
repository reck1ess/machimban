const convertStockToBorderColor = (status) => {
  switch (true) {
    case status === "plenty":
      return "#94d82d"
    case status === "some":
      return "#fcc419"
    case status === "few":
      return "#ff6b6b"
    default:
      return "#adb5bd"
  }
}

export default convertStockToBorderColor