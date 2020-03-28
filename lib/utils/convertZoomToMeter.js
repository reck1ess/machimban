const convertZoomToMeter = zoom => {
  switch (true) {
    case zoom <= 5:
      return 500;
    case zoom === 6:
      return 750;
    case zoom === 7:
      return 1000;
    case zoom === 8:
      return 1500;
    case zoom === 9:
      return 2250;
    case zoom === 10:
      return 3500;
    default:
      return 5000;
  }
};

export default convertZoomToMeter;
