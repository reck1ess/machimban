import { RenderAfterNavermapsLoaded } from "react-naver-maps";

import NaverMapPresenter from "./NaverMapPresenter";
import BlankContainer from "../common/BlankContainer";
import useIsMounted from "../../lib/hooks/useIsMounted";

const NaverMapContainer = ({ stores }) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <BlankContainer />;
  }

  return (
    <RenderAfterNavermapsLoaded
      ncpClientId={process.env.NAVER_MAP_API_KEY}
      error={<p>Maps Load Error</p>}
      loading={<BlankContainer />}
    >
      <NaverMapPresenter stores={stores} />
    </RenderAfterNavermapsLoaded>
  );
};

export default NaverMapContainer;