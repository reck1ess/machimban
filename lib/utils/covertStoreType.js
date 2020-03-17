const convertStoreType = type => {
  switch (true) {
    case type === "01":
      return "약국";
    case type === "02":
      return "우체국";
    default:
      return "농협";
  }
};

export default convertStoreType;
