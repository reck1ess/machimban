import React from "react";

interface ToggleButtonProps {
  open: boolean;
  zoom: number;
  handleClick: () => void;
}

const ToggleButton = ({ open, zoom, handleClick }: ToggleButtonProps) => {
  return (
    <button className="toggle-button" onClick={handleClick}>
      {open ? "지도로 보기" : "목록으로 보기"}
      <style jsx>
        {`
          .toggle-button {
            position: fixed;
            bottom: 20px;
            left: 0;
            right: 0;
            display: ${zoom < 6 ? "block" : "none"};
            margin-left: auto;
            margin-right: auto;
            width: 160px;
            height: 45px;
            border: none;
            border-radius: 25px;
            background: #8c7ae6;
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            z-index: 11;
            outline: none;
            opacity: ${open ? 0.7 : 1};
            transition: opacity 1s;
            @media screen and (min-width: 768px) {
              bottom: 35px;
            }
          }
        `}
      </style>
    </button>
  );
};

export default ToggleButton;
