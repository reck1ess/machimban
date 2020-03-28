const convertRemainToZindex = status => {
  switch (true) {
    case status === "plenty":
      return 5;
    case status === "some":
      return 4;
    case status === "few":
      return 3;
    default:
      return 2;
  }
};

export default convertRemainToZindex;
