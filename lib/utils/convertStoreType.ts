const convertStoreType = (type: string): string => {
  switch (true) {
    case type === "01":
      return "약국";
    case type === "02":
      return "우체국";
    case type === "03":
      return "농협";
    default:
      return "";
  }
};

export default convertStoreType;
