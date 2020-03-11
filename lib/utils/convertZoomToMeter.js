const convertZoomToMeter = zoom => {
  switch (true) {
    case zoom >= 18:
      return 500;
    case zoom === 17:
      return 750;
    case zoom === 16:
      return 1000;
    case zoom === 15:
      return 1500;
    case zoom === 14:
      return 2250;
    case zoom === 13:
      return 3500;
    default:
      return 5000;
  }
};

export default convertZoomToMeter;
