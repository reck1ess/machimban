import {
  SAMSUNG_GEOLOCATION_ERROR_MESSAGE,
  CHROME_GEOLOCATION_ERROR_MESSAGE
} from "./constant";

const getLocationErrorMessage = userAgent => {
  switch (true) {
    case userAgent.includes("SamsungBrowser"):
      return SAMSUNG_GEOLOCATION_ERROR_MESSAGE;
    default:
      return CHROME_GEOLOCATION_ERROR_MESSAGE;
  }
};

export default getLocationErrorMessage;
