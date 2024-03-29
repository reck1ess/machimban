import dynamic from "next/dynamic";
import React from "react";

import CustomLink from "./CustomLink";
import { useSearchState } from "../../lib/context/SearchContext";

const SearchInput = dynamic(() => import("../search/SearchInput"), {
  ssr: false
});

const Header = () => {
  const { isFocus } = useSearchState();

  return (
    <header>
      <CustomLink href="/" as="/">
        <img className="main-logo" src="/logo.svg" alt="메인 로고" />
      </CustomLink>
      <SearchInput />
      <style jsx>
        {`
          header {
            position: absolute;
            top: 0;
            width: 100%;
            height: 58px;
            background: #8c7ae6;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: #fff;
            font-size: 16px;
            font-weight: 500;
            z-index: 10;
            transition: transform 0.4s, opacity 0.4s;
          }
          .main-logo {
            position: relative;
            margin: 11px;
            width: 36px;
            height: 36px;
            cursor: pointer;
            opacity: ${isFocus ? 0 : 1};
            transition: ${isFocus ? "opacity 0.4s" : "opacity 2s"};
          }
        `}
      </style>
    </header>
  );
};

export default Header;
