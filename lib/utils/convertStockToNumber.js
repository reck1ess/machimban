const convertStockToNumber = (status) => {
  switch (true) {
    case status === "plenty":
      return "100+"
    case status === "some":
      return "30+"
    case status === "few":
      return "1~30"
    default:
      return "품절"
  }
}

export default convertStockToNumber