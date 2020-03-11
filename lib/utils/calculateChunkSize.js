const calculateChunkSize = (length, zoom) => {
  switch (true) {
    case zoom > 13:
      return Math.round(length / (zoom - 5));
    case length < 200:
      return Math.round(length / 6);
    case length < 250:
      return Math.round(length / 4);
    case length < 300:
      return Math.round(length / 2);
    default:
      return length;
  }
};

export default calculateChunkSize;
