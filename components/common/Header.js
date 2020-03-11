import React from "react";

import CustomLink from "./CustomLink";

const Header = () => {
  return (
    <header>
      <CustomLink href="/" as="/">
        <img className="main-logo" src="/logo.svg" alt="메인 로고" />
      </CustomLink>
      <ul className="navbar">
        <li className="nav-item">
          <CustomLink href="/" as="/">
            <img className="icon" src="/search-icon.svg" alt="검색 아이콘" />
          </CustomLink>
        </li>
        <li className="nav-item">
          <CustomLink href="/" as="/" onClick={() => console.log("click!")}>
            <img className="icon" src="/alarm-icon.svg" alt="알람 아이콘" />
          </CustomLink>
        </li>
      </ul>
      <style jsx>
        {`
          header {
            position: absolute;
            width: 100%;
            height: 58px;
            background: #8c7ae6;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: #fff;
            font-size: 16px;
            font-weight: 500;
            z-index: 100;
            transition: transform 0.4s, opacity 0.4s;
          }
          .main-logo {
            position: relative;
            margin: 11px;
            width: 36px;
            height: 36px;
            cursor: pointer;
          }
          .navbar {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 100%;
            height: 58px;
            padding: 0 16px 0 0;
            margin: 0;
            list-style: none;
          }
          .nav-item {
            margin-left: 8px;
            cursor: pointer;
          }
          .icon {
            width: 30px;
            height: 30px;
            padding: 3px;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
