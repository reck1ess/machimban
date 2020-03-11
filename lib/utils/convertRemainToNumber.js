const convertRemainToNumber = status => {
  switch (true) {
    case status === "plenty":
      return 150;
    case status === "some":
      return 50;
    case status === "few":
      return 10;
    default:
      return 0;
  }
};

export default convertRemainToNumber;
