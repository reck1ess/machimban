const convertRemainToString = (status: string): string => {
  switch (true) {
    case status === "plenty":
      return "green";
    case status === "some":
      return "yellow";
    case status === "few":
      return "red";
    default:
      return "gray";
  }
};

export default convertRemainToString;
