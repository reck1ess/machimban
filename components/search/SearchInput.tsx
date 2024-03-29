import NProgress from "nprogress";
import React from "react";

import Maybe from "../common/Maybe";
import { useMapState } from "../../lib/context/MapContext";
import {
  useSearchDispatch,
  useSearchState,
} from "../../lib/context/SearchContext";
import { useStoreDispatch } from "../../lib/context/StoreContext";
import useDebounce from "../../lib/hooks/useDebounce";
import useRequest from "../../lib/hooks/useRequest";
import {
  INITIAL_STORE_STATE,
  NETWORK_ERROR_MESSAGE,
  NETWORK_DELAY,
  SEARCH_INPUT_PLACEHOLDER,
  SET_KEYWORD,
  TOGGLE_FOCUS,
} from "../../lib/utils/constant";
import delay from "../../lib/utils/delay";
import notifyError from "../../lib/utils/notifyError";

const SearchInput = () => {
  const customWindow: any = window;
  const [searchTerm, setSearchTerm] = React.useState("");

  const { isFocus } = useSearchState();
  const dispatch = useSearchDispatch();
  const kakaoMap = useMapState();
  const setStore = useStoreDispatch();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

  let addresses = [];
  let url =
    debouncedSearchTerm.length > 1
      ? `/search?term=${debouncedSearchTerm}`
      : undefined;

  const { data: { documents: searchedAddresses = [] } = {} } = useRequest({
    url,
  });

  if (searchedAddresses) {
    addresses = searchedAddresses;
  }

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleClick = async ({ lat, lng }) => {
    addresses = [];
    setStore(INITIAL_STORE_STATE);

    try {
      NProgress.start();
      kakaoMap.panTo(new customWindow.kakao.maps.LatLng(lat, lng));
      kakaoMap.setLevel(3);
    } catch (error) {
      notifyError(NETWORK_ERROR_MESSAGE);
    } finally {
      dispatch({ type: SET_KEYWORD, keyword: searchTerm });
      setSearchTerm("");
      dispatch({ type: TOGGLE_FOCUS });
      await delay(NETWORK_DELAY * 4);
      NProgress.done();
    }
  };

  React.useEffect(() => {
    if (isFocus) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [isFocus]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        name="input"
        ref={inputRef}
        value={searchTerm}
        disabled={!isFocus}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder={SEARCH_INPUT_PLACEHOLDER}
        onChange={handleSearchTermChange}
        onClick={() => {
          !isFocus && dispatch({ type: TOGGLE_FOCUS });
        }}
      />
      <button
        type="reset"
        className="search"
        onClick={() => dispatch({ type: TOGGLE_FOCUS })}
      />
      <Maybe test={isFocus}>
        <div className="auto-suggestion-container">
          {addresses?.map(({ place_name, category_name, x, y }, index) => (
            <div
              key={index}
              className="auto-suggestion-presenter"
              onClick={() => handleClick({ lat: y, lng: x })}
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
            width: calc(100% - 30px);
            margin: 0 15px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          input {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            box-sizing: border-box;
            top: 25px;
            right: 35px;
            width: ${isFocus ? "calc(100% - 7px)" : "25px"};
            max-width: 500px;
            height: ${isFocus ? "40px" : "25px"};
            padding-left: 10px;
            border: 3px solid #ffffff;
            border-radius: ${isFocus ? "4px" : "50%"};
            background: none;
            color: ${isFocus ? "#fff" : "transparent"};
            font-size: 16px;
            font-weight: 400;
            letter-spacing: -0.87px;
            cursor: pointer;
            transition: ${isFocus
              ? "width 0.4s ease-in-out, height 0.6s ease-in-out, border-radius 0.2s ease-in-out, padding 0.2s, transform 0.2s, color 0.2s"
              : "width 0.4s ease-in-out, height 0.6s ease-in-out, border-radius 0.8s ease-in-out, padding 0.2s, transform 0.2s, color 0.8s"};
            transition-delay: ${isFocus ? "0.4s, 0s, 0.4s" : "0.4s"};
            transform: ${isFocus
              ? "translate(15px, -45%)"
              : "translate(15px, -50%)"};
            -webkit-appearance: none;
            &[type="search"] {
              outline-offset: 0;
              &::-webkit-search-decoration {
                -webkit-appearance: none;
              }
              &::-webkit-search-cancel-button {
                -webkit-appearance: none;
              }
              &::-webkit-search-results-button {
                -webkit-appearance: none;
              }
              &::-webkit-search-results-decoration {
                -webkit-appearance: none;
              }
            }
            &:focus {
              outline: none;
            }
            &:disabled {
              opacity: 1;
            }
            &::placeholder {
              font-size: 16px;
              letter-spacing: -0.87px;
              color: #fff;
              opacity: ${isFocus ? 0.8 : 0};
              transition: opacity 0.4s;
            }
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
            padding-bottom: 40px;
            max-height: 500px;
            overflow-x: hidden;
            overflow-y: scroll;
            @media screen and (min-width: 768px) {
              padding-bottom: 0;
            }
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
            cursor: pointer;
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
