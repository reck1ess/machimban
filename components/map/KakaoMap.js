import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import CenterIcon from "./CenterIcon";

const KakaoMap = () => {
  React.useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.4019528117587, 127.10828323199647),
      level: 5
    };

    const map = new kakao.maps.Map(container, options);
    const centerPin = new kakao.maps.CustomOverlay({
      content: renderToStaticMarkup(<CenterIcon />),
      zIndex: 3
    });

    displayCenter();

    kakao.maps.event.addListener(map, "center_changed", displayCenter);

    function displayCenter() {
      centerPin.setPosition(map.getCenter());
      centerPin.setMap(map);
    }
  }, []);

  return <div id="map" style={{ width: "100%", height: "100%" }} />;
};

export default KakaoMap;
