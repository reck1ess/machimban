const omitBreakStatus = (status: string): string =>
  status === "break" ? "empty" : status;

export default omitBreakStatus;
