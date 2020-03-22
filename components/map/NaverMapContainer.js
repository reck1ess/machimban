import { RenderAfterNavermapsLoaded } from "react-naver-maps";

import NaverMapPresenter from "./NaverMapPresenter";

const NaverMapContainer = () => (
  <RenderAfterNavermapsLoaded ncpClientId={process.env.NAVER_MAP_API_KEY}>
    <NaverMapPresenter />
  </RenderAfterNavermapsLoaded>
);

export default NaverMapContainer;
