const omitBreakStatus = status => (status === "break" ? "empty" : status);

export default omitBreakStatus;
