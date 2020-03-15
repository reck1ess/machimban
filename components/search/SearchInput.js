import NProgress from "nprogress";
import useSWR from "swr";

import Maybe from "../common/Maybe";
import ClickContext from "../../lib/context/ClickContext";
import FocusContext from "../../lib/context/FocusContext";
import PositionContext from "../../lib/context/PositionContext";
import ZoomContext from "../../lib/context/ZoomContext";
import useDebounce from "../../lib/hooks/useDebounce";
import { NETWORK_ERROR_MESSAGE, NETWORK_DELAY } from "../../lib/utils/constant";
import delay from "../../lib/utils/delay";
import fetcher from "../../lib/utils/fetcher";
import notifyError from "../../lib/utils/notifyError";
import convertNaverLat from "../../lib/utils/converNaverLat";
import convertNaverLng from "../../lib/utils/convertNaverLng";

const SearchInput = () => {
  const { setClick } = React.useContext(ClickContext);
  const { focus: isFocus, setFocus } = React.useContext(FocusContext);
  const { setPosition } = React.useContext(PositionContext);
  const { setZoom } = React.useContext(ZoomContext);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  let addresses = [];

  const {
    data: { documents: searchedAddresses = [] } = {},
    isValidating
  } = useSWR(
    () =>
      debouncedSearchTerm && debouncedSearchTerm.length > 1
        ? `/api/search?term=${debouncedSearchTerm}`
        : null,
    fetcher
  );

  if (searchedAddresses) {
    addresses = searchedAddresses;
  }

  const handleSearchTermChange = e => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleClick = async (x, y) => {
    const navermaps = window.naver.maps;
    addresses = [];
    setClick(true);

    try {
      NProgress.start();
      setPosition(new navermaps.LatLng(convertNaverLat(y), convertNaverLng(x)));
      setZoom(16);
    } catch (error) {
      notifyError(NETWORK_ERROR_MESSAGE);
    } finally {
      setSearchTerm("");
      setFocus(false);
      await delay(NETWORK_DELAY * 8);
      setClick(false);
      NProgress.done();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="input"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      <button
        type="reset"
        className="search"
        onClick={() => setFocus(!isFocus)}
      />
      <Maybe test={isFocus}>
        <div className="auto-suggestion-container">
          {addresses &&
            addresses.map(({ place_name, category_name, x, y }, index) => (
              <div
                key={index}
                className="auto-suggestion-presenter"
                onClick={() => handleClick(x, y)}
              >
                <Maybe test={index !== 0}>
                  <div className="horizontal-line" />
                </Maybe>
                {place_name}
                <br />
                <span className="place-category">{category_name}</span>
              </div>
            ))}
        </div>
      </Maybe>
      <style jsx>
        {`
          form {
            position: absolute;
            height: 58px;
            width: calc(100vw - 30px);
            margin: 0 15px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          input {
            position: absolute;
            box-sizing: border-box;
            top: 25px;
            right: 35px;
            width: ${isFocus ? "calc(100% - 7px)" : "25px"};
            max-width: 500px;
            height: ${isFocus ? "40px" : "25px"};
            padding-left: 10px;
            border: 3px solid #ffffff;
            border-radius: ${isFocus ? 0 : "50%"};
            background: none;
            color: #fff;
            font-size: 16px;
            font-weight: 400;
            font-family: Roboto;
            outline: 0;
            transition: ${isFocus
              ? "width 0.4s ease-in-out, height 0.6s ease-in-out, border-radius 0.2s ease-in-out, padding 0.2s, transform 0.2s"
              : "width 0.4s ease-in-out, height 0.6s ease-in-out, border-radius 0.8s ease-in-out, padding 0.2s, transform 0.8s"};
            transition-delay: ${isFocus ? "0.4s, 0s, 0.4s" : "0.4s"};
            transform: ${isFocus
              ? "translate(15px, -45%)"
              : "translate(15px, -50%)"};
          }
          .search {
            position: absolute;
            background: none;
            top: 22px;
            right: 0;
            height: 30px;
            width: 30px;
            padding: 0;
            border-radius: 100%;
            outline: 0;
            border: 0;
            cursor: pointer;
            transition: 0.4s ease-in-out;
            transition-delay: 0.4s;
            transform: translate(-100%, -10px);
            &::before {
              content: "";
              position: absolute;
              width: ${isFocus ? "27px" : "15px"};
              height: 3px;
              background: #fff;
              transform: ${isFocus
                ? "translate(-13px, -1px) rotate(45deg)"
                : "translate(18px, 10px) rotate(45deg)"};
              transition: 0.4s ease-in-out;
            }
            &::after {
              content: "";
              position: absolute;
              width: 27px;
              height: 3px;
              background-color: #fff;
              cursor: pointer;
              opacity: ${isFocus ? 1 : 0};
              transform: translate(-13px, -1px) rotate(-45deg);
              transition: opacity 0.4s;
            }
          }
          .square {
            box-sizing: border-box;
            padding: 0 20px 0 10px;
            width: 100%;
            height: 50px;
            border: 3px solid #ffffff;
            border-radius: 0;
            background: none;
            color: #fff;
            font-family: Roboto;
            font-size: 16px;
            font-weight: 400;
            outline: 0;
            transition: width 0.4s ease-in-out, border-radius 0.4s ease-in-out,
              padding 0.2s;
            transition-delay: 0.4s, 0s, 0.4s;
            transform: translate(15px, -50%);
          }
          .auto-suggestion-container {
            position: absolute;
            top: 58px;
            right: 20px;
            width: calc(100vw - 37px);
            max-width: 500px;
            height: auto;
            max-height: 500px;
            overflow-x: hidden;
            overflow-y: scroll;
          }
          .auto-suggestion-presenter {
            position: relative;
            width: calc(100vw - 37px);
            max-width: 500px;
            height: auto;
            padding: 15px 10px;
            background: #fff;
            color: #000;
            font-size: 16px;
            font-weight: 500;
          }
          .place-category {
            color: #666;
            font-size: 12px;
            font-weight: 400;
          }
          .horizontal-line {
            position: absolute;
            top: 0;
            width: calc(100% - 20px);
            height: 0.5px;
            margin: 0 auto;
            background: #e9ecef;
          }
        `}
      </style>
    </form>
  );
};

export default SearchInput;
